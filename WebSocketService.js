import {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {env, socketenv} from './api_env';
import {getSDKConfig} from './SDKConfig';
export const useWebSocket = (workSpace, widgetId) => {
  const {notificationService} = getSDKConfig();
  const [chats, setChats] = useState([]);
  const [newMessage, setNewMessages] = useState();
  const [webSocket, setWebSocket] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [sessionSecret, setSessionSecret] = useState('');
  const [agentAvailable, setAgentAvailable] = useState(true);
  const [lastMessage, setLastMessage] = useState(null);
  const [noSession, setNoSession] = useState(false);
  const [createNewChat, setCreateNewChat] = useState(false);
  const showCallNotification = (title, message) => {
    if (notificationService) {
      notificationService.showNotification(title, message);
    }
  };

  const parseMessagesInfo = messageArray => {
    return messageArray?.args?.map(message => {
      const messageArray = parseMessageArray(message);
      return {
        errandId: message?.errandId || '',
        sessionId: message?.sessionId || '',
        clientName: message?.session.client  || '',
        message: messageArray || '',
      };
    });
  };
  const generatePseudoCookie = () => {
    const timestamp = Date.now(); 
    const secondRandomPortion = Math.random().toString(36).substring(2, 15); 
    const sessionId = `sessionId=${Math.random()
      .toString(36)
      .substring(2, 15)}`;
    const randomPortion = Math.random().toString(36).substring(2, 15);
    const cookieAttributes = `; Path=/; HttpOnly`;
    const pseudoCookie = `${sessionId}${randomPortion}${timestamp}${secondRandomPortion}${cookieAttributes}`;

    return pseudoCookie;
  };
  const sendRegistrationData = async ({name, email, question}) => {
    let token = await AsyncStorage.getItem('token');
    let muid;
    return new Promise((resolve, reject) => {
      if (token) {
        const webSocketLink = `${socketenv.URL}/s/${workSpace}/external.ws?token=${token}`;
        const webSocket = new WebSocket(webSocketLink);
        webSocket.onopen = () => {
          console.log('WebSocket connection opened.');

          const registrationRequest = {
            type: 'resume',
            data: {
              href: '',
              trackClientUrl: true,
            },
            id: 1,
          };
          webSocket.send(JSON.stringify(registrationRequest));
          const resume = {
            type: 'sendchat',
            payload: 'resume existing chat',
            id: 2,
          };
          webSocket.send(JSON.stringify(resume));
        };
        setWebSocket(webSocket);
        webSocket.onerror = error => {
          console.log('WebSocket error:', error);
        };
        webSocket.onclose = () => {

        };
        webSocket.onmessage = async event => {
          console.log('Received:', event);
          const messageData = JSON.parse(event.data);
          if(messageData?.args[0]?.sessionId){
            console.log('messageData?.args[0]?.sessionId')
            setSessionId(messageData?.args[0]?.sessionId);
            setSessionSecret(messageData?.args[0]?.sessionSecret);

          }

          if (messageData?.args[0]?.error === 'no session') {
            setNoSession(true);
            removeWebsocket();
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
                  showCallNotification(title, result[0].message[index].message);
                }
              }
            }
          } else if (messageData.event === 'agent unavailable') {
            setAgentAvailable(false);
          } else if(messageData.event === 'OWNER_ENDS_CHAT'){
            setChatEnded(true)
          }
        };
        resolve();
      } else {
        const pseudoCookie = generatePseudoCookie();
        const webSocketLink = `${
          socketenv.URL
        }/s/${workSpace}/external.ws?token=${encodeURIComponent(pseudoCookie)}`;
        const webSocket = new WebSocket(webSocketLink);
        webSocket.onopen = () => {
          console.log('WebSocket connection opened.');
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
          addWebsocket(encodeURIComponent(pseudoCookie));
        };
        setWebSocket(webSocket);
        webSocket.onerror = error => {
          console.log('WebSocket error:', error);
        };
        webSocket.onclose = () => {
         
        };
        webSocket.onmessage = async event => {
          console.log('Received:', event);
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

  const addWebsocket = async token => {
    await AsyncStorage.setItem('token', token);
  };

  const removeWebsocket = async () => {
    await AsyncStorage.removeItem('token');
  };
  const handleCreateNewChat = async () => {
    setCreateNewChat(true);
  };
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

  const sendDeleteErrand = sessionId => {
    const chatMessage = {
      type: 'finish chat session',
      data: {
        sessionId: sessionId,
      },
      id: 1,
    };
    const messageString = JSON.stringify(chatMessage);
    webSocket.send(messageString);
  };

  let counter = 0;

  const generateUniqueId = () => {
    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 1000);
    counter += 1;

    return `msg_${timestamp}_${randomNum}_${counter}`;
  };
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
  const sendAttachmentToWebSocket = result => {
    const chatMessage = {
      type: 'add attachment',
      data: {
        area: 133,
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
    sendDeleteErrand,
    sendAttachmentToWebSocket,
  };
};
