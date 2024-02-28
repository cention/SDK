import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, TouchableWithoutFeedback, Keyboard } from 'react-native';
import Svg, { Path, G, Defs, Rect, LinearGradient, Stop } from 'react-native-svg';
import NextModal from './NextModal';
import CentionIcons from './cention-icons';
import { env, getCustomSdk, getActiveAgents } from './api_env';
import { useWebSocket } from './WebSocketService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ChatModal = ({ workSpace, widgetId }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [question, setQuestion] = useState('');
    const [animationProgress, setAnimationProgress] = useState(1);
    const [animationCompleted, setAnimationCompleted] = useState(false);
    const [isChatModalVisible, setChatModalVisible] = useState(false);
    const [showOtherContent, setShowOtherContent] = useState(false);
    const [showChatPage, setShowChatPage] = useState(false);
    const [mainColor, setMaincolor] = useState(null);
    const [bodyColor, setBodycolor] = useState(null);
    const [topColor, setTopColor] = useState(null);
    const [cbColor, setCbColor] = useState(null);
    const [ctColor, setCtColor] = useState(null);
    const [ccbColor, setCcbColor] = useState(null);
    const [cabColor, setCabColor] = useState(null);
    const [ibColor, setIbColor] = useState(null);
    const [itColor, setItColor] = useState(null);
    const [warningtColor, setWarningtColor] = useState(null);
    const [nameText, setNameText] = useState(null);
    const [emailText, setEmailText] = useState(null);
    const [questionText, setQuestionText] = useState(null);
    const [emailErrorText, setEmailErrorText] = useState(null);
    const [emailError, setEmailError] = useState(null);
    const [eula, setEULA] = useState(false);
    const [eulaT, setEulaT] = useState(false);
    const [eulaColor, setEULAColor] = useState(false);
    const [headerText, setHeaderText] = useState(null);
    const [keyboardVisible, setKeyboardVisible] = useState(false);
    const [availableAgents, setAvailableAgents] = useState(false);
    const [resumeChat, setResumeChat] = useState(false);

    const {
        createNewChat
      } = useWebSocket(workSpace, widgetId);
      const resume = async () =>{
        let token = await AsyncStorage.getItem('token');
        console.log('================token', token)

        if (token) {
        setResumeChat(true)            
        }
        else{
            setResumeChat(false) 
        }
      }
      const newChat = async () =>{
        setShowChatPage(false);

      }
      useEffect(()=>{
        if(createNewChat){
            setShowChatPage(false);
        }
      },[createNewChat])
    //   useEffect(()=>{
    //     resume()
    //     if (resumeChat){
    //         setShowChatPage(true);
    //     } else {
    //         setShowChatPage(false);
    //     }
    //   },[resumeChat])
      useEffect(()=>{
        resume()

      },[showOtherContent])
    const fetchChatSdk = async () => {
        const fetchAgents = await getActiveAgents(workSpace, widgetId);
        const agents = fetchAgents.agents;
        if (agents.length === 0) {
            setAvailableAgents(false);
        } else {
            setAvailableAgents(true);
        }
        const fetchData = await getCustomSdk(workSpace, widgetId);
        const data = fetchData.chatWidgetCfg;  
        //Get colors
        const css = data.css;
        const headerColor = css.headerColor;
        const bColor = css.mainColor;
        const wColor = css.warningTextColor;
        const headerTextColor = css.headerTextColor;
        const chatConversationBgColor = css.chatConversationBgColor;
        const chatConversationTextColor = css.chatConversationTextColor;
        const messageBackgroundColor = css.messageBackgroundColor;
        const messageBackgroundColorAgent = css.messageBackgroundColorAgent;
        const chatConversationTextareaBgColor = css.chatConversationTextareaBgColor;
        const chatConversationTextareaColor = css.chatConversationTextareaColor;
        const askEULATextColor = css.askEULATextColor;
        setMaincolor(headerColor);
        setBodycolor(bColor);
        setTopColor(headerTextColor);
        setCbColor(chatConversationBgColor);
        setCtColor(chatConversationTextColor);
        setCcbColor(messageBackgroundColor);
        setCabColor(messageBackgroundColorAgent);
        setIbColor(chatConversationTextareaBgColor);
        setItColor(chatConversationTextareaColor);
        setWarningtColor(wColor);
        setEULAColor(askEULATextColor);

        //Get text
        const text = data.text;
        const nametext = text.textInputName;
        const emailtext = text.textInputEmail;
        const errorEmail = text.textMessageEmailInvalid;
        const questiontext = text.textInputQuestion;
        const textEULA = text.textEULA;
        const textTitle = text.textTitle;
        setNameText(nametext);
        setEmailText(emailtext);
        setEmailErrorText(errorEmail);
        setQuestionText(questiontext);
        setEulaT(textEULA);
        setHeaderText(textTitle);
        //Get UI
        const ui = data.ui;
        const askEULA = ui.askEULA;
        setEULA(askEULA);

        //----------------------------------------------------------------
        // console.log('id is here --------->', itColor)
        // console.log('id is here --------->', text)
        // console.log('id is here --------->', ui)
        // console.log('id is here --------->', textEULA)



    };

    //Color use
    const primaryColor = mainColor ? mainColor : '#0C87F7';
    const secondaryColor = bodyColor ? bodyColor : 'white';
    const headerColor = topColor ? topColor : 'white';
    const chatBgColor = cbColor ? cbColor : 'white';
    const chatTextColor = ctColor ? ctColor : '#6D6D6D';
    const clientBgColor = ccbColor ? ccbColor : '#F8F8F8';
    const agentBgColor = cabColor ? cabColor : 'white';
    const inputBgColor = ibColor ? ibColor : 'white';
    const inputTextColor = itColor ? itColor : primaryColor;
    const warningColor = warningtColor ? warningtColor : '#DB0007';
    const EULAColor = eulaColor ? eulaColor : '#424242';


    //Text use
    const nameInput = nameText ? nameText : 'Name...';
    const emailInput = emailText ? emailText : 'Email...';
    const errorEmail = emailErrorText ? emailErrorText : 'Please enter a valid email address.';
    const questionInput = questionText ? questionText : 'Question...';
    const EulaLabel = eulaT ? eulaT : 'I consent to that information about this chat will be collected and stored in accordance with Data Privacy laws and directives.';
    const titleText = headerText ? headerText : 'Live chat' ;

    //-----------------------------------------------------------------------------------

    const opacity = showOtherContent || animationCompleted ? 1 : animationProgress / 70;
    const fillColor = `rgba(${parseInt(primaryColor.substring(1, 3), 16)}, ${parseInt(primaryColor.substring(3, 5), 16)}, ${parseInt(primaryColor.substring(5, 7), 16)}, ${opacity})`;

      
    // UseEffect---------------------------------------------------------------------------------------------
    useEffect(() => {
        fetchChatSdk();
    }, [])
    useEffect(() => {
        if (resumeChat){
            setShowChatPage(true);
        }
        const timeout = setTimeout(() => {
            setShowOtherContent(true);
        }, 3000);


        return () => clearTimeout(timeout);
    }, [isChatModalVisible]);
    useEffect(() => {
        let interval;

        if (!showOtherContent && !animationCompleted) {
            interval = setInterval(() => {
                setAnimationProgress((prev) => {
                    const nextProgress = (prev + 0.5) % 101;

                    if (nextProgress === 0) {

                        clearInterval(interval);
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
    }, [showOtherContent, animationCompleted]);

    useEffect(() => {
        if (!isChatModalVisible) {
            setAnimationProgress(1);
            setAnimationCompleted(false);
        }
    }, [isChatModalVisible]);

    useEffect(() => {

        if (!isChatModalVisible) {
            setName('');
            setEmail('');
            setQuestion('');
            setShowOtherContent(false);
        }

    }, [isChatModalVisible]);

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => {
                setKeyboardVisible(true);
            }
        );
        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => {
                setKeyboardVisible(false);
            }
        );

        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);
    //---------------------------------------------------------------------------------------------------------
    const handleNext = async () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!name || !email || !question) {
            setEmailError("Please fill in all fields.");
            return;
        } else if (!emailRegex.test(email)) {
            setEmailError(errorEmail);
            return;
        } else {
            try {
                setEmailError("");
                setShowChatPage(true);
              } catch (error) {
                // Handle any errors that occurred during registration
                console.error("Registration failed:", error);
                setEmailError("Registration failed. Please try again.");
              }
        }
    };

    const toggleChatModal = () => {
        setShowChatPage(false);
        setShowOtherContent(false);
        setChatModalVisible(!isChatModalVisible);
        setAnimationProgress(0);
        setEmailError(null);
        fetchChatSdk();
    };

    return (
        <>
            <TouchableOpacity
                style={styles.floatingButton}
                onPress={toggleChatModal}
            >
                <CentionIcons name="v5-chat" size={21} fontWeight="800" color="white" />
            </TouchableOpacity>

            <Modal animationType="fade" transparent={true} visible={isChatModalVisible}>
                <TouchableWithoutFeedback onPress={toggleChatModal}>
                    <View style={styles.modalContainer}>

                        <TouchableWithoutFeedback>
                            <View style={[styles.modalContent, { backgroundColor: secondaryColor, }]}>
                                {showChatPage ? (
                                    <NextModal
                                       email={email}
                                        question={question}
                                        name={name}
                                        workSpace={workSpace}
                                        widgetId={widgetId}
                                        primaryColor={primaryColor}
                                        headerColor={headerColor}
                                        chatBgColor = {chatBgColor}
                                        chatTextColor = {chatTextColor}
                                        clientBgColor = {clientBgColor}
                                        agentBgColor = {agentBgColor}
                                        inputBgColor = {inputBgColor}
                                        inputTextColor = {inputTextColor}
                                        titleText = {titleText}
                                        availableAgents = {availableAgents}
                                        newChat={newChat}
                                        toggleChatModal = {toggleChatModal}
                                    />
                                ) : (
                                    <>
                                        {showOtherContent && !keyboardVisible && (
                                            <View style={styles.action}>
                                                <TouchableOpacity onPress={toggleChatModal}>
                                                    <Svg xmlns="http://www.w3.org/2000/svg" width="15px" height="15px" viewBox="0 0 16 16">
                                                        <Path fill={primaryColor} fill-rule="evenodd" d="M11.2929,3.29289 C11.6834,2.90237 12.3166,2.90237 12.7071,3.29289 C13.0976,3.68342 13.0976,4.31658 12.7071,4.70711 L9.41421,8 L12.7071,11.2929 C13.0976,11.6834 13.0976,12.3166 12.7071,12.7071 C12.3166,13.0976 11.6834,13.0976 11.2929,12.7071 L8,9.41421 L4.70711,12.7071 C4.31658,13.0976 3.68342,13.0976 3.29289,12.7071 C2.90237,12.3166 2.90237,11.6834 3.29289,11.2929 L6.58579,8 L3.29289,4.70711 C2.90237,4.31658 2.90237,3.68342 3.29289,3.29289 C3.68342,2.90237 4.31658,2.90237 4.70711,3.29289 L8,6.58579 L11.2929,3.29289 Z" />
                                                    </Svg>
                                                </TouchableOpacity>
                                            </View>
                                        )}
                                        {!keyboardVisible && (
                                            <View style={styles.svgContainer}>
                                                <Svg xmlns="http://www.w3.org/2000/Svg" fill={fillColor} height="100px" width="100px" viewBox="0 0 409.934 409.934">

                                                    <Path d="M113.897,113.891c3.516-3.513,9.215-3.511,12.729,0.006l0.53,0.531c3.513,3.516,3.51,9.215-0.006,12.728  c-1.758,1.756-4.06,2.633-6.361,2.633c-2.305,0-4.609-0.88-6.367-2.639l-0.53-0.531  C110.379,123.102,110.382,117.403,113.897,113.891z M196.217,85.171v0.75c0,4.971,4.029,9,9,9s9-4.029,9-9v-0.75  c0-4.971-4.029-9-9-9S196.217,80.2,196.217,85.171z M324.014,195.717c-4.971,0-9,4.029-9,9s4.029,9,9,9h0.75c4.971,0,9-4.029,9-9  s-4.029-9-9-9H324.014z M173.759,31.211c0-17.209,14-31.21,31.208-31.21c17.21,0,31.211,14,31.211,31.21  c0,17.208-14.001,31.208-31.211,31.208C187.759,62.419,173.759,48.419,173.759,31.211z M191.759,31.211  c0,7.283,5.925,13.208,13.208,13.208c7.284,0,13.211-5.925,13.211-13.208c0-7.284-5.927-13.21-13.211-13.21  C197.684,18.001,191.759,23.927,191.759,31.211z M305.765,104.171c-5.896-5.895-9.142-13.732-9.142-22.068  c0-8.336,3.246-16.174,9.141-22.068c12.17-12.169,31.967-12.169,44.137,0c12.167,12.169,12.167,31.968,0,44.136  c-6.084,6.083-14.077,9.125-22.068,9.125C319.84,113.296,311.849,110.255,305.765,104.171z M314.623,82.103  c0,3.528,1.374,6.845,3.868,9.34c5.151,5.15,13.53,5.149,18.682,0c5.149-5.15,5.149-13.53-0.001-18.681  c-2.574-2.575-5.958-3.862-9.34-3.862c-3.383,0-6.765,1.287-9.34,3.862C315.997,75.258,314.623,78.575,314.623,82.103z   M60.034,104.17C47.866,92,47.866,72.202,60.035,60.034c12.168-12.17,31.969-12.168,44.137,0c12.168,12.167,12.168,31.966,0,44.135  c-5.896,5.895-13.732,9.142-22.069,9.142C73.767,113.312,65.93,110.065,60.034,104.17z M72.763,91.442  c5.15,5.151,13.53,5.149,18.681,0c5.15-5.15,5.15-13.53,0-18.68c-5.15-5.15-13.53-5.151-18.681,0  C67.612,77.912,67.612,86.292,72.763,91.442z M289.147,129.789c2.306,0,4.612-0.881,6.37-2.642l0.529-0.53  c3.511-3.518,3.506-9.216-0.012-12.728c-3.519-3.511-9.216-3.507-12.729,0.012l-0.529,0.53c-3.511,3.518-3.506,9.216,0.012,12.728  C284.547,128.913,286.847,129.789,289.147,129.789z M236.178,378.723c0,17.209-14.001,31.209-31.211,31.209  c-17.208,0-31.208-14-31.208-31.209c0-17.208,14-31.209,31.208-31.209C222.177,347.514,236.178,361.515,236.178,378.723z   M218.178,378.723c0-7.284-5.927-13.209-13.211-13.209c-7.283,0-13.208,5.925-13.208,13.209s5.925,13.209,13.208,13.209  C212.251,391.933,218.178,386.007,218.178,378.723z M85.171,195.717c-4.971,0-9,4.029-9,9s4.029,9,9,9h0.75c4.971,0,9-4.029,9-9  s-4.029-9-9-9H85.171z M349.899,305.762c12.168,12.168,12.169,31.968,0.001,44.137c-6.084,6.084-14.076,9.126-22.068,9.126  s-15.983-3.042-22.067-9.125c-0.001,0-0.001,0-0.001,0c-5.895-5.895-9.141-13.733-9.141-22.069c0-8.336,3.246-16.174,9.142-22.069  C317.933,293.595,337.731,293.596,349.899,305.762z M337.172,318.49c-5.148-5.148-13.528-5.149-18.681,0.001  c-2.494,2.494-3.868,5.812-3.868,9.34s1.374,6.845,3.869,9.341l-0.001,0c5.15,5.15,13.531,5.15,18.682,0  C342.322,332.021,342.322,323.641,337.172,318.491z M296.044,283.314l-0.529-0.53c-3.514-3.517-9.213-3.519-12.729-0.006  c-3.516,3.513-3.519,9.211-0.006,12.728l0.529,0.53c1.758,1.759,4.063,2.639,6.367,2.639c2.302,0,4.604-0.877,6.361-2.633  C299.554,292.529,299.557,286.83,296.044,283.314z M409.934,204.967c0,17.209-14,31.21-31.209,31.21s-31.21-14.001-31.21-31.21  c0-17.208,14.001-31.209,31.21-31.209S409.934,187.758,409.934,204.967z M391.934,204.967c0-7.284-5.926-13.209-13.209-13.209  c-7.284,0-13.21,5.925-13.21,13.209c0,7.284,5.926,13.21,13.21,13.21C386.008,218.177,391.934,212.251,391.934,204.967z   M296.217,209.873v-19.948c0-8.283-7.239-14.943-18.381-17.265c-11.453-28.913-39.76-49.414-72.7-49.414  c-32.981,0-61.512,20.557-72.938,49.527c-10.84,2.419-17.981,9-17.981,17.151v19.948c0,8.669,8.014,15.563,20.068,17.562  c2.605,0.434,5.505-0.303,7.523-2.014c2.017-1.71,3.409-4.22,3.409-6.865v-17.224c0-33.132,26.838-60.087,59.97-60.087  s60.027,26.955,60.027,60.087c0,25.728-16.208,48.037-40.028,56.434c-2.833-2.391-6.521-4.051-10.509-4.051h-19.216  c-8.971,0-16.27,7.529-16.27,16.5s7.299,16.5,16.27,16.5h19.216c7.277,0,13.453-4.816,15.526-11.417  c23.194-7.841,41.083-25.939,48.827-48.424C289.483,224.337,296.217,217.854,296.217,209.873z M104.172,305.763  c12.168,12.169,12.167,31.969,0,44.136c-6.085,6.084-14.077,9.126-22.069,9.126c-7.991,0-15.983-3.042-22.067-9.125  c-12.168-12.168-12.169-31.967-0.001-44.136c0,0,0,0,0.001,0C72.203,293.597,92.002,293.595,104.172,305.763z M91.443,318.491  c-5.152-5.151-13.531-5.15-18.682,0l0.001,0c-5.15,5.15-5.15,13.531,0,18.681c5.149,5.15,13.531,5.149,18.681,0  C96.594,332.022,96.594,323.642,91.443,318.491z M31.21,236.177c-17.209,0-31.21-14.001-31.21-31.21  c0-17.208,14.001-31.209,31.21-31.209s31.21,14,31.21,31.209C62.42,222.176,48.419,236.177,31.21,236.177z M44.42,204.967  c0-7.284-5.926-13.209-13.21-13.209S18,197.683,18,204.967c0,7.284,5.926,13.21,13.21,13.21S44.42,212.251,44.42,204.967z   M114.425,282.782l-0.53,0.53c-3.515,3.515-3.515,9.213,0,12.728c1.758,1.757,4.061,2.636,6.364,2.636s4.606-0.879,6.364-2.636  l0.53-0.53c3.515-3.515,3.515-9.213,0-12.728C123.638,279.267,117.94,279.267,114.425,282.782z M214.217,324.763v-0.75  c0-4.971-4.029-9-9-9s-9,4.029-9,9v0.75c0,4.971,4.029,9,9,9S214.217,329.734,214.217,324.763z" />
                                                </Svg>
                                            </View>
                                        )}
                                        {showOtherContent && (

                                            <View style={[styles.contentContainer, { marginTop: keyboardVisible ? '25%' : '-25%' }]}>
                                                {emailError ? (
                                                    <Text style={[styles.errorText, { color: warningColor }]}>{emailError}</Text>
                                                ) : null}
                                                <TextInput
                                                    style={[styles.input, { borderColor: primaryColor }]}
                                                    placeholder={nameInput}
                                                    value={name}
                                                    onChangeText={(text) => setName(text)}
                                                />
                                                <TextInput
                                                    style={[styles.input, { borderColor: primaryColor }]}
                                                    placeholder={emailInput}
                                                    value={email}
                                                    onChangeText={(text) => setEmail(text)}
                                                    keyboardType="email-address" // This will set the keyboard type to email
                                                />

                                                <TextInput
                                                    style={[styles.input1, { borderColor: primaryColor }]}
                                                    placeholder={questionInput}
                                                    value={question}
                                                    multiline={true}
                                                    returnKeyType="default"
                                                    textAlignVertical="top"
                                                    onChangeText={(text) => setQuestion(text)}
                                                />
                                                {eula && !keyboardVisible && (
                                                    <View style={styles.eulaTextContainer}>
                                                        <Text style={[styles.eulaText, { color: EULAColor }]}>{EulaLabel}</Text>
                                                    </View>
                                                )}
                                                <View style={styles.buttonContainer}>
                                                    <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                                                        <Svg xmlns="http://www.w3.org/2000/Svg" fill={primaryColor} height="30px" width="30px" viewBox="0 0 512 512">
                                                            <G>
                                                                <G>
                                                                    <G>
                                                                        <Path d="M256,0C114.618,0,0,114.618,0,256s114.618,256,256,256s256-114.618,256-256S397.382,0,256,0z M256,469.333     c-117.818,0-213.333-95.515-213.333-213.333S138.182,42.667,256,42.667S469.333,138.182,469.333,256S373.818,469.333,256,469.333     z" />
                                                                        <Path d="M228.418,134.248c-8.331-8.331-21.839-8.331-30.17,0c-8.331,8.331-8.331,21.839,0,30.17L289.83,256l-91.582,91.582     c-8.331,8.331-8.331,21.839,0,30.17c8.331,8.331,21.839,8.331,30.17,0l106.667-106.667c8.331-8.331,8.331-21.839,0-30.17     L228.418,134.248z" />
                                                                    </G>
                                                                </G>
                                                            </G>
                                                        </Svg>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        )}
                                        {showOtherContent && !keyboardVisible && (
                                            <View style={styles.bottom}>
                                                <Text style={styles.bottomText}>
                                                    Powered by <Text style={{ fontWeight: 'bold', color: primaryColor }}>Cention</Text>
                                                </Text>
                                            </View>
                                        )}

                                    </>
                                )}
                            </View>

                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.8)', // Semi-transparent black background
    },
    modalContent: {
        // padding: 15,
        borderRadius: 10,
        width: '90%',
        height: '90%',
    },
    action: {
        padding: 15,
        marginBottom: -80,
    },
    floatingButton: {
        position: 'absolute',
        bottom: 10,
        left: '84%',
        backgroundColor: '#0f83ed',
        padding: 10,
        borderRadius: 100,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.14,
        shadowRadius: 4,
        elevation: 4,
        zIndex: 997,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    errorText: {
        color: '#DB0007',
        fontSize: 13,
        fontFamily: 'Roboto',
        marginBottom: 15,
    },
    contentContainer: {
        flex: 1,
        alignItems: 'center',
        zIndex: 999,
    },
    input: {
        width: '80%',
        height: 'auto',
        borderBottomWidth: 1,
        borderRightWidth: 1,
        borderRadius: 15,
        padding: 4,
        paddingLeft: 15,
        marginBottom: 15,
        alignSelf: 'center',
        alignItems: 'center',
        fontSize: 12,

    },
    input1: {
        width: '80%',
        height: '30%',
        borderBottomWidth: 1,
        borderRightWidth: 1,
        borderRadius: 15,
        padding: 4,
        paddingTop: 12,
        paddingLeft: 15,
        marginBottom: 15,
        alignSelf: 'center',
        alignItems: 'center',
        fontSize: 12,

    },
    eulaTextContainer: {
        width: '70%',
        height: 'auto',
    },
    eulaText: {
        fontSize: 11,
        fontFamily: 'Roboto',
        textAlign: 'center',
        fontWeight: '800',
    },

    buttonContainer: {
        alignSelf: 'center',
    },
    nextButton: {

        padding: 15,

        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',

    },
    closeButton: {
        backgroundColor: 'red',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        marginLeft: 5,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    svgContainer: {
        flex: 1,

        alignItems: 'center',
        justifyContent: 'center',
    },
    bottom: {
        alignSelf: 'flex-end',
        padding: 15,
    },
    bottomText: {
        fontSize: 12,
        color: '#424242',
        fontFamily: 'Roboto',
        fontWeight: '600',

    },
});

export default ChatModal;
