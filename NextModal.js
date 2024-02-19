// ChatPage.js
import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TextInput,
  Image,
  Modal,
  FlatList,
  useWindowDimensions,
  KeyboardAvoidingView,
} from 'react-native';
import Svg, {Circle, G, Path, Defs, ClipPath, Rect} from 'react-native-svg';
import FileUploader from './fileUploader/FileUploader';
import CentionIcons from './cention-icons';
import {useWebSocket} from './WebSocketService';
import HTML from 'react-native-render-html';
import { env } from './api_env';

const NextModal = React.memo(({
  question,
  email,
  workSpace,
  widgetId,
  name,
  primaryColor,
  headerColor,
  chatBgColor,
  chatTextColor,
  clientBgColor,
  agentBgColor,
  inputBgColor,
  inputTextColor,
  titleText,
}) => {
  const [chatMessages, setChatMessages] = useState([]);
  const scrollViewRef = useRef();
  const [messages2, setMessage2] = useState('');
  const hitSlop = {top: 10, bottom: 10, left: 20, right: 20};
  const [isAttachAvailable, setIsAttachAvailable] = useState(false);
  const [isDropdownOpen1, setIsDropdownOpen1] = useState(false);
  const [isChat, setIsChat] = useState(false);
  const [agentName, setAgentName] = useState(null);
  const [agentId, setAgentId] = useState(null);
  // const [sessionId, setSessionId] = useState('')
  // const [sessionSecret, setSessionSecret] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fId, setFId] = useState(null);
  const [attachmentURL, setAttouchmentURL] = useState([]);
  const [isPreviewModalVisible, setPreviewModalVisible] = useState(false);
  const tagStyles = useMemo(() => ({
    body: {
      color: 'grey',
      fontSize: 12,
    },
  }), []);

  const postUploadAnswerAttachment = async body => {
    console.log(`${env.URL}/s/${workSpace}/Cention/web/chat/client/uploadAttachment`)
    const response = await fetch(
      `${env.URL}/s/${workSpace}/Cention/web/chat/client/uploadAttachment`,
      {
        method: 'POST',
        headers: {
          Accept: '*/*',
          'Content-Type': 'multipart/form-data',
        },
        credentials: 'same-origin',
        body: body,
      },
    );
    return handleResponse(response);
  };

  const handleResponse = async response => {
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      throw new Error(
        'Error: ' + response.status + ' - ' + response.statusText,
      );
    }
  };

  const {
    sendMessageToWebSocket,
    sendDeleteErrand,
    sendRegistrationData,
    newMessage,
    sendAttachmentToWebSocket,
    sessionId,
    sessionSecret,
  } = useWebSocket(workSpace, widgetId);
  useEffect(() => {
    sendRegistrationData({name, email, question});
  }, []);
  const handleDropdownToggle1 = () => {
    setIsDropdownOpen1(!isDropdownOpen1);
  };
  const handleCloseDropdown1 = () => {
    console.log('here');
    setIsDropdownOpen1(false);
  };
  const handleOverlayPress1 = () => {
    setIsDropdownOpen1(false);
  };
  const handleUploadAttachment = async dataFiles => {
    if (dataFiles) {
      const result = await postUploadAnswerAttachment(dataFiles);
      console.log(result);
      // const PROD_URL = 'https://cloud-qa.cention.com/s/tobias';
      setFId(result.id);
      // if (messages) {
      let mcount = chatMessages.length;
      sendAttachmentToWebSocket(result);
      // const newMessage = {
      //   sender: agentName,
      //   message: `<a title=\"${result.value}\" href=\"${env.PROD_URL + result.download + '?t=' + sessionSecret
      //     }\"><img src=\"${env.PROD_URL + result.download + '?t=' + sessionSecret
      //     }\" alt=\"${result.value
      //     }\" style=\"max-width:200px;max-height:200px\"/></a>`,
      //   id: id,
      //   timestamp: timestamp,
      // };

      // }
    }
    setIsDropdownOpen1(false);
  };
  useEffect(() => {
    console.log('ollllllll', newMessage);
    if (newMessage && newMessage.length > 0) {
      const index = newMessage[0]?.message?.length - 1;
      // if (id === newMessage[0]?.errandId)
      parseNewMessages(newMessage[0].message[index]);
    }
  }, [newMessage]);
  const parseNewMessages = newMessage => {
    const result = {
      agent: newMessage.agent,
      agentId: newMessage.aid,
      channel: 'chat',
      dead: '',
      message: updateImageUrls(newMessage.text),
      sender: 'newMessage.fromClient ? sender : newMessage.agent',
      timestamp: newMessage.sentHuman,
    };
    setChatMessages(prevMessages => [...prevMessages, result]);
  };
  function updateImageUrls(message) {
    if (message) {
      const baseUrl = `${env.URL}/s/${workSpace}/s/${workSpace}`;
      const hasJsonPrefix = message.includes('JSON');
      if (hasJsonPrefix) {
        const cleanedMessage = message.replace(/.*?JSON/g, '');
        const parseMessage = JSON.parse(cleanedMessage);
        const fileURL = baseUrl + parseMessage.fileDownload;
        const fileName = parseMessage.fileName;
        // const url = ` <a href=${fileURL}></a>`

        const url = `<a title="${fileName}" href="${fileURL}"><img src="${fileURL}" alt="${fileName}" style="max-width:200px;max-height:200px"/></a>`;
        console.log({url});
        return url;
      }
      const regex = /<img src="([^"]+)"[^>]*>/g;
      const updatedMessage = message.replace(regex, (match, src) => {
        console.log({src});
        if (!src.startsWith(baseUrl)) {
          return match.replace(src, baseUrl + src);
        }
        return match;
      });
      console.log({updatedMessage});
      return updatedMessage;
    }
  }
  const {width} = useWindowDimensions();
  const handleRemoveAttachment = async () => {
    if (fId) {
      const result = await postRemoveTempAttachment(fId);
      // console.log('=====================>', result);
    }
  };

  const handleSendMessage = async () => {
    try {
      let mcount = chatMessages.length;

      if (messages2.trim() === '') return;
      sendMessageToWebSocket(messages2);
      setMessage2('');

      scrollViewRef.current.scrollToEnd({animated: true});
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const renderFooter = () => {
    const renderMessage = (message, index) => {
      if (message.sender === 'agent') {
        return (
          <View key={index} style={chatStyles.messageContainerLeft}>
            {/* Agent Message */}
            <View style={[chatStyles.message, {backgroundColor: agentBgColor}]}>
              <View style={chatStyles.messageContent}>
                <Text style={chatStyles.senderName}>{message.agent}</Text>
                <ScrollView horizontal={false}>
                  <Text
                    style={[chatStyles.messageText, {color: chatTextColor}]}>
                    {message.message}
                  </Text>
                </ScrollView>
              </View>
            </View>
          </View>
        );
      } else {
        // Client Message
        return (
          <View key={index} style={chatStyles.messageContainerRight}>
            <View
              style={[
                chatStyles.rightMessage,
                {backgroundColor: clientBgColor},
              ]}>
              <View style={chatStyles.messageContent}>
                <Text style={chatStyles.senderName}>{name}</Text>
                <ScrollView horizontal={true}>
                  <Text
                    style={[chatStyles.messageText, {color: chatTextColor}]}>
                    {message.message}
                  </Text>
                </ScrollView>
              </View>
            </View>
          </View>
        );
      }
    };
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={chatStyles.inputContainer}>
          <View style={chatStyles.inputWrapper}>
            <TextInput
              style={[
                chatStyles.input,
                {
                  color: inputTextColor,
                  backgroundColor: inputBgColor,
                  borderColor: primaryColor,
                },
              ]}
              placeholder="Write a reply"
              value={messages2}
              onChangeText={text => setMessage2(text)}
            />
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
                  widgetId={widgetId}
                  style={chatStyles.dropdownItem1}
                  isDropdownOpen1={isDropdownOpen1}
                  handleCloseDropdown1={handleCloseDropdown1}
                  maxFileAllowed={10000000}
                  handleOverlayPress1={handleOverlayPress1}
                  uploadAttachment={handleUploadAttachment}
                  removeAttachment={handleRemoveAttachment}
                  isChat={isChat}
                  uploadTo={'errand/uploadAnswerAttachment'}
                  attachmentURL={attachmentURL}
                  isAttachAvailable={isAttachAvailable}
                  selectedFile={selectedFile}
                  setSelectedFile={setSelectedFile}
                  setPreviewModalVisible={setPreviewModalVisible}
                  renderFooter={renderFooter}
                />
              </View>
              <View style={chatStyles.menuBarRight}>
                <TouchableOpacity onPress={handleSendMessage} hitSlop={hitSlop}>
                  <Svg
                    width="20"
                    height="18"
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
  const renderMessage = (message, index) => {
    console.log(message.message);
    if (message.agent) {
      if (message.message) {
        console.log('agent');
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
            <View style={[chatStyles.message, {backgroundColor: agentBgColor}]}>
              <View style={chatStyles.messageContent}>
                <Text style={chatStyles.senderName}>{message.agent}</Text>
                {/* <ScrollView horizontal={false}>
                <HTML style={[chatStyles.messageText, { color: chatTextColor }]} contentWidth={width} ignoredDomTags={['quillbot-extension-portal']}>{{html: message.message}}</HTML>
              </ScrollView> */}
                <ScrollView horizontal={false}>
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
      console.log('Not agent');
      if (message.message) {
        return (
          <View key={index} style={chatStyles.messageContainerRight}>
            <View
              style={[
                chatStyles.rightMessage,
                {backgroundColor: clientBgColor},
              ]}>
              <View style={chatStyles.messageContent}>
                <Text style={chatStyles.senderName}>{name}</Text>
                {/* <ScrollView horizontal={true}>
                  <Text style={[chatStyles.messageText, { color: chatTextColor }]}  contentWidth={width} ignoredDomTags={['quillbot-extension-portal']}>{message.message}</Text>
                </ScrollView> */}
                <ScrollView horizontal={false}>
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
  return (
    <View style={[chatStyles.container, {backgroundColor: chatBgColor}]}>
           <View style={[chatStyles.actionBar, { backgroundColor: primaryColor }]}>
        <TouchableOpacity style={chatStyles.actionIcon} hitSlop={hitSlop}>
          <CentionIcons name="chevron-mini-down" size={22} fontWeight="800" color={headerColor} />
        </TouchableOpacity>
        <Text style={[chatStyles.title, { color: headerColor }]}>{titleText}</Text>
      </View>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={[
          chatStyles.messageContainer,
          {backgroundColor: chatBgColor},
        ]}>
        {chatMessages.map(renderMessage)}
      </ScrollView>
      {renderFooter()}
    </View>
  );
});
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
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // 0.5 black transparency
  },

  messageContainer: {
    paddingBottom: 16,
    paddingTop: 3,
    paddingLeft: 16,
    paddingRight: 16,
  },
  messageContainerLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: '85%',
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
    width: '94%',
    height: 'auto',
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
    backgroundColor: 'white',
    borderWidth: 1,
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
    borderColor: '#EAEAEA',
    paddingRight: 16,
    paddingLeft: 16,
    paddingTop: 8,
    paddingBottom: 8,
    marginLeft: 45,
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
    bottom: 2,
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

  value: {
    fontSize: 12,
  },
});
export default NextModal;
