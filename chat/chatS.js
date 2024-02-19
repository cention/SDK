import { StyleSheet } from 'react-native';

// ChatPage ------------------------------------------------------------------------------------------------
export const chatStyles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    justifyContent: 'center',
    backgroundColor: '#F8F8F8',
  },
  sendMessageButton: {
    width: 58, height: 32,
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
    backgroundColor: '#F8F8F8',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 16,
    paddingLeft: 16,
    paddingTop: 16,
    zIndex: 2,
  },
  actionIconGroup: {

    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  actionIcon: {
    marginRight: 15,
  },
  avatarContainer2: {},
  avatar2: {
    width: 28,
    height: 28,
    padding: 5,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 16,
  },
  avatarText2: {
    fontSize: 8,
    color: 'white',
    fontWeight: 'bold',
  },
  senderABb: {
    color: '#0C87F7',
    fontSize: 14,
    fontFamily: 'Roboto',
    fontWeight: '700',
    lineHeight: 20,

    paddingLeft: 8,
  },
  threeC: {
    flexDirection: 'row',
    width: '90%',
    alignItems: 'center',
  },
  namecontainer: {
    width: '70%',
    height: 'auto',
  },
  iconAb2: {
    paddingLeft: 8,

    justifyContent: 'flex-end',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // 0.5 black transparency
  },

  dropdownMenu: {
    width: 'auto',
    hight: 'auto',
    position: 'absolute',
    top: '7.5%',
    left: '58%',
    backgroundColor: 'white',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 4,

    zIndex: 999,
  },
  dropdownItem: {
    paddingRight: 12,
    paddingLeft: 12,
    paddingTop: 16,
    paddingBottom: 16,
  },
  dropdownItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icond: {
    width: 13,
    height: 13,
    marginRight: 2,
    marginLeft: 1,
  },
  dropdownText: {
    marginLeft: 10,
    color: '#6D6D6D',
    fontSize: 12,
    fontFamily: 'Roboto',
    fontWeight: '400',
    lineHeight: 20,
    flexWrap: 'wrap',
  },
  dropdownTextTag: {
    marginLeft: 10,
    color: '#6D6D6D',
    fontSize: 12,
    fontFamily: 'Roboto',
    fontWeight: '800',
    lineHeight: 20,
    flexWrap: 'wrap',
  },
  closeIc: {},
  dropdownText3: {
    color: '#6D6D6D',
    fontSize: 14,
    fontFamily: 'Roboto',
    fontWeight: '700',
    lineHeight: 20,
    flexWrap: 'wrap',
    textAlign: 'center',
    marginBottom: 8,
    marginTop: 8,
  },
  dropdownText4: {
    color: '#6D6D6D',
    fontSize: 12,
    fontFamily: 'Roboto',
    fontWeight: '400',
    lineHeight: 20,
    flexWrap: 'wrap',
  },
 
  
  convBar: {
    borderWidth: 1,
    borderColor: '#E2E2E2',
    borderTopWidth: 1,
    width: '100%',
    height: 'auto',
    backgroundColor: '#F8F8F8',
  },

  conv: {},
  convContent: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginVertical: 10,
  },
  tagsS: {
    width: 'auto',
    flexDirection: 'row',
    alignSelf: 'center',
    paddingBottom: 5,
  },

  idC: {
    width: 'auto',
    height: 'auto',
    paddingLeft: 5,
    paddingRight: 5,
    paddingTop: 2,
    backgroundColor: '#0C87F7',
    borderRadius: 16,
    marginRight: 5,

  },
  idT: {
    width: 'auto',
    height: 'auto',
    color: 'white',
    fontSize: 12,
    fontFamily: 'Roboto',
    fontWeight: '700',
    lineHeight: 16,
  },
  idC1: {
    width: 'auto',
    height: 'auto',
    paddingLeft: 5,
    paddingRight: 5,
    paddingTop: 2,
    // backgroundColor: '#E0F3FF',
    borderRadius: 16,
    marginRight: 5,
    paddingBottom: 2,
    // backgroundColor: '#E0F3FF',
    // borderWidth: 1,
    // borderColor: '#0C87F7',
    // borderRadius: 16,
    // marginRight: 5,
    // paddingBottom: 5,
  },
  idT1: {
    width: 'auto',
    height: 'auto',
    color: 'white',
    fontSize: 10,
    color: 'white',
    fontFamily: 'Roboto',
    fontWeight: '700',
    lineHeight: 16,
  },
  textCont: {
    width: '60%',
    height: 'auto',
    alignItems: 'center',
  },
  titleS: {

    color: '#6D6D6D',
    fontSize: 14,
    fontFamily: 'Roboto',
    fontWeight: '700',
    lineHeight: 20,
    bottom: 2,
  },
  titleT: {

    color: '#0C87F7',
    fontSize: 14,
    fontFamily: 'Roboto',
    fontWeight: '700',
    lineHeight: 20,
    bottom: 2,
  },
  addTagButton: {
    color: '#0C87F7',
    fontSize: 12,
    fontFamily: 'Roboto',
    fontWeight: '400',
    lineHeight: 16,
    flexWrap: 'wrap',
  },
  addTagButton1: {
    color: '#0C87F7',
    fontSize: 10,
    alignSelf: 'flex-end',
    paddingLeft: 3,
    paddingRight: 3,
    margin: 1,
    textAlign: 'center',
    fontFamily: 'Roboto',
    fontWeight: '400',
    backgroundColor: '#E0F3FF',
    borderRadius: 3,
  },

  tagC: {
    flexDirection: 'row',
  },

  messageContainer: {
    paddingBottom: 16,
    paddingTop: 3,
    marginTop: 16,
    paddingLeft: 16,
    paddingRight: 16,
    backgroundColor: '#F8F8F8',
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
    backgroundColor: '#E6F7FF',
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
  avatarText: {
    fontSize: 8,
    color: 'white',
    fontWeight: 'bold',
  },
  avatarText1: {
    fontSize: 8,
    color: 'white',
    fontWeight: 'bold',
  },

  avatar1: {
    width: 28,
    height: 28,
    padding: 5,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    top: 10,
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
  idTimestampContainer: {
    width: '50%',
    flexDirection: 'row',
    alignSelf: 'center',
    marginBottom: 20,
  },
  idTimestampContainer2: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginBottom: 20,
  },
  iconAb: {
    top: '0.5%',
    marginLeft: 6,
  },
  social: {
    paddingRight: 4,
    paddingTop: 2,
  },
  id: {
    color: '#969696',
    fontSize: 10,
    fontFamily: 'Roboto',
    fontWeight: '700',
    lineHeight: 16,
  },
  image: {
    width: 30,
    height: 30,
    borderRadius: 24,
    marginTop: 10,
    marginBottom: 14,
    alignSelf: 'center',
  },
  timestamp: {
    width: '100%',
    color: '#969696',
    fontSize: 10,
    fontFamily: 'Roboto',
    fontWeight: '400',
    lineHeight: 16,

    textAlign: 'center',
  },
  id1: {
    color: '#969696',
    fontSize: 10,
    fontFamily: 'Roboto',
    fontWeight: '700',
    lineHeight: 16,
  },
  timestamp1: {
    width: '35%',
    color: '#969696',
    fontSize: 10,
    fontFamily: 'Roboto',
    fontWeight: '400',
    lineHeight: 16,
    paddingRight: 4,
  },

  showT: {
    color: '#0C87F7',
    fontSize: 10,
    fontFamily: 'Roboto',
    fontWeight: '400',
    lineHeight: 16,
  },
  buttonContainer: {
    width: 361,
    height: 48,
    flexDirection: 'row',
    backgroundColor: '#f8f8f8',
    alignItem: 'flex-start',
    //alignSelf: 'stretch',
    borderTopLeftRadius: 0, // No radius at the top
    borderTopRightRadius: 0,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  cancelButton: {
    width: 248,
    padding: 8,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    flex: 1,
    marginRight: 8,
  },

  dot: {
    paddingTop: 8,
  },
  dot1: {
    paddingTop: 8,
    marginRight: 15,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 'auto',
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: '#F2F2F2',
  },
  inputWrapper: {
    flex: 1,
    marginBottom: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },

  input: {
    width: '70%',
    height: 32,

    borderRadius: 6,
    color: '#6D6D6D',
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
  menuBarLeft: {},
  menuBarRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  leftButton: {
    fontSize: 16,
    color: 'blue',
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
  dropdownMenu2: {
    position: 'absolute',
    width: 'auto',
    top: '33%',
    left: '40%',
    backgroundColor: 'white',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 4,
  },
  dropdownMenu3: {
    position: 'absolute',
    width: '90%',
    height: 'auto',
    top: '35%',
    alignSelf: 'center',
    backgroundColor: 'white',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 4,

    zIndex: 999,
  },
  dropdownMenu4: {
    position: 'absolute',
    width: 'auto',
    top: '15%',
    left: '48%',
    backgroundColor: 'white',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 4,

  },
  tagR: {

    flexDirection: 'row',
    marginBottom: 5,
  },
  searchInput: {
    borderBottomWidth: 0.5,
    height: 20,
    borderColor: '#0C87F7',
    paddingLeft: 5,
    paddingRight: 10,
    paddingVertical: 0,
    fontSize: 14,
    marginLeft: 10,
    marginBottom: 10,

  },


  dropdownItem1: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 12,
    paddingLeft: 12,
    paddingTop: 16,
    paddingBottom: 16,
  },

  dropdownItem2: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 12,
    paddingLeft: 12,
    paddingTop: 16,
    paddingBottom: 8,
  },
  dropdownItem4: {


    paddingRight: 24,
    paddingLeft: 24,
    paddingTop: 16,
    paddingBottom: 16,
  },
  dialogContainer: {
    width: 361,
    backgroundColor: '#FFF',
    flexDirection: 'column',
    borderRadius: 8,
    borderBottomEndRadius: 0,
    borderBottomLeftRadius: 0,
    alignItems: 'flex-start',
    paddingHorizontal: 32,
    paddingVertical: 24,
  },
  cancelText: {
    fontSize: 12,
  },
  sendMessageButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 12,
  },
  dropdownItem3: {
    alignItems: 'center',
    backgroundColor: 'white',
    paddingRight: 32,
    paddingLeft: 32,
    paddingTop: 24,
    paddingBottom: 24,
  },
  pad2: {
    flex: 1,
    flexDirection: 'row',
    alignSelf: 'flex-end',
    backgroundColor: '#F8F8F8',
    paddingRight: 16,
    paddingLeft: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  dropdownItemB1: {
    width: 'auto',
    height: 36,
    borderRadius: 4,
    backgroundColor: '#F4213F',
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 8,
    paddingBottom: 8,
    marginLeft: 8,
    alignSelf: 'center',
  },
  b1Text: {
    color: 'white',
    fontSize: 12,
    fontFamily: 'Roboto',
    fontWeight: '400',
    lineHeight: 20,
    flexWrap: 'wrap',
    textAlign: 'center',
  },
  dropdownItemB2: {
    flex: 1,
    width: '100%',
    height: 36,
    borderColor: '#ddd',
    borderWidth: 0,
    borderRadius: 4,

    backgroundColor: '#F8F8F8',
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 8,
    paddingBottom: 8,
    alignSelf: 'center',
  },
  b2Text: {
    textAlign: 'right',
    color: '#6D6D6D',
    fontSize: 12,
    fontFamily: 'Roboto',
    fontWeight: '400',
    lineHeight: 20,
    flexWrap: 'wrap',
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
  pad: {
    paddingBottom: 10,
  },
  dropdownText2: {
    marginLeft: 10,
    color: '#6D6D6D',
    fontSize: 12,
    fontFamily: 'Roboto',
    fontWeight: '700',
    lineHeight: 20,
    flexWrap: 'wrap',
  },
  sendButton: {
    fontSize: 16,
    color: '#007AFF',
    alignSelf: 'flex-end',
  },
  row: {
    paddingLeft: 5,

    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  label: {
    marginLeft: 10,
    fontSize: 12,
    // fontWeight: 'bold',
    width: 80,
  },
  value: {
    fontSize: 12,
  },
});
//ExpendMore ------------------------------------------------------------------------------------------

export const expendStyles = StyleSheet.create({
  convBar: {
    borderWidth: 1,
    borderColor: '#E2E2E2',
    borderTopWidth: 1,
    width: '100%',
    height: 'auto',
    backgroundColor: '#F8F8F8',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // 0.5 black transparency
  },

  row: {
    paddingLeft: 5,

    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  label: {
    marginLeft: 10,
    fontSize: 12,
    // fontWeight: 'bold',
    width: 80,
  },
  value: {
    fontSize: 12,
  },
  dropdownText: {
    marginLeft: 10,
    color: '#6D6D6D',
    fontSize: 12,
    fontFamily: 'Roboto',
    fontWeight: '400',
    lineHeight: 20,
    flexWrap: 'wrap',
  },
  pad: {
    paddingBottom: 10,
  },
  greenColor: {
    color: '#00CC77'
  },
  underline: {
    color: '#0C87F7',
    fontSize: 12,
    textDecorationLine: 'underline'
  },
  dropdownItem2: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 12,
    paddingLeft: 12,
    paddingTop: 16,
    paddingBottom: 8,
  },
  dropdownMenu2: {
    position: 'absolute',
    width: 'auto',
    top: '37%',
    left: '10%',
    backgroundColor: 'white',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 4,
  },
  dropdownMenu1: {
    position: 'absolute',
    width: 'auto',
    top: '34%',
    left: '10%',
    backgroundColor: 'white',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 4,
  },
})

//Forward ------------------------------------------------------------------------------------------
export const forwardStyles = StyleSheet.create({

  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // 0.5 black transparency
  },

  dropdownText: {
    marginLeft: 10,
    color: '#6D6D6D',
    fontSize: 12,
    fontFamily: 'Roboto',
    fontWeight: '400',
    lineHeight: 20,
    flexWrap: 'wrap',
  },
  pad: {
    paddingBottom: 10,
  },

  dropdownItem2: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 12,
    paddingLeft: 12,
    paddingTop: 16,
    paddingBottom: 8,
  },
  dropdownText2: {
    marginLeft: 10,
    color: '#6D6D6D',
    fontSize: 12,
    fontFamily: 'Roboto',
    fontWeight: '700',
    lineHeight: 20,
    flexWrap: 'wrap',
  },
  dropdownMenu2: {
    position: 'absolute',
    width: 'auto',
    top: '40%',
    left: '48%',
    backgroundColor: 'white',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 4,
  },
})

//MoveToFolder ----------------------------------------------------------------------------------------

export const moveStyles = StyleSheet.create({

  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // 0.5 black transparency
  },

  dropdownText: {
    marginLeft: 10,
    color: '#6D6D6D',
    fontSize: 12,
    fontFamily: 'Roboto',
    fontWeight: '400',
    lineHeight: 20,
    flexWrap: 'wrap',
  },
  pad: {
    paddingBottom: 10,
  },
  dropdownText2: {
    marginLeft: 10,
    color: '#6D6D6D',
    fontSize: 12,
    fontFamily: 'Roboto',
    fontWeight: '700',
    lineHeight: 20,
    flexWrap: 'wrap',
  },
  dropdownItem2: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 12,
    paddingLeft: 12,
    paddingTop: 16,
    paddingBottom: 8,
  },
  dropdownMenu2: {
    position: 'absolute',
    width: 'auto',
    top: '42%',
    left: '42%',
    backgroundColor: 'white',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 4,
  },

})

//Postpone ------------------------------------------------------------------------------------------------
export const postponeStyles = StyleSheet.create({
  container: {
    backgroundColor: '#F8F8F8',
  },
  pad: {
    paddingBottom: 10,
  },
  buttonContainer: {
    width: '90%',
    height: 'auto',
    flexDirection: 'row',
    backgroundColor: '#f8f8f8',
    alignItem: 'flex-start',
    //alignSelf: 'stretch',
    borderTopLeftRadius: 0, // No radius at the top
    borderTopRightRadius: 0,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  cancelText: {
    fontSize: 12,
  },
  dropdownItem2: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 12,
    paddingLeft: 12,
    paddingTop: 16,
    paddingBottom: 8,
  },
  dropdownText: {

    color: '#6D6D6D',
    fontSize: 12,
    fontFamily: 'Roboto',
    fontWeight: '400',
    lineHeight: 20,
    flexWrap: 'wrap',
  },
  dropdownText2: {

    color: '#6D6D6D',
    fontSize: 12,
    fontFamily: 'Roboto',
    fontWeight: '700',
    lineHeight: 20,
    flexWrap: 'wrap',
  },
  dropdownMenu2: {
    position: 'absolute',
    width: 'auto',
    top: '53%',
    left: '40%',
    backgroundColor: 'white',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 4,
  },
  cancelButton: {
    width: '100%',
    ppaddingLeft: 8,
    paddingRight: 8,

    paddingBottom: 10,

    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    flex: 1,
    marginRight: 8,
  },
  dialogContainer: {
    width: '90%',
    backgroundColor: '#FFF',
    flexDirection: 'column',
    borderRadius: 8,
    borderBottomEndRadius: 0,
    borderBottomLeftRadius: 0,
    alignItems: 'flex-start',
    paddingHorizontal: 32,
    paddingVertical: 24,
  },
  dropdownItemB1: {
    width: 'auto',
    height: 36,
    borderRadius: 4,
    backgroundColor: '#F4213F',
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 8,
    paddingBottom: 8,
    marginLeft: 8,
    alignSelf: 'center',
  },
  sendMessageButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 12,
  },
  dropdownText3: {
    color: '#6D6D6D',
    fontSize: 14,
    fontFamily: 'Roboto',
    fontWeight: '700',
    lineHeight: 20,

  },
  dropdownText4: {
    color: '#6D6D6D',
    fontSize: 12,
    fontFamily: 'Roboto',
    fontWeight: '400',
    lineHeight: 20,
  },
  
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },

})

//PreviewModal ----------------------------------------------------------------------------------------

export const previewStyles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  swiper: {
    alignSelf: 'center',
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 10,
  },
});

export const attachStyles = StyleSheet.create({
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
  icond: {
    width: 13,
    height: 13,
    marginRight: 2,
    marginLeft: 1,
  },

  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },




  dropdownMenu1: {
    position: 'absolute',
    bottom: '11.5%',
    left: '5%',
    backgroundColor: 'white',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 4,

    zIndex: 999,
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


});
