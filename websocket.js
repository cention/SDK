//  this file is not active is just to keep code base until the resume chat fixed
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import PushNotification from 'react-native-push-notification';
// import PushNotificationIOS from '@react-native-community/push-notification-ios';
import { getSDKConfig } from './SDKConfig';
// import { env } from '../../../config/environment';
export const useWebSocket = () => {
  const { notificationService } = getSDKConfig();
  const showCallNotification = (title, message) => {
    if (notificationService) {
      notificationService.showNotification(title, message);
    }
  };
  // useEffect(() => {
  //   PushNotification.createChannel(
  //     {
  //       channelId: "your-channel-id", // Ensure this is unique for each channel
  //       channelName: "Your Channel Name",
  //     },
  //     (created) => console.log(`CreateChannel returned '${created}'`) // Optional callback
  //   );
  
  //   // Example of triggering a local notification
  //   PushNotification.localNotification({
  //     channelId: "your-channel-id",
  //     title: "Hello",
  //     message: "Local Notification Message",
  //   });
  // }, []);
  // const showCallNotification = () => {
  //   if (Platform.OS === 'ios') {
  //     PushNotificationIOS.setNotificationCategories([
  //       {
  //         id: 'incoming-message',
  //       //   actions: [
  //       //     {
  //       //       id: 'answer',
  //       //       title: 'Answer',
  //       //       options: {foreground: true},
  //       //     },
  //       //     {
  //       //       id: 'reject',
  //       //       title: 'Reject',
  //       //       options: {foreground: true},
  //       //     },
  //       //   ],
  //       },
  //     ]);
  
  //     PushNotificationIOS.addNotificationRequest({
  //       id: 'incoming-message',
  //       category: 'incoming-message',
  //       categoryId: 'incoming-message',
  //       title: 'Incoming Call',
  //       subtitle: 'You have a new message',
  //       userInfo: {},
  //       alertAction: 'Answer',
  //       soundName: 'default',
  //       threadId: 'incoming-Message',
  
  //       // actions: ['answer', 'reject'],
  //     });
  //   } else {
  //     PushNotification.localNotification({
  //       channelId: 'con.Cention.message',
  //       title: 'Incoming message',
  //       message: 'You have an incoming message.',
  //       importance: 4,
  //       priority: 'high',
  //       largeIcon: 'ic_launcher',
  //       largeIconUrl: 'data:image/png;base64,iVBORw0KG...',
  //       vibration: 300,
  //       playSound: true,
  //       soundName: 'default',
  //       invokeApp: false,
  //       // actions: ['Answer', 'Reject'],
  //     });
  //   }
  // };
  const [chats, setChats] = useState([]);
  const [newChats, setNewChats] = useState([]);
  const [newMessage, setNewMessages] = useState()
  const [webSocket, setWebSocket] = useState('');
  const [sessionId , setSessionId] = useState('');
  const [sessionSecret, setSessionSecret] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const [agentAvailable,setAgentAvailable]= useState(true);
  let webSocketInstance = null;
//   useEffect(() => {
//     console.log('found it', webSocket)
  
// }, [webSocket])

// useEffect(() => {
// getSession()
// }, []);
// const getSession = async () =>{
//   const existingSessionId =await  AsyncStorage.getItem('sessionId');
//   const existingSessionSecret =await  AsyncStorage.getItem('sessionSecret');

//   if (existingSessionId && existingSessionSecret) {
//     console.log('=================',existingSessionId , existingSessionSecret)
//     // Attempt to resume session
//     // connectWebSocket(existingSessionId, existingSessionSecret, true);
//   } else {
//     // No session details found, start a new session
//     // connectWebSocket();
//   }
// }
// const connectWebSocket = (existingSessionId = '', existingSessionSecret = '', resume = false) => {
//   const wsUrl = 'wss://cloud-qa.cention.com/s/tobias/external.ws';
//   const webSocket = new WebSocket(wsUrl);

//   webSocket.onopen = () => {
//     if (resume) {
//       const resumeRequest = {
//         type: "resume",
//         sessionId: existingSessionId,
//         sessionSecret: existingSessionSecret,
//       };
//       webSocket.send(JSON.stringify(resumeRequest));
//     } else {
      
//     }
//   };

//   webSocket.onmessage = (event) => {
//     const messageData = JSON.parse(event.data);
//     handleWebSocketMessage(event, messageData);
//   };

//   setWebSocket(webSocket);
// };
  // const handleWebSocketOpen = webSocket => {
  //   const message1 = {
  //     id: 1,
  //     data: { chats: {}, notification: { maxMessageId: 0 } },
  //   };

  //   webSocket.send(JSON.stringify(message1));
  // };

  const handleWebSocketMessage = async (event) => {

    if (event && event?.data) {
      const data1 = event?.data;
      const parsedChats = data1 ? JSON.parse(data1) : null;
  
      if (parsedChats && parsedChats.args && parsedChats.args[0] && parsedChats.args[0].chatErrands ) {
        const chatsArray = parsedChats.args[0].chatErrands;
        const updatedChats = await parseChatsArray(chatsArray);
        if(updatedChats){
          setChats(updatedChats);
        }
        
      }
      else if(parsedChats && parsedChats.args && parsedChats.args[0] && !parsedChats.args[0].chatErrands ){
         const chatsArray = parsedChats.args[0];
         const updatedChats = await parseChatsArray([chatsArray]);
         setNewChats(updatedChats);
      }
    }
  };

  const parseMessagesInfo = messageArray => {
    // // console.log('===========',messageArray?.args )
    return messageArray?.args?.map(message => {
      const messageArray = parseMessageArray(message);
      return {
        errandId: message?.errandId || '',
        sessionId: message?.sessionId || '',
        message: messageArray || '',
        
    
      };
   
  })}

  const sendRegistrationData = async ({ name, email, question }) => {

    // const isAlreadyRegistered = await AsyncStorage.getItem('isRegistered');
    // console.log("WebSocket", isAlreadyRegistered);

    // if (isAlreadyRegistered === 'true') {
    //   console.log("WebSocket is already open and registered.");
    //   return;
    // }
    return new Promise((resolve, reject) => {
      
    // console.log(name, email, question)
       const webSocket = new WebSocket('wss://cloud-qa.cention.com/s/tobias/external.ws');

       webSocketInstance = webSocket;
    // console.log("WebSocketteedt");

    webSocket.onopen = () => {
      // console.log("WebSocket connection opened.");

      const registrationRequest = {
        "type":"register",
        "data":{"area":133,
        "name":name,
        "email":email,
        "phone":"",
        "message":question,
        "externalData":"",
        "clientDeviceInfo":{"browebSocketerName":"Chrome",
        "browebSocketerVersion":"121.0.0.0","deviceVendor":"",
        "deviceModel":"","deviceType":"","osName":"WindowebSocket",
        "osVersion":"10",
        "ua":"Mozilla/5.0 (WindowebSocket NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36","isMobile":false},
        "baseURL":"https://cloud-qa.cention.com/s/tobias","offlineChat":false,
        "href":"https://sandbox.cention.com/mobile-test/","trackClientUrl":true},
        "id":1
      };

      webSocket.send(JSON.stringify(registrationRequest));
      addWebsocket()
    //   handleWebSocketOpen(webSocket);
    // setupAgentSocketListeners(webSocket)
    };
    setWebSocket(webSocket)
  

    resolve();
    // webSocket.onopen = () => 

    webSocket.onerror = error => {
    // console.log('WebSocket error:', error);
  };
  webSocket.onclose = () => {
    removeWebsocket()

    //  AsyncStorage.removeItem('sessionId');
    //  AsyncStorage.removeItem('sessionSecret');
    // console.log('WebSocket connection closed');
    // reconnect();
  };
  webSocket.onmessage = async (event) => {
    // console.log("Received:", event);
    const messageData = JSON.parse(event.data);
    if (messageData.event === 'register') {
        // Assuming messageData.args is an array and we're interested in the first element
        const registrationInfo = messageData.args[0];
        if (registrationInfo) {
          const { sessionId, sessionSecret } = registrationInfo;
          setSessionId(sessionId)
          setSessionSecret(sessionSecret)
          // console.log('================================v',sessionId,sessionSecret)
          await AsyncStorage.setItem('sessionId', sessionId);
          await AsyncStorage.setItem('sessionSecret', sessionSecret);
          // console.log("Session ID:", sessionId);
          // console.log("Session Secret:", sessionSecret);
          // webSocket.send('{"id":2,"payload":"agent registered"}');
        }
    }
    else if(messageData.event === 'CHAT_NEW_MESSAGE'){
     
      
       const result = await parseMessagesInfo(messageData)
      
        setNewMessages(result)
        // console.log('=-=-=-=-=-=--==-=-=-=- ',result.message)
        if (result && result.length > 0) {
          const index = result[0]?.message?.length - 1;
            // console.log('================================',);
            const title = "New Message"; // Customize based on your data structure
            const message = messageData.message; // Customize this as well
            if(result[0].message[index].agent){
              showCallNotification(title, result[0].message[index].message);
            }
            // Call showCallNotification with the extracted title and message
            
        //     if(result[0].message[index].agent){
        //       PushNotification.createChannel(
        //    {
        //      channelId: "incoming-message",
        //      channelName: "incoming-message",
        //    },
        //    (created) => console.log(`CreateChannel returned '${created}'`)
        //  );
   
        //  PushNotification.localNotification({
        //    channelId: "incoming-message",
        //    title: "You have New Incoming Message",
        //    message: "You have New Incoming Message",
        //  });
        //    }
        }
  
    }
    else if (messageData.event ==='CHAT_ERRAND_ADD'){
      handleWebSocketMessage(event)
    }
    else if(messageData.event ==='agent unavailable'){
      setAgentAvailable(false)
    }
  }
});

  }

  const addWebsocket = async() =>{
    await AsyncStorage.setItem('isRegistered', 'true');
  }

  const removeWebsocket = async()=> {
    await AsyncStorage.removeItem('token');
  }
  const parseMessageArray = (messages) => {
    // // console.log('===========',messages?.messages )
    return messages.messages.map(message => ({
      agent: message?.agent || '',
      aid: message?.aid || '',
      id: message?.id || '',
      fromClient: message?.fromClient || '',
      read: message?.read || '',
      seen: message?.seen || '',
      sent: message?.sent || '',
      sentHuman: message?.sentHuman || '',
      status: message?.status || '',
      templateId: message?.templateId || '',
      umid: message?.umid || 'Chat',
      text: message?.text || false,
      waTemplateCode: message?.waTemplateCode || false,
      watermark: message?.watermark || false,
  
    }));
  };
  
  const parseChatsArray = chatsArray => {
    return chatsArray?.map(errand => {
      if(errand.errand?.data){
      // console.log('1=============',errand.errand?.data)
      const errandData = errand.errand?.data;
      // console.log({errandData})
      const messages = parseMessages(errand.messages, errandData,errand);

      return {
        id: errandData?.id || '',
        displayId: errandData?.displayId || '',
        sender: errandData?.fromName || '',
        subject: errandData?.subject || '',
        timestamp: errandData?.date || '',
        status: errandData?.status || '',
        dead: errand?.dead || '',
        channel: 'chat',
        serviceName: errandData?.serviceName || 'Chat',
        highpriority: errandData?.highpriority || false,
        wasPostponed: errandData?.wasPostponed || false,
        locked: errandData?.locked || false,
        collaboration: errandData?.collaboration || '',
        sessionSecret: errand?.Secret|| '',
        pinToTop: errandData?.pinToTop || false,
        sessionId: errandData?.sessionId  || '',
        messages: messages,
      };
    }});
  };

  const sendDeleteErrand = (sessionId) => {
    const chatMessage = {
      type: "finish chat session",
      data: {
          sessionId: sessionId
      },
      id: 1
  }
    const messageString = JSON.stringify(chatMessage);
    webSocket.send(messageString);
  };

  const sendMessage = (id, payload) => {
    const message = JSON.stringify({ id, payload });
    webSocket.send(message);
  };


  const parseMessages = (messages, errandData,errand) => {
    return messages.map(item => ({
      message:
        item.text === '{"event":"CHAT_EXPIRED"}'
          ? '<div>This chat has expired.</div>'
          : item.text,
      sender: item.fromClient ? errandData?.fromName : item.agent,
      agent: errandData?.agent,
      sessionId: errandData?.sessionId  || '',
      agentId: errandData?.agentId || '',
      timestamp: item.sentHuman,
      channel: 'chat',
      sessionSecret: errand?.Secret|| '',
      dead: errand?.dead || '',
    }));
  };

  const getNewMessageId = (agentID,unsentMessageId) => {
    if(agentID <= 0) {
      return "INVALID";
    }
    const timestamp = (new Date()).getTime();
    unsentMessageId++;
    const newUnsentMessageId = unsentMessageId;
    return 'a-' + agentID + '-' + timestamp + '-' + newUnsentMessageId;
  }
  var unsentMessageId = 0;

    const setupAgentSocketListeners = async (webSocket) => {

    // webSocket.onmessage = async (event) => {

    //   const messageData = JSON.parse(event.data);
    //   // if (messageData.event === 'register') {
    //   //   handleWebSocketMessage(event)
    //   //   // console.log('agent registered')
    //   //   webSocket.send('{"id":2,"payload":"agent registered"}')
    //   // }
    //   if(messageData.event === 'CHAT_NEW_MESSAGE'){
    //      const result = await parseMessagesInfo(messageData)
    //       setNewMessages(result)
    //   }
    //   else if (messageData.event ==='CHAT_ERRAND_ADD'){
    //     handleWebSocketMessage(event)
    //   }
   
    // }
  
  }
  let counter = 0; 

  const generateUniqueId = () => {
    const timestamp = Date.now(); 
    const randomNum = Math.floor(Math.random() * 1000); 
    counter += 1; 
  
    return `msg_${timestamp}_${randomNum}_${counter}`;
  };
  const sendMessageToWebSocket = (message) => {
    console.log('here',message)
    // console.log('hmmmmmmmmmm',mcount, agentID,message, sessionId)
    // const htmlMessage = `<span style='font-family: Verdana; font-size: 12;'>${message}</span>`;
    const messageId = generateUniqueId();
    const chatMessage =
    {"type":"chat message","data":{"id":messageId,"message":message,"mcount":counter},"id":counter}    //   data: {
    //     watemplateCode: '',
    //     message : htmlMessage,
    //     sessionId: sessionId,
    //     id: getNewMessageId(agentID,unsentMessageId),
    //     templateId: 0,
    //     mcount: mcount,
    //   },
    //   id: 5,
    // };
    const messageString = JSON.stringify(chatMessage);
    // console.log('here',webSocket)

    webSocket.send(messageString);
    // reconnect();
  };
  const sendAttachmentToWebSocket = (result) => {
    // console.log('=====================',mcount, agentID,message, sessionId,fileName,fileURL)
    // const htmlMessage = `<a title=\"${fileName}\" href=\"${fileURL}\"><img src=\"${fileURL}\" alt=\"${fileName}\" style=\"max-width:200px;max-height:200px\"/></a>`;
    const chatMessage = {
      type: 'add attachment',
      data: {
        area: 133,
        file : result,
        sessionSecret: sessionSecret,
      },
      id: 5,
    };
    // console.log({chatMessage})
    const messageString = JSON.stringify(chatMessage);
    webSocket.send(messageString);


    var fileUploadEvent = {
      event: "FILE_UPLOAD",
      fileDownload: result.download + "?t=" + sessionSecret,
      fileName: result.value,
      sizeHuman: result.sizeHuman
    };
  
    var messageContent = `\u0001JSON${JSON.stringify(fileUploadEvent)}`;
  
    var messageToSend = {
      type: "chat message",
      data: {
        id: "c-" + Date.now() + "-1", // Example ID, generate as needed
        message: messageContent,
        mcount: 1 
      },
      id: 3 
    };
    const messageString2 = JSON.stringify(messageToSend);

    webSocket.send(messageString2);

  
    // reconnect();
  };
  // const reconnect = () => {
  //   // console.log('Reconnecting to WebSocket...');
  //   const webSocket = new WebSocket(env.WebSocketProd);
  //   // webSocket.WebSocket = ReconnectingWebSocket;
  //   setWebSocket(webSocket)
   
  //   webSocket.onopen = () => handleWebSocketOpen(webSocket);

  // };

  // useEffect(() => {
  //   if (!webSocket) {
  //     // console.log('no websocket')
  //   const webSocket = new WebSocket('webSockets://cloud-qa.cention.com/s/tobias/external.webSocket');
  //   // webSocket.WebSocket = ReconnectingWebSocket;
  //   setWebSocket(webSocket)
  //   webSocket.onopen = () => {
  //     console.log("WebSocket connection opened.");

  //     const registrationRequest = {
  //       "type":"register",
  //       "data":{
  //       "area":133,
  //       "name":"Mounir Ben daia",
  //       "email":"bendaiamounirads@gmail.com",
  //       "phone":"","message":"tesrrrt",
  //       "externalData":"",
  //       "clientDeviceInfo":{"browebSocketerName":"Chrome",
  //       "browebSocketerVersion":"121.0.0.0","deviceVendor":"",
  //       "deviceModel":"","deviceType":"","osName":"WindowebSocket",
  //       "osVersion":"10",
  //       "ua":"Mozilla/5.0 (WindowebSocket NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36","isMobile":false},
  //       "baseURL":"https://cloud-qa.cention.com/s/tobias","offlineChat":false,"href":"https://sandbox.cention.com/mobile-test/","trackClientUrl":true},"id":1
  //     };

  //     webSocket.send(JSON.stringify(registrationRequest));
  //     setupAgentSocketListeners(webSocket)
  //   //   handleWebSocketOpen(webSocket);
  //   // setupAgentSocketListeners(webSocket)
  //   };

  //   // webSocket.onopen = () => handleWebSocketOpen(webSocket);
   

  //   webSocket.onerror = error => {
  //     // console.log('WebSocket error:', error);
  //   };
  //   webSocket.onclose = () => {
  //     // console.log('WebSocket connection closed');
  //     reconnect();
  //   };
  // }

  //   return () => {
  //     if (webSocket) {
  //       webSocket.close();
  //     }
  //   };
  // }, []);

  return { chats, sessionId, sessionSecret,newChats,agentAvailable,newMessage,removeWebsocket,sendRegistrationData, setChats,sendMessageToWebSocket , sendDeleteErrand,sendAttachmentToWebSocket };
};
