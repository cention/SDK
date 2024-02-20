import React from 'react';
import { View, Text,Image, Button } from 'react-native';
import Swiper from 'react-native-swiper';
import PreviewModal from './PreviewModal';

const ImageGallery = ({ images, index, onClose, onSend }) => {
    return (
      <Swiper index={index} showsPagination={false}>
        {images.map((image, i) => (
          <View key={i}>
            <Image source={{ uri: image.url }} style={{ width: 200, height: 200 }} />
          </View>
        ))}
      </Swiper>
    );
  };
  

export default ImageGallery;
