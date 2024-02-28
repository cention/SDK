import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { attachStyles } from '../chat/chatS';
import { attachStylesD } from '../chat/chatD';
import DocumentPicker from 'react-native-document-picker';
import CentionIcons from '../cention-icons';
import PreviewModal from '../chat/PreviewModal';
const FileUploader = props => {
  const isDarkMode = props.isDark;
  // console.log("chatEnded" , props.chatEnded)
  const attachStyle = isDarkMode ? attachStylesD : attachStyles;
  const [selectedFile, setSelectedFile] = useState('');
  const [isPreviewModalVisible, setIsPreviewModalVisible] = useState(false);
  const [isAttachmentPreviewModalVisible, setIsAttachmentPreviewModalVisible] =
    useState(false);
  const [isSent, setIsSent] = useState(false);
  const handleUpload = async () => {
    try {
      props.handleOverlayPress1()
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });

      if (result.length === 0) {
        return;
      }
      setSelectedFile(result[0]);
      setIsPreviewModalVisible(true);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // console.log('User canceled file selection.');
      } else {
        console.error('Error picking a file:', err);
      }
    }
  };

  const handlePrevAttach = async () => {
    try {
      props.handleOverlayPress1()
      setIsAttachmentPreviewModalVisible(true);
    } catch (err) { }
  };

  const closeModal = () => {
    setIsAttachmentPreviewModalVisible(false);
    setIsPreviewModalVisible(false);
    setIsSent(false);
  };

  const sendFile = async () => {
    console.log('========================================')
    const randomNum = Math.floor(Math.random() * 1000);
    try {
      const formData = new FormData();
      formData.append('uploadfile', {
        uri: selectedFile.uri,
        type: selectedFile.type,
        name: selectedFile.name,
      });
      // formData.append('fileNameOnly', selectedFile.name);
      formData.append('session', props.sessionId);
      formData.append('area', props.widgetId);
      formData.append('sessionSecret', props.sessionSecret);
      formData.append('random', randomNum);
      props.uploadAttachment(formData);
      setIsAttachmentPreviewModalVisible(false);
      setIsPreviewModalVisible(false);
      setIsSent(false);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User canceled file selection.');
      } else {
        console.error('Error picking a file:', err);
      }
    }
    setIsSent(true);
    if (props.isChat) {
      setIsPreviewModalVisible(false);
    }

    props.uploadAttachment(selectedFile.formData);
  };

  return (
    <View>
      <Modal
        transparent={true}
        animationType="none"
        visible={props.isDropdownOpen1}
        onRequestClose={props.handleCloseDropdown1}>
        <TouchableOpacity
          style={attachStyle.overlay}
          activeOpacity={1}
          onPress={props.handleOverlayPress1}></TouchableOpacity>

        <View style={attachStyle.dropdownMenu1}>
          {props.isAttachAvailable && (
            <TouchableOpacity
              style={attachStyle.dropdownItem1}
              onPress={handlePrevAttach}>
              <View style={attachStyle.dropdownItemContent1}>
                <Svg
                  style={attachStyle.icond}
                  viewBox="0 0 7 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <Path
                    d="M6 5.5V11.4675C5.99575 11.6215 5.8905 12.974 3.5 12.974C1.1095 12.974 1.00425 11.6215 1 11.474V2.50275C1.003 2.25175 1.08875 1 2.5 1C3.91125 1 3.997 2.25175 4 2.5V9.49425C4.00719 9.56193 3.99926 9.63037 3.97676 9.6946C3.95426 9.75884 3.91777 9.81727 3.86991 9.86567C3.82206 9.91408 3.76405 9.95124 3.70007 9.97447C3.6361 9.9977 3.56776 10.0064 3.5 10C3.4327 10.0066 3.36478 9.99821 3.30111 9.97542C3.23745 9.95263 3.17963 9.916 3.13181 9.86819C3.084 9.82037 3.04737 9.76255 3.02458 9.69889C3.00179 9.63522 2.99339 9.5673 3 9.5V5.5C3 5.36739 2.94732 5.24021 2.85355 5.14645C2.75979 5.05268 2.63261 5 2.5 5C2.36739 5 2.24021 5.05268 2.14645 5.14645C2.05268 5.24021 2 5.36739 2 5.5V9.5C1.99416 9.69857 2.02896 9.89624 2.10227 10.0809C2.17559 10.2655 2.28586 10.4332 2.42633 10.5737C2.5668 10.7141 2.7345 10.8244 2.91913 10.8977C3.10376 10.971 3.30143 11.0058 3.5 11C3.69857 11.0058 3.89624 10.971 4.08087 10.8977C4.2655 10.8244 4.4332 10.7141 4.57367 10.5737C4.71414 10.4332 4.82441 10.2655 4.89773 10.0809C4.97104 9.89624 5.00584 9.69857 5 9.5V2.5C5 1.63525 4.4775 0 2.5 0C0.5225 0 0 1.63525 0 2.5V11.475C0 11.5 0.04 13.975 3.5 13.975C6.96 13.975 7 11.5 7 11.475V5.5C7 5.36739 6.94732 5.24021 6.85355 5.14645C6.75979 5.05268 6.63261 5 6.5 5C6.36739 5 6.24021 5.05268 6.14645 5.14645C6.05268 5.24021 6 5.36739 6 5.5Z"
                    fill="#6D6D6D"
                  />
                </Svg>

                <Text style={attachStyle.dropdownText1}>Preview Attach files</Text>
              </View>
            </TouchableOpacity>

          )}

          <TouchableOpacity
            style={attachStyle.dropdownItem1}
            onPress={() => handleOptionSelect()}>
            {!props.chatEnded && (
              <View style={attachStyle.dropdownItemContent1}>
                <CentionIcons name="chat-close" size={19} fontWeight="800" color="#989898" />
                <Text style={attachStyle.dropdownText1}>End chat</Text>
              </View>
            )}
            {props.chatEnded && (
              <View style={attachStyle.dropdownItemContent1}>
                <CentionIcons name="chat-new" size={19} fontWeight="800" color="#989898" />
                <Text style={attachStyle.dropdownText1}>New chat</Text>
              </View>
            )}

          </TouchableOpacity>
          <TouchableOpacity style={attachStyle.dropdownItem1} onPress={handleUpload}>
            <View style={attachStyle.dropdownItemContent1}>
              <CentionIcons name="attachment" size={19} fontWeight="800" color="#989898" />

              <Text style={attachStyle.dropdownText1}>Attach files</Text>
            </View>
          </TouchableOpacity>



        </View>

      </Modal>

      {
        isAttachmentPreviewModalVisible && (
          <PreviewModal
            key={props.attachmentURL}
            visible={isAttachmentPreviewModalVisible}
            imageUri={props.attachmentURL ? props.attachmentURL : ''}
            renderFooter={props.renderFooterPreview}
            isAttachmentPreviewModalVisible={
              isAttachmentPreviewModalVisible
            }
            isSent={isSent}
            onSend={sendFile}
            onClose={closeModal}
            handleSendMessage = {props.handleSendMessage}
            message = {props.message}
          />
        )

      }

      {isPreviewModalVisible && (
        <PreviewModal
          visible={isPreviewModalVisible}
          imageUri={selectedFile ? [{ url: selectedFile.uri }] : ''}
          renderFooter={props.renderFooter}
          isSent={isSent}
          onSend={sendFile}
          onClose={closeModal}
        />
      )}

    </View>
  );
};

export default FileUploader;