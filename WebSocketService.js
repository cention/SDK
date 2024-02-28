// Import necessary hooks and modules
import {useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {env, socketenv} from './api_env';
import {getSDKConfig} from './SDKConfig';


export const useWebSocket = (workSpace, widgetId) => {
  // Retrieve configuration from SDKConfig
  const {notificationService} = getSDKConfig();
  // State management for various aspects of WebSocket interaction
  const [chats, setChats] = useState([]);
  const [newMessage, setNewMessages] = useState();
  const [webSocket, setWebSocket] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [sessionSecret, setSessionSecret] = useState('');
  const [agentAvailable, setAgentAvailable] = useState(true);
  const [lastMessage, setLastMessage] = useState(null);
  const [noSession, setNoSession] = useState(false);
  const [createNewChat, setCreateNewChat] = useState(false);

  // Function to show call notifications using the provided notification service
  const showCallNotification = (title, message) => {
    if (notificationService) {
      notificationService.showNotification(title, message);
    }
  };

  // Parses message info from the array of messages received
  const parseMessagesInfo = messageArray => {
    return messageArray?.args?.map(message => {
      const messageArray = parseMessageArray(message);
      return {
        errandId: message?.errandId || '',
        sessionId: message?.sessionId || '',
        clientName: message?.session.client || '',
        message: messageArray || '',
      };
    });
  };

  // Generates a pseudo for session management
  const generatePseudoSession = () => {
    const timestamp = Date.now();
    const secondRandomPortion = Math.random().toString(36).substring(2, 15);
    const sessionId = `sessionId=${Math.random()
      .toString(36)
      .substring(2, 15)}`;
    const randomPortion = Math.random().toString(36).substring(2, 15);
    const sessionAttributes = `; Path=/; HttpOnly`;
    const pseudoSession = `${sessionId}${randomPortion}${timestamp}${secondRandomPortion}${sessionAttributes}`;

    return pseudoSession;
  };

  // Handles registration and sending of chat data
  const sendRegistrationData = async ({name, email, question}) => {
    let token = await AsyncStorage.getItem('token');
    let muid;
    return new Promise((resolve, reject) => {
      if (token) {
        // If token exists, connect using WebSocket with the token
        const webSocketLink = `${socketenv.URL}/s/${workSpace}/external.ws?token=${token}`;
        const webSocket = new WebSocket(webSocketLink);
        webSocket.onopen = () => {
          // Send registration request upon opening WebSocket connection
          const registrationRequest = {
            type: 'resume',
            data: {
              href: '',
              trackClientUrl: true,
            },
            id: 1,
          };
          webSocket.send(JSON.stringify(registrationRequest));
          // Send a message to resume existing chat
          const resume = {
            type: 'sendchat',
            payload: 'resume existing chat',
            id: 2,
          };
          webSocket.send(JSON.stringify(resume));
        };
        setWebSocket(webSocket);

        // Error handling for WebSocket
        webSocket.onerror = error => {
          console.log('WebSocket error:', error);
        };
        webSocket.onmessage = async event => {
          // Handle messages received from WebSocket
          try {
            const messageData = JSON.parse(event.data);
            // Process message data here
            if (messageData?.args[0]?.sessionId) {
              setSessionId(messageData?.args[0]?.sessionId);
              setSessionSecret(messageData?.args[0]?.sessionSecret);
            }
            // Check for 'no session' error and handle by resetting session state and removing WebSocket
            if (messageData?.args[0]?.error === 'no session') {
              setNoSession(true);
              removeWebsocket();
            }
            // Handle registration event to set session details
            if (messageData.event === 'register') {
              const registrationInfo = messageData.args[0];
              if (registrationInfo) {
                const {sessionId, sessionSecret} = registrationInfo;
                setSessionId(sessionId);
                setSessionSecret(sessionSecret);
              }
            } else if (messageData.event === 'CHAT_NEW_MESSAGE') {
              const result = await parseMessagesInfo(messageData);

              if (result && result.length > 0) {
                const index = result[0]?.message?.length - 1;
                const title = 'New Message';
                const lastMessageUmid = result[0].message[index].umid;
                setLastMessage(lastMessageUmid);
                if (
                  JSON.stringify(result[0].message[index].umid) ===
                  JSON.stringify(muid)
                ) {
                  return;
                } else {
                  muid = lastMessageUmid;
                  setNewMessages(result);
                  if (result[0].message[index].agent) {
                    showCallNotification(
                      title,
                      result[0].message[index].message,
                    );
                  }
                }
              }
            } else if (messageData.event === 'agent unavailable') {
              // Update state to reflect agent availability
              setAgentAvailable(false);
            } else if (messageData.event === 'OWNER_ENDS_CHAT') {
              // Handle chat end by the owner
              setChatEnded(true);
            }
          } catch (err) {
            console.log(err);
          }
        };
        resolve();
      } else {
        // Generate pseudo session cookie for users without a token
        const pseudoSession = generatePseudoSession();
        const webSocketLink = `${
          socketenv.URL
        }/s/${workSpace}/external.ws?token=${encodeURIComponent(
          pseudoSession,
        )}`;
        const webSocket = new WebSocket(webSocketLink);
        webSocket.onopen = () => {
          // Send registration request on WebSocket open
          const registrationRequest = {
            type: 'register',
            data: {
              area: widgetId,
              name: name,
              email: email,
              phone: '',
              message: question,
              externalData: '',
              baseURL: `${env.URL}/s/${workSpace}`,
              offlineChat: false,
              trackClientUrl: true,
            },
            id: 1,
          };
          webSocket.send(JSON.stringify(registrationRequest));
          addWebsocket(encodeURIComponent(pseudoSession));
        };
        setWebSocket(webSocket);
        // Handle WebSocket errors
        webSocket.onerror = error => {
          console.log('WebSocket error:', error);
        };
        webSocket.onclose = () => {};
        webSocket.onmessage = async event => {
          // Process message data similarly as above
          const messageData = JSON.parse(event.data);
          if (
            lastMessage &&
            messageData.event === 'CHAT_NEW_MESSAGE' &&
            JSON.stringify(messageData) === JSON.stringify(lastMessage)
          ) {
            return; // Skip processing this message
          }
          if (messageData.event === 'register') {
            const registrationInfo = messageData.args[0];
            if (registrationInfo) {
              const {sessionId, sessionSecret} = registrationInfo;
              setSessionId(sessionId);
              setSessionSecret(sessionSecret);
            }
          } else if (messageData.event === 'CHAT_NEW_MESSAGE') {
            const result = await parseMessagesInfo(messageData);
            if (result && result.length > 0) {
              const index = result[0]?.message?.length - 1;
              const lastMessageUmid = result[0].message[index].umid;
              setLastMessage(lastMessageUmid);
              if (
                JSON.stringify(result[0].message[index].umid) ===
                JSON.stringify(muid)
              ) {
                return;
              } else {
                muid = lastMessageUmid;

                setNewMessages(result);
              }
            }
          } else if (messageData.event === 'agent unavailable') {
            setAgentAvailable(false);
          }
        };
        resolve();
      }
    });
  };

  // Store WebSocket token in AsyncStorage
  const addWebsocket = async token => {
    await AsyncStorage.setItem('token', token);
  };

  // Remove WebSocket token from AsyncStorage
  const removeWebsocket = async () => {
    await AsyncStorage.removeItem('token');
  };

  // Enable initiating a new chat
  const handleCreateNewChat = async () => {
    setCreateNewChat(true);
  };

  // Parse array of message objects
  const parseMessageArray = messages => {
    return messages.messages.map(message => ({
      agent: message?.agent || '',
      aid: message?.aid || '',
      id: message?.id || '',
      fromClient: message?.fromClient || '',
      read: message?.read || '',
      seen: message?.seen || '',
      sent: message?.sent || '',
      client: message?.client || '',
      sentHuman: message?.sentHuman || '',
      status: message?.status || '',
      templateId: message?.templateId || '',
      umid: message?.umid || 'Chat',
      text: message?.text || false,
      waTemplateCode: message?.waTemplateCode || false,
      watermark: message?.watermark || false,
    }));
  };

  // Send a message to close the chat
  const sendCloseChat = () => {
    const chatMessage = {
      type: 'close chat',
      id: 1,
    };
    const messageString = JSON.stringify(chatMessage);
    webSocket.send(messageString);
  };

  let counter = 0;

  // Counter to generate unique message IDs.
  const generateUniqueId = () => {
    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 1000);
    counter += 1;

    return `msg_${timestamp}_${randomNum}_${counter}`;
  };

  // Sends a user's chat message to the WebSocket server. This function creates a chat message object, assigns it a unique ID, and sends it over the WebSocket.
  const sendMessageToWebSocket = message => {
    const messageId = generateUniqueId();
    const chatMessage = {
      type: 'chat message',
      data: {id: messageId, message: message, mcount: counter},
      id: counter,
    };

    const messageString = JSON.stringify(chatMessage);
    webSocket.send(messageString);
  };

  // Sends an attachment over the WebSocket. This is used for sending files, images, etc., as part of a chat message.
  const sendAttachmentToWebSocket = result => {
    const chatMessage = {
      type: 'add attachment',
      data: {
        area: widgetId,
        file: result,
        sessionSecret: sessionSecret,
      },
      id: 5,
    };
    
    const messageString = JSON.stringify(chatMessage);
    webSocket.send(messageString);

    var fileUploadEvent = {
      event: 'FILE_UPLOAD',
      fileDownload: result.download + '?t=' + sessionSecret,
      fileName: result.value,
      sizeHuman: result.sizeHuman,
    };

    var messageContent = `\u0001JSON${JSON.stringify(fileUploadEvent)}`;

    var messageToSend = {
      type: 'chat message',
      data: {
        id: 'c-' + Date.now() + '-1',
        message: messageContent,
        mcount: 1,
      },
      id: 3,
    };
    const messageString2 = JSON.stringify(messageToSend);

    webSocket.send(messageString2);
  };

  return {
    chats,
    sessionId,
    sessionSecret,
    noSession,
    agentAvailable,
    newMessage,
    handleCreateNewChat,
    createNewChat,
    removeWebsocket,
    sendRegistrationData,
    setChats,
    sendMessageToWebSocket,
    sendCloseChat,
    sendAttachmentToWebSocket,
  };
};
