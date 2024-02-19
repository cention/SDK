import React from 'react';
import { View, Modal, Image, Text, Button, TouchableOpacity } from 'react-native';

const FilePreviewModal = ({ visible, imageUri, fileName, onClose, onSend, onRemove }) => {
  return (
    <Modal visible={visible} transparent={true}>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ position: 'absolute', top: 10, left: 10 }}>
          <TouchableOpacity onPress={onClose}>
            <Text style={{ color: 'white', fontSize: 18 }}>Close</Text>
          </TouchableOpacity>
        </View>
        <View style={{ alignItems: 'center' }}>
          <Image source={{ uri: imageUri }} style={{ width: 100, height: 100 }} />
          <Text style={{ fontSize: 16 }}>{fileName}</Text>
        </View>
        <View style={{ position: 'absolute', bottom: 10 }}>
          <Button title="Send" onPress={onSend} />
          <TouchableOpacity onPress={onRemove}>
            <Text style={{ color: 'red', fontSize: 16 }}>Remove</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default FilePreviewModal;
