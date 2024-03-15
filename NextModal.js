// ChatPage.js
import React, {useState, useEffect, useRef, useMemo} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  useWindowDimensions,
  KeyboardAvoidingView,
} from 'react-native';
import Svg, {Circle, G, Path, Defs, ClipPath, Rect} from 'react-native-svg';
import FileUploader from './fileUploader/FileUploader';
import CentionIcons from './cention-icons';
import {useWebSocket} from './WebSocketService';
import HTML from 'react-native-render-html';
import {env, postUploadAnswerAttachment} from './api_env';

// Define the ChatPage component using React.memo for performance optimization
const NextModal = React.memo(
  ({
    question,
    email,
    workSpace,
    widgetId,
    name,
    areaId,
    primaryColor,
    headerColor,
    chatBgColor,
    chatTextColor,
    clientBgColor,
    agentBgColor,
    inputBgColor,
    inputTextColor,
    titleText,
    availableAgents,
    newChat,
    toggleChatModal,
  }) => {
    // State hooks for managing chat messages, UI states, and user inputs
    const [chatMessages, setChatMessages] = useState([]);
    const scrollViewRef = useRef(); // Reference to the ScrollView for automatic scrolling
    const [messages2, setMessage2] = useState(''); // State for input text
    const [messagesP, setMessageP] = useState(''); // State for preview messages
    const hitSlop = {top: 10, bottom: 10, left: 20, right: 20}; // Area for touchable opacity
    const [isDropdownOpen1, setIsDropdownOpen1] = useState(false); // Dropdown state
    const [selectedFile, setSelectedFile] = useState(null); // State for file selection
    const [loading, setLoading] = useState(true); // Loading state for initial load animation
    const [animationProgress, setAnimationProgress] = useState(1); // Animation progress state
    const [animationCompleted, setAnimationCompleted] = useState(false); // Animation completion flag
    const [initialLoad, setInitialLoad] = useState(true); // Flag to check if it's the initial load
    const [clientName, setClientName] = useState(''); // State to store client's name
    const [chatEnded, setChatEnded] = useState(false); // State to indicate if the chat has ended
    const opacity = animationCompleted ? 1 : animationProgress / 70; // Calculate opacity for loading animation
    const fillColor = `rgba(${parseInt(
      primaryColor.substring(1, 3),
      16,
    )}, ${parseInt(primaryColor.substring(3, 5), 16)}, ${parseInt(
      primaryColor.substring(5, 7),
      16,
    )}, ${opacity})`; // Calculate fill color based on primaryColor and opacity
    const tagStyles = useMemo(
      () => ({
        body: {
          color: 'grey',
          fontSize: 12,
        },
      }),
      [],
    ); // Memoize tag styles for performance optimization

    // Function to handle the creation of a new chat
    const handleCreateNewChat = async () => {
      newChat();
    };

    // Function to handle the end of a chat
    const handleEndChat = async () => {
      sendCloseChat();
      setTimeout(() => {
        newChat();
      }, 800);
    };

    // Destructure functions from useWebSocket hook
    const {
      sendMessageToWebSocket,
      sendCloseChat,
      sendRegistrationData,
      newMessage,
      noSession,
      sendAttachmentToWebSocket,
      sessionId,
      agentAvailable,
      sessionSecret,
      removeWebsocket,
    } = useWebSocket(workSpace, areaId);

    // Effect hook to send registration data on component mount
    useEffect(() => {
      sendRegistrationData({name, email, question});
    }, []);

    // Function to toggle the dropdown
    const handleDropdownToggle1 = () => {
      setIsDropdownOpen1(!isDropdownOpen1);
    };

    // Function to close the dropdown
    const handleCloseDropdown1 = () => {
      setIsDropdownOpen1(false);
    };

    // Function to handle overlay press
    const handleOverlayPress1 = () => {
      setIsDropdownOpen1(false);
    };

    // Function to handle file upload attachment
    const handleUploadAttachment = async dataFiles => {
      if (dataFiles) {
        const result = await postUploadAnswerAttachment(dataFiles, workSpace);
        sendAttachmentToWebSocket(result);
      }
      setIsDropdownOpen1(false);
    };

    // Effect hook to process new messages upon receiving
    useEffect(() => {
      if (newMessage && newMessage.length > 0 && initialLoad) {
        const allMessages = newMessage[0].message;
        setClientName(newMessage[0].clientName);
        allMessages.map(parseNewMessages);
        setInitialLoad(false);
      }
    }, [newMessage]);

    // Effect hook to scroll to the bottom when new messages are received
    useEffect(() => {
      const scrollDelay = setTimeout(() => {
        if (scrollViewRef.current) {
          scrollViewRef.current.scrollToEnd({animated: true});
        }
      }, 0); // Adjust the delay time as needed (in milliseconds)

      return () => clearTimeout(scrollDelay);
    }, [newMessage]);

    // Similar effect hook for processing messages but after initial load
    useEffect(() => {
      if (newMessage && newMessage.length > 0 && !initialLoad) {
        const latestMessage =
          newMessage[0].message[newMessage[0].message.length - 1];
        const parsedMessage = parseNewMessages(latestMessage);
        setClientName(newMessage[0].clientName);
        setChatMessages(prevMessages => [...prevMessages, parsedMessage]);
      }
    }, [newMessage]);

    // Function to parse new messages and update UI
    const parseNewMessages = newMessage => {
      const result = {
        agent: newMessage.agent,
        agentId: newMessage.aid,
        channel: 'chat',
        dead: '',
        message: updateImageUrls(newMessage.text),
        timestamp: newMessage.sentHuman,
      };

      setChatMessages(prevMessages => [...prevMessages, result]);
    };

    // Function to update image URLs within message content
    function updateImageUrls(message) {
      if (message) {
        const baseUrl = `${env.URL}/s/${workSpace}/s/${workSpace}`;
        const hasJsonPrefix = message.includes('JSON');
        if (hasJsonPrefix) {
          const cleanedMessage = message.replace(/.*?JSON/g, '');
          const parseMessage = JSON.parse(cleanedMessage);
          const fileURL = baseUrl + parseMessage.fileDownload;
          const fileName = parseMessage.fileName;
          const url = `<a title="${fileName}" href="${fileURL}"><img src="${fileURL}" alt="${fileName}" style="max-width:200px;max-height:200px"/></a>`;
          return url;
        }
        const regex = /<img src="([^"]+)"[^>]*>/g;
        const updatedMessage = message.replace(regex, (match, src) => {
          if (!src.startsWith(baseUrl)) {
            return match.replace(src, baseUrl + src);
          }
          return match;
        });
        return updatedMessage;
      }
    }

    // Use Window dimensions to adjust content width dynamically
    const {width} = useWindowDimensions();

    //  function to handle attachment removal
    const handleRemoveAttachment = async () => {
      //TODO
    };

    // Effect hook to manage loading and animation state
    useEffect(() => {
      let interval;

      if (loading && !animationCompleted) {
        interval = setInterval(() => {
          setAnimationProgress(prev => {
            const nextProgress = (prev + 0.5) % 101;

            if (nextProgress === 1) {
              clearInterval(interval);
              setLoading(false);
              setAnimationCompleted(true);
            }

            return nextProgress;
          });
        }, 16);
      }

      return () => {
        if (interval) {
          clearInterval(interval);
        }
      };
    }, [loading, animationCompleted]);

    // Function to handle sending messages
    const handleSendMessage = async () => {
      try {
        if (messages2.trim() === '') return;
        sendMessageToWebSocket(messages2);
        setMessage2('');

        scrollViewRef.current.scrollToEnd({animated: true});
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    // Similar effect hook to handleSendMessage but for message previews
    useEffect(() => {
      const timer = setTimeout(() => {
        setLoading(false);
      }, 3000);

      return () => clearTimeout(timer);
    }, []);

    const handleSendMessagePreview = async () => {
      try {
        if (messagesP.trim() === '') return;
        sendMessageToWebSocket(messagesP);
        setMessageP('');

        scrollViewRef.current.scrollToEnd({animated: true});
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    useEffect(() => {
      const timer = setTimeout(() => {
        setLoading(false);
      }, 3000);

      return () => clearTimeout(timer);
    }, []);

    // Function to render the chat input footer
    const renderFooter = () => {
      // KeyboardAvoidingView to ensure the input field is visible when the keyboard is displayed
      return (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          {/* Chat input container */}
          <View style={chatStyles.inputContainer}>
            {/* Input wrapper to style and position the text input and send button */}
            <View style={chatStyles.inputWrapper}>
              <TextInput
                style={[
                  chatStyles.input,
                  {
                    backgroundColor: inputBgColor,
                    borderColor: primaryColor,
                  },
                ]}
                placeholder="Write a reply"
                value={messages2}
                onChangeText={text => setMessage2(text)}
              />
              {/* Menu bar container for additional actions like opening the file uploader */}
              <View style={chatStyles.menuBarContainer}>
                <View style={chatStyles.menuBarLeft}>
                  <TouchableOpacity
                    onPress={handleDropdownToggle1}
                    hitSlop={hitSlop}>
                    <Svg
                      width="22"
                      height="22"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg">
                      <Path
                        id="Path 583"
                        d="M18.75 9.5H10.5V1.25C10.5 1.05109 10.421 0.860322 10.2803 0.71967C10.1397 0.579018 9.94891 0.5 9.75 0.5C9.55109 0.5 9.36032 0.579018 9.21967 0.71967C9.07902 0.860322 9 1.05109 9 1.25V9.5H0.75C0.551088 9.5 0.360322 9.57902 0.21967 9.71967C0.0790176 9.86032 0 10.0511 0 10.25C0 10.4489 0.0790176 10.6397 0.21967 10.7803C0.360322 10.921 0.551088 11 0.75 11H9V19.25C9 19.4489 9.07902 19.6397 9.21967 19.7803C9.36032 19.921 9.55109 20 9.75 20C9.94891 20 10.1397 19.921 10.2803 19.7803C10.421 19.6397 10.5 19.4489 10.5 19.25V11H18.75C18.9489 11 19.1397 10.921 19.2803 10.7803C19.421 10.6397 19.5 10.4489 19.5 10.25C19.5 10.0511 19.421 9.86032 19.2803 9.71967C19.1397 9.57902 18.9489 9.5 18.75 9.5Z"
                        fill={primaryColor}
                      />
                    </Svg>
                  </TouchableOpacity>
                  <FileUploader
                    sessionId={sessionId}
                    sessionSecret={sessionSecret}
                    areaId={areaId}
                    style={chatStyles.dropdownItem1}
                    isDropdownOpen1={isDropdownOpen1}
                    handleCloseDropdown1={handleCloseDropdown1}
                    maxFileAllowed={10000000}
                    handleOverlayPress1={handleOverlayPress1}
                    uploadAttachment={handleUploadAttachment}
                    removeAttachment={handleRemoveAttachment}
                    handleEndChat={handleEndChat}
                    uploadTo={'errand/uploadAnswerAttachment'}
                    selectedFile={selectedFile}
                    setSelectedFile={setSelectedFile}
                    renderFooter={renderFooterPreview}
                    chatEnded={chatEnded}
                    handleSendMessage={handleSendMessagePreview}
                  />
                </View>
                <View style={chatStyles.menuBarRight}>
                  <TouchableOpacity
                    onPress={handleSendMessage}
                    hitSlop={hitSlop}>
                    <Svg
                      width="22"
                      height="22"
                      viewBox="0 0 20 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg">
                      <Path
                        id="Path 451"
                        d="M18.6206 7.63467L2.12065 0.134668C1.84804 0.010771 1.54459 -0.0287009 1.24936 0.0213336C0.95413 0.0713681 0.680631 0.208619 0.464071 0.415418C0.24751 0.622218 0.0978001 0.8891 0.0342121 1.18171C-0.0293759 1.47432 -0.00393137 1.77927 0.10727 2.05729L2.88452 9.00004L0.10727 15.9428C-0.00393137 16.2208 -0.0293759 16.5258 0.0342121 16.8184C0.0978001 17.111 0.24751 17.3779 0.464071 17.5847C0.680631 17.7915 0.95413 17.9287 1.24936 17.9788C1.54459 18.0288 1.84804 17.9893 2.12065 17.8654L18.6206 10.3654C18.8827 10.2462 19.105 10.0541 19.2608 9.81194C19.4167 9.56983 19.4996 9.28798 19.4996 9.00004C19.4996 8.71211 19.4167 8.43025 19.2608 8.18814C19.105 7.94603 18.8827 7.75389 18.6206 7.63467ZM1.50002 16.5L4.20002 9.75004H8.25002C8.44893 9.75004 8.6397 9.67103 8.78035 9.53037C8.921 9.38972 9.00002 9.19896 9.00002 9.00004C9.00002 8.80113 8.921 8.61037 8.78035 8.46971C8.6397 8.32906 8.44893 8.25004 8.25002 8.25004H4.20002L1.50002 1.50004L18 9.00004L1.50002 16.5Z"
                        fill={primaryColor}
                      />
                    </Svg>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      );
    };
    // Similar to renderFooter but specific to preview
    const renderFooterPreview = onSend => {
      return (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={chatStyles.inputContainer}>
            <View style={chatStyles.inputWrapper}>
              <View style={chatStyles.menuBarContainer}>
                <View style={chatStyles.menuBarLeft}>
                  <TouchableOpacity hitSlop={hitSlop}>
                    {/* <Svg
                   
                    width="25"
                    height="25"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <Path
                      d="M6 5.5V11.4675C5.99575 11.6215 5.8905 12.974 3.5 12.974C1.1095 12.974 1.00425 11.6215 1 11.474V2.50275C1.003 2.25175 1.08875 1 2.5 1C3.91125 1 3.997 2.25175 4 2.5V9.49425C4.00719 9.56193 3.99926 9.63037 3.97676 9.6946C3.95426 9.75884 3.91777 9.81727 3.86991 9.86567C3.82206 9.91408 3.76405 9.95124 3.70007 9.97447C3.6361 9.9977 3.56776 10.0064 3.5 10C3.4327 10.0066 3.36478 9.99821 3.30111 9.97542C3.23745 9.95263 3.17963 9.916 3.13181 9.86819C3.084 9.82037 3.04737 9.76255 3.02458 9.69889C3.00179 9.63522 2.99339 9.5673 3 9.5V5.5C3 5.36739 2.94732 5.24021 2.85355 5.14645C2.75979 5.05268 2.63261 5 2.5 5C2.36739 5 2.24021 5.05268 2.14645 5.14645C2.05268 5.24021 2 5.36739 2 5.5V9.5C1.99416 9.69857 2.02896 9.89624 2.10227 10.0809C2.17559 10.2655 2.28586 10.4332 2.42633 10.5737C2.5668 10.7141 2.7345 10.8244 2.91913 10.8977C3.10376 10.971 3.30143 11.0058 3.5 11C3.69857 11.0058 3.89624 10.971 4.08087 10.8977C4.2655 10.8244 4.4332 10.7141 4.57367 10.5737C4.71414 10.4332 4.82441 10.2655 4.89773 10.0809C4.97104 9.89624 5.00584 9.69857 5 9.5V2.5C5 1.63525 4.4775 0 2.5 0C0.5225 0 0 1.63525 0 2.5V11.475C0 11.5 0.04 13.975 3.5 13.975C6.96 13.975 7 11.5 7 11.475V5.5C7 5.36739 6.94732 5.24021 6.85355 5.14645C6.75979 5.05268 6.63261 5 6.5 5C6.36739 5 6.24021 5.05268 6.14645 5.14645C6.05268 5.24021 6 5.36739 6 5.5Z"
                      fill="#6D6D6D"
                    />
                  </Svg> */}
                  </TouchableOpacity>

                  <FileUploader
                    sessionId={sessionId}
                    sessionSecret={sessionSecret}
                    areaId={areaId}
                    style={chatStyles.dropdownItem1}
                    isDropdownOpen1={isDropdownOpen1}
                    handleCloseDropdown1={handleCloseDropdown1}
                    maxFileAllowed={10000000}
                    handleOverlayPress1={handleOverlayPress1}
                    uploadAttachment={handleUploadAttachment}
                    removeAttachment={handleRemoveAttachment}
                    uploadTo={'errand/uploadAnswerAttachment'}
                    selectedFile={selectedFile}
                    setSelectedFile={setSelectedFile}
                    renderFooter={renderFooter}
                    chatEnded={chatEnded}
                    message={messagesP}
                  />
                </View>
                <View style={chatStyles.menuBarRight}>
                  <TouchableOpacity onPress={onSend} hitSlop={hitSlop}>
                    <Svg
                      width="30"
                      height="20"
                      viewBox="0 0 20 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg">
                      <Path
                        id="Path 451"
                        d="M18.6206 7.63467L2.12065 0.134668C1.84804 0.010771 1.54459 -0.0287009 1.24936 0.0213336C0.95413 0.0713681 0.680631 0.208619 0.464071 0.415418C0.24751 0.622218 0.0978001 0.8891 0.0342121 1.18171C-0.0293759 1.47432 -0.00393137 1.77927 0.10727 2.05729L2.88452 9.00004L0.10727 15.9428C-0.00393137 16.2208 -0.0293759 16.5258 0.0342121 16.8184C0.0978001 17.111 0.24751 17.3779 0.464071 17.5847C0.680631 17.7915 0.95413 17.9287 1.24936 17.9788C1.54459 18.0288 1.84804 17.9893 2.12065 17.8654L18.6206 10.3654C18.8827 10.2462 19.105 10.0541 19.2608 9.81194C19.4167 9.56983 19.4996 9.28798 19.4996 9.00004C19.4996 8.71211 19.4167 8.43025 19.2608 8.18814C19.105 7.94603 18.8827 7.75389 18.6206 7.63467ZM1.50002 16.5L4.20002 9.75004H8.25002C8.44893 9.75004 8.6397 9.67103 8.78035 9.53037C8.921 9.38972 9.00002 9.19896 9.00002 9.00004C9.00002 8.80113 8.921 8.61037 8.78035 8.46971C8.6397 8.32906 8.44893 8.25004 8.25002 8.25004H4.20002L1.50002 1.50004L18 9.00004L1.50002 16.5Z"
                        fill={primaryColor}
                      />
                    </Svg>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      );
    };

    // Function to render individual chat messages
    const renderMessage = (message, index) => {
      let messageData;
      try {
        messageData = JSON.parse(message.message);
        removeWebsocket();
      } catch (e) {
        messageData = null;
      }
      if (
        messageData &&
        (messageData.event === 'OWNER_ENDS_CHAT' ||
          messageData.event === 'CLIENT_ENDS_CHAT')
      ) {
        if (!chatEnded) {
          setChatEnded(true);
        }

        return (
          <View
            style={[
              chatStyles.rightMessage1,
              {backgroundColor: clientBgColor},
            ]}>
            <Text style={[chatStyles.specialMessageText, {color: '#6D6D6D'}]}>
              Chat Ended by{' '}
              {messageData.who ? messageData.who : messageData.name}
            </Text>
          </View>
        );
      }
      if (message?.agent) {
        if (message.message) {
          return (
            <View key={index} style={chatStyles.messageContainerLeft}>
              <Svg width="30" height="30" viewBox="0 0 32 32" fill="none">
                <Circle cx="16" cy="16" r="16" fill="#E2E2E2" />
                <G clipPath="url(#clip0_3957_126380)">
                  <Path
                    d="M16.0062 16C17.5452 16 19 14.545 19 13.0057C19 11.4532 17.5792 10.0207 16.0192 10H15.9868C14.4515 10 13 11.4605 13 13.0057C13 14.545 14.461 16 16.0062 16Z"
                    fill="#989898"
                  />
                  <Path
                    d="M17 17H15C13.9395 17.0013 12.9228 17.4231 12.173 18.173C11.4231 18.9228 11.0013 19.9395 11 21V22C11 22.2652 11.1054 22.5196 11.2929 22.7071C11.4804 22.8946 11.7348 23 12 23H20C20.2652 23 20.5196 22.8946 20.7071 22.7071C20.8946 22.5196 21 22.2652 21 22V21C20.9987 19.9395 20.5769 18.9228 19.827 18.173C19.0772 17.4231 18.0605 17.0013 17 17Z"
                    fill="#989898"
                  />
                </G>
                <Defs>
                  <ClipPath id="clip0_3957_126380">
                    <Rect
                      width="16"
                      height="16"
                      fill="white"
                      transform="translate(8 8)"
                    />
                  </ClipPath>
                </Defs>
              </Svg>
              {/* Agent Message */}
              <View
                style={[chatStyles.message, {backgroundColor: agentBgColor}]}>
                <View style={chatStyles.messageContent}>
                  <Text style={chatStyles.senderName}>{message.agent}</Text>
                  <ScrollView horizontal={true}>
                    <HTML
                      tagsStyles={tagStyles}
                      source={{html: message.message}}
                      contentWidth={width}
                    />
                  </ScrollView>
                </View>
              </View>
            </View>
          );
        }
      } else {
        // Client Message
        if (message?.message) {
          return (
            <View key={index} style={chatStyles.messageContainerRight}>
              <View
                style={[
                  chatStyles.rightMessage,
                  {backgroundColor: clientBgColor},
                ]}>
                <View style={chatStyles.messageContent}>
                  <Text style={chatStyles.senderName}>
                    {name ? name : clientName}
                  </Text>
                  <ScrollView horizontal={true}>
                    <HTML
                      tagsStyles={tagStyles}
                      source={{html: message.message}}
                      contentWidth={width}
                    />
                  </ScrollView>
                </View>
              </View>
            </View>
          );
        }
      }
    };
    // Main component render logic
    return (
      <>
        {loading && (
          <View style={chatStyles.container}>
            <View style={chatStyles.svgContainer}>
              <CentionIcons
                name="chats"
                size={70}
                fontWeight="400"
                color={fillColor}
              />
            </View>
          </View>
        )}
        {!loading && noSession && (
          // This part will render when noSession is true
          <View style={chatStyles.sessionEndedContainer}>
            <CentionIcons
              name="chatbot"
              size={70}
              fontWeight="400"
              color={fillColor}
            />

            <Text style={chatStyles.sessionEndedText}>
              The chat is ended by our agent. Please create a new chat.
            </Text>
            <TouchableOpacity
              style={[chatStyles.newChatButton, {borderColor: fillColor}]}
              onPress={handleCreateNewChat}>
              <Text style={[chatStyles.newChatButtonText, {color: fillColor}]}>
                Create New Chat
              </Text>
            </TouchableOpacity>
          </View>
        )}
        {!loading && availableAgents && !noSession && (
          <View style={[chatStyles.container, {backgroundColor: chatBgColor}]}>
            <View
              style={[chatStyles.actionBar, {backgroundColor: primaryColor}]}>
              <TouchableOpacity
                style={chatStyles.actionIcon}
                hitSlop={hitSlop}
                onPress={toggleChatModal}>
                <CentionIcons
                  name="chevron-mini-down"
                  size={22}
                  fontWeight="800"
                  color={headerColor}
                />
              </TouchableOpacity>
              <Text style={[chatStyles.title, {color: headerColor}]}>
                {titleText}
              </Text>
            </View>
            <ScrollView
             scrollEventThrottle={1}
            //  pagingEnabled={true}
              ref={scrollViewRef}
              contentContainerStyle={[
                chatStyles.messageContainer,
                {backgroundColor: chatBgColor},
              ]}>
              {chatMessages.map(renderMessage)}
            </ScrollView>
            {renderFooter()}
          </View>
        )}
        {!loading && !availableAgents && !noSession && (
          <View style={chatStyles.container}>
            <View
              style={{
                width: '50%',
                alignSelf: 'center',
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <CentionIcons
                name="chat-close"
                size={70}
                fontWeight="400"
                color={fillColor}
              />
              <Text
                style={{
                  textAlign: 'center',
                  paddingTop: 8,
                  color: primaryColor,
                  fontSize: 12,
                  fontFamily: 'Roboto',
                  fontWeight: '800',
                }}>
                Ops,There are no available agents now.
              </Text>
            </View>
          </View>
        )}
      </>
    );
  },
);

// Styles for the component
const chatStyles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    borderRadius: 10,
  },
  sendMessageButton: {
    width: 58,
    height: 32,
    backgroundColor: '#0C87F7',
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 14,
    alignItems: 'flex-start',
    marginRight: 16,
  },
  actionBar: {
    width: '100%',
    height: 'auto',
    borderBottomEndRadius: 0,
    borderBottomStartRadius: 0,
    borderTopEndRadius: 10,
    borderTopStartRadius: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    zIndex: 2,
  },
  svgContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionIcon: {
    marginLeft: -5,
    marginRight: -18,
    marginBottom: 15, // Adjust the margin as needed
  },
  title: {
    flex: 1, // Let the title take remaining space
    textAlign: 'center', // Center the text
    color: '#0C87F7',
    fontSize: 16,
    fontFamily: 'Roboto',
    fontWeight: '700',
    lineHeight: 20,
    marginBottom: 20, // Adjust the margin as needed
  },

  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // 0.5 black transparency
  },

  messageContainer: {
    paddingBottom: 20,
    paddingTop: 20,
    paddingLeft: 16,
    paddingRight: 16,
  },
  messageContainerLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: '94%',
    height: 'auto',
    paddingRight: 16,
    // paddingLeft: 16,
    paddingTop: 16,
    // right: '5%',
  },
  messageContainerRight: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: '94%',
    height: 'auto',
    paddingRight: 16,
    paddingLeft: 16,
    paddingTop: 16,
  },
  message: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
    backgroundColor: 'white',
    borderWidth: 1,
    borderBottomEndRadius: 10,
    borderBottomStartRadius: 10,
    borderTopEndRadius: 10,
    borderTopStartRadius: 0,
    borderColor: '#EAEAEA',
    paddingRight: 16,
    paddingLeft: 16,
    paddingTop: 8,
    paddingBottom: 8,
    marginLeft: 16,
    marginRight: 16,
  },

  rightMessage: {
    width: '94%',
    height: 'auto',
    alignItems: 'flex-start',
    marginBottom: 10,
    backgroundColor: '#F8F8F8',
    borderWidth: 1,
    borderBottomEndRadius: 10,
    borderBottomStartRadius: 10,
    borderTopEndRadius: 0,
    borderTopStartRadius: 10,
    borderColor: '#EAEAEA',
    paddingRight: 16,
    paddingLeft: 16,
    paddingTop: 8,
    paddingBottom: 8,
    marginLeft: 45,
    marginRight: 16,
  },
  rightMessage1: {
    width: 'auto',
    height: 'auto',
    alignItems: 'center',
    marginBottom: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    paddingRight: 16,
    paddingLeft: 16,
    marginLeft: 20,
    marginRight: 16,
  },

  avatar: {
    width: 28,
    height: 28,
    padding: 5,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    top: 8,
  },

  messageContent: {
    flex: 1,
  },
  senderName: {
    color: '#6D6D6D',
    fontSize: 12,
    fontFamily: 'Roboto',
    fontWeight: '700',
    lineHeight: 16,
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  agentName: {
    color: '#6D6D6D',
    fontSize: 12,
    fontFamily: 'Roboto',
    fontWeight: '700',
    lineHeight: 16,
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  messageText: {
    color: '#6D6D6D',
    fontSize: 12,
    fontFamily: 'Roboto',
    fontWeight: '400',
    lineHeight: 20,
    flexWrap: 'wrap',
  },
  specialMessageText: {
    color: '#6D6D6D',
    fontSize: 11,
    fontFamily: 'Roboto',
    fontWeight: '400',
    lineHeight: 20,
    flexWrap: 'wrap',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 'auto',
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderColor: '#EAEAEA',
    borderBottomEndRadius: 10,
    borderBottomStartRadius: 10,
    borderTopEndRadius: 0,
    borderTopStartRadius: 0,
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8F8F8',
  },
  inputWrapper: {
    flex: 1,
    paddingTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  input: {
    width: '70%',
    height: 32,
    borderBottomWidth: 0.7,
    borderRightWidth: 0.7,
    borderTopWidth: 0.15,
    borderLeftWidth: 0.15,
    borderColor: '#0C87F7',
    borderRadius: 6,
    fontSize: 12,
    fontFamily: 'Roboto',
    fontWeight: '400',
    lineHeight: 16,
    position: 'absolute',
    backgroundColor: 'white',
    paddingRight: 8,
    paddingLeft: 8,
    paddingTop: 4,
    paddingBottom: 4,
    zIndex: 999,
  },
  inputP: {
    width: '70%',
    height: 32,
    borderBottomWidth: 0.7,
    borderRightWidth: 0.7,
    borderTopWidth: 0.15,
    borderLeftWidth: 0.15,
    borderColor: '#0C87F7',
    borderRadius: 6,
    fontSize: 12,
    fontFamily: 'Roboto',
    fontWeight: '400',
    lineHeight: 16,
    position: 'absolute',
    backgroundColor: 'white',
    paddingRight: 8,
    paddingLeft: 8,
    paddingTop: 4,
    paddingBottom: 4,
    zIndex: 999,
  },
  menuBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  menuBarLeft: {
    bottom: 5,
  },
  menuBarRight: {
    flex: 1,
    alignItems: 'flex-end',
    bottom: 5,
  },

  dropdownMenu1: {
    position: 'absolute',
    bottom: '11.5%', // Position below the button
    left: '5%',
    backgroundColor: 'white',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 4,

    zIndex: 999,
  },

  dropdownItem1: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 12,
    paddingLeft: 12,
    paddingTop: 16,
    paddingBottom: 16,
  },

  dropdownItemContent1: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropdownText1: {
    marginLeft: 10,
    color: '#6D6D6D',
    fontSize: 12,
    fontFamily: 'Roboto',
    fontWeight: '400',
    lineHeight: 20,
    flexWrap: 'wrap',
  },

  dropdownTextgdg: {
    marginTop: 5,
    color: '#6D6D6D',
    fontSize: 12,
    fontFamily: 'Roboto',
    fontWeight: '400',
    lineHeight: 20,
    flexWrap: 'wrap',
  },
  value: {
    fontSize: 12,
  },
  sessionEndedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  sessionEndedText: {
    marginTop: 5,
    color: '#6D6D6D',
    fontSize: 12,
    fontFamily: 'Roboto',
    fontWeight: '400',
    lineHeight: 20,
    flexWrap: 'wrap',
    textAlign: 'center',
    marginBottom: 40,
    paddingHorizontal: 30,
  },
  newChatButton: {
    padding: 10,
    borderBottomWidth: 0.7,
    borderRightWidth: 0.7,
    borderTopWidth: 0.15,
    borderLeftWidth: 0.15,
    borderRadius: 12,
    width: '60%',
    alignItems: 'center',
  },
  newChatButtonText: {},
});

export default NextModal;
