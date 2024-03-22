```css

  ____ _____ _   _ _____ ___ ___  _   _   ____  ____  _  __
 / ___| ____| \ | |_   _|_ _/ _ \| \ | | / ___||  _ \| |/ /
| |   |  _| |  \| | | |  | | | | |  \| | \___ \| | | | ' / 
| |___| |___| |\  | | |  | | |_| | |\  |  ___) | |_| | . \ 
 \____|_____|_| \_| |_| |___\___/|_| \_| |____/|____/|_|\_\

```





# Cention Chat SDK for Mobile Apps
**Version 0.1**

--/--/----


## Requirements:
•	The current Chat SDK can only be integrated in React native Apps.

•	The Chat SDK support react native version -.--- .

### Installation

First, you need to install the package via npm. In your project directory, run:

```bash
npm install @centiongroup/chat-sdk
```

This command installs the `chat-sdk` from the `centiongroup` organization scope into your project's `node_modules` folder and adds it to the dependencies in your `package.json`.

### Importing and Using the SDK

Once installed, you can import the SDK into your JavaScript or TypeScript file like this:

```javascript
import Chat from '@centiongroup/chat-sdk';
```

## Integrating Cention Chat SDK in Your App:
To integrate the Cention Chat SDK into your application, you'll need to configure the chat widget with specific parameters. Below is an example of how you can set up the integration:

```javascript
<ChatModal workSpace={'worspace_name'} widgetId={widgetId} customization={false} />
```
- `workSpace`: Specifies the workspace or domain associated with your Cention account. In the provided example, it's set to 'workspace_name'. You'll need to replace 'workspace_name' with the respective workspace.
- `widgetId`: Represents the unique identifier of the chat SDK or configuration within your Cention Contact Center account. Here, it's set to 'widgetId_number'. Replace 'widgetId_number' with the appropriate widget ID.
- `customization`: A boolean value indicating whether customization options for the chat SDK are enabled {true} or disabled {false}. In this example, it's set to {false}, meaning customization is disabled. Adjust this value based on your customization preferences.

## ChatSDK Customization Guide:
Screenshots given is the guide to use the customization in an efficient way.

![Your paragraph text (2)](https://github.com/cention/SDK/assets/141694278/fcccb449-8b3e-4fce-ba81-2c51e5a1ac08)
![Your paragraph text (1)](https://github.com/cention/SDK/assets/141694278/c983e4bb-ede3-4e43-8593-4c48d54eb311)

## Local Notifications Setup Guide (optional):
## Prerequisites
• React Native environment set up

• react-native-push-notification package installed

• Android Studio and the Android SDK

## Installation and Configuration

To enable local notifications in your React Native app, follow these steps to install and configure the necessary library.

### Step 1: Install the Library

Run the following command in your React Native project directory:

```bash
npm install --save react-native-push-notification
```

or if you use Yarn:

```bash
yarn add react-native-push-notification
```
### Step 2: Android Configuration

Modify your `AndroidManifest.xml` to include the necessary permissions and receivers:

```xml
<uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED"/>

<application ...>
    <meta-data android:name="com.dieam.reactnativepushnotification.notification_foreground" android:value="false"/>
    <meta-data android:name="com.dieam.reactnativepushnotification.notification_color" android:resource="@color/white"/>
    
    <receiver android:name="com.dieam.reactnativepushnotification.modules.RNPushNotificationActions" android:exported="true"/>
    <receiver android:name="com.dieam.reactnativepushnotification.modules.RNPushNotificationPublisher" android:exported="true"/>
    <receiver android:name="com.dieam.reactnativepushnotification.modules.RNPushNotificationBootEventReceiver" android:exported="true">
        <intent-filter>
            <action android:name="android.intent.action.BOOT_COMPLETED"/>
        </intent-filter>
    </receiver>
</application>
```
#### Create a Notification Icon

Add a notification icon to your drawable folders. This icon should be a white shape on a transparent background. You might need different sizes for different resolutions (hdpi, mdpi, xhdpi, xxhdpi, xxxhdpi).

Make sure to define the notification color in your `res/values/colors.xml`:

```xml
<resources>
    <color name="white">#FFFFFF</color>
</resources>
```
### Step 3: Initialize Notification Channels 

Before triggering local notifications, initialize the notification channel as early as possible in your app's lifecycle, such as in your `App.js`:

```javascript
import PushNotification from 'react-native-push-notification';

   PushNotification.createChannel({
    channelId: "incoming-message",
    channelName: "Incoming Messages",
    channelDescription: "Notifications for new messages",
    playSound: true, // Whether to play a sound or not
    soundName: "default", // The sound to play (default system sound)
    importance: 4, // Importance level (4 is high importance, makes sound and shows as a popup)
    vibrate: true, // Whether the phone should vibrate
  }, (created) => console.log(`CreateChannel returned '${created}'`));

```
## Integrating Notification Service in Cention Chat SDK
Define a notification service that will be used by the Cention Chat SDK to trigger notifications:

```javascript
import notificationService from './notificationService';

ChatSDK.initialize({
  // SDK configuration
  notificationService: notificationService,
});
```


### Triggering a Local Notification

Here's an example function to trigger a local notification:


```javascript
// notificationService.js
import PushNotification from 'react-native-push-notification';

// Initialize and create channels outside of the showNotification function

const notificationService = {
  showNotification: (title, message) => {
    // Directly use the channel to show the notification
   PushNotification.localNotification({
      channelId: "incoming-message", // Match the channel ID
      title: title, // The title of the notification
      message: message, // The message of the notification
      bigText: message, // Same as message, but can be longer
      subText: "Tap to open", // Subtext shown below the message on newer Android versions
      color: "blue", // Accent color (Android 5.0+)
      smallIcon: "ic_notification", // Small icon shown in the status bar and on the left of the notification (must be a white PNG in your drawable resources)
      largeIcon: "ic_launcher", // Large icon shown on the right of the notification (optional)
      largeIconUrl: "https://example.com/path/to/image.png", // URL to fetch a large icon (optional)
      vibrate: true, // Whether to vibrate
      vibration: 300, // Vibration pattern or duration in milliseconds
      playSound: true, // Whether to play a sound
      soundName: "default", // Sound to play (use 'customsound.mp3' for custom sounds located in '/android/app/src/main/res/raw')
      actions: '["Yes", "No"]', // Android action buttons in JSON format
      // Additional properties...
    });
  },
};



export default notificationService;
```

For further customization and additional settings, refer to the react-native-push-notification documentation.


## Questions:
If you have any questions regarding the customizations process feel free to ask your excellent support team at which you can reach by emailing support@cention.com.
