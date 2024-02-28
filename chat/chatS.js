import { StyleSheet } from 'react-native';

//PreviewModal ----------------------------------------------------------------------------------------

export const previewStyles = StyleSheet.create({
  modalContainer: {
   top:'12.7%',
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 10,
    width: '90%',
    height: '80%',
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
    width: 250,
    height: 250,
  },
  buttonContainer: {
    
    bottom: 70,
  },
  foot:{
    top:'6.7%',
    alignItems: 'center',
    alignSelf: 'center',
    width: '90%',
    height: '90%',
  }
});

export const attachStyles = StyleSheet.create({
  dropdownItem1: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 16,
    paddingLeft: 16,
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
  icondd: {
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
    marginLeft: 8,
    color: '#6D6D6D',
    fontSize: 12,
    fontFamily: 'Roboto',
    fontWeight: '600',
    lineHeight: 20,
    flexWrap: 'wrap',
  },

});
