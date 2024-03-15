/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React,{useState,useEffect} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import {
  Colors,
  Header,
} from 'react-native/Libraries/NewAppScreen';
import ChatModal from './ChatModal';
import PushNotification from 'react-native-push-notification';
import { initializeSDK } from './SDKConfig';

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const notificationService = {
    showNotification: (title, message) => {
      PushNotification.createChannel(
           {
             channelId: "incoming-message",
             channelName: "incoming-message",
           },
           (created) => console.log(`CreateChannel returned '${created}'`)
         );
   
         PushNotification.localNotification({
           channelId: "incoming-message",
           title: "You have New Incoming Message",
           message: "You have New Incoming Message",
         });
    },
  };
  
  // Initialize the SDK with optional notification service
  initializeSDK({ notificationService });
  // const [ws, setWebSocket] = useState(null);
  
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView contentInsetAdjustmentBehavior="automatic" style={backgroundStyle}>
        <Header />
        <View style={styles.container}>
          {/* <TextInput
            style={styles.input}
            placeholder="Type a message..."
            value={inputMessage}
            onChangeText={setInputMessage}
          />
          <TouchableOpacity style={styles.button} >
            <Text style={styles.buttonText}>Send</Text>
          </TouchableOpacity> */}
          <View style={styles.messagesContainer}>
            {/* {receivedMessages.map((message, index) => (
              <Text key={index} style={styles.message}>
               
              </Text>
            ))} */}
          </View>
        </View>
        <ChatModal workSpace= {'demo-eu'} widgetId = {"a33f06e8-dcaf-4f47-a64f-0441e4f24120"} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  messagesContainer: {
    flex: 1,
    width: '100%',
  },
  message: {
    padding: 10,
    borderWidth: 1,
    borderColor: 'lightgray',
    borderRadius: 5,
    marginBottom: 5,
  },
});

export default App;