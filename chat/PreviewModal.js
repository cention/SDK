import React, { useState } from 'react';
import {previewStyles} from './chatS';
import { View, Modal, Image, Text, Button, TouchableOpacity,Linking, StyleSheet } from 'react-native';
import Swiper from 'react-native-swiper';
import CentionIcons from '../cention-icons';
const PreviewModal = ({
  visible,
  isSent,
  imageUri,
  onClose,
  onSend,
  isAttachmentPreviewModalVisible,
  renderFooter,
  handleSendMessage,
  message
}) => {
  const [galleryIndex, setGalleryIndex] = useState(0);

  const openGallery = (index) => {
    setGalleryIndex(index);
  };
  const openImageLink = (url) => {
    Linking.openURL(url);
  };

  return (
    <Modal visible={visible} transparent={true}>
      <View style={previewStyles.modalContainer}>
        <Swiper index={galleryIndex} showsPagination={false} style={previewStyles.swiper}>
          {imageUri.map((image, i) => (
            <View style={previewStyles.slide} key={i}>
              <TouchableOpacity onPress={() => openGallery(i)}>
                <Image source={{ uri: image.url }} style={previewStyles.image} />
                <Text style={{ color: 'white' }}>{image.fileName}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => openImageLink(image.url)}>
              {isAttachmentPreviewModalVisible && (
                <Text style={{ color: 'red', textDecorationLine: 'underline' }}>
                 Download
                </Text>
              )}
              </TouchableOpacity>
            </View>
          ))}
        </Swiper>

        <TouchableOpacity onPress={onClose} style={previewStyles.closeButton}>
        <CentionIcons name="times" size={21} fontWeight="800" color="white" />
        </TouchableOpacity>

       
      </View>
      <View style={previewStyles.foot}>
      {renderFooter(onSend)}
      </View>
    </Modal>
  );
};



export default PreviewModal;
