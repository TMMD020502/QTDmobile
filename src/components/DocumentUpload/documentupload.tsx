import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Modal,
  StyleSheet,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import DocumentPicker, {
  DocumentPickerResponse,
} from 'react-native-document-picker';
import FileViewer from 'react-native-file-viewer';
import {AppIcons} from '../../icons';
import {Theme} from '../../theme/colors';
import ImageDisplay from '../ImageDisplay/ImageDisplay';
import {uploadImage} from '../../api/services/uploadImage';
//import {ExtendedDocumentPickerResponse} from '../../types/document';
import {createStyles} from './styles';

interface DocumentUploadProps {
  theme: Theme;
  selectedFiles: ExtendedDocumentPickerResponse[];
  onFilesChange: (files: ExtendedDocumentPickerResponse[]) => void;
  onDocumentIdsChange: (ids: string[]) => void;
}

interface ExtendedDocumentPickerResponse extends DocumentPickerResponse {
  source: 'local' | 'server';
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({
  theme,
  selectedFiles,
  onFilesChange,
  onDocumentIdsChange,
}) => {
  const {t} = useTranslation();
  const [showImage, setShowImage] = useState(false);
  const [selectedFileUri, setSelectedFileUri] = useState<string | null>(null);
  const styles = createStyles(theme);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  const handleFilePress = (file: ExtendedDocumentPickerResponse) => {
    if (file.source === 'local') {
      handleViewFile(file.uri);
    } else if (file.source === 'server') {
      setSelectedFileUri(file.uri);
      setShowImage(true);
    }
  };

  const handleViewFile = async (fileUri: string) => {
    try {
      await FileViewer.open(fileUri);
    } catch (error) {
      console.error('Error opening file:', error);
    }
  };

  const handleDocumentPick = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });

      const File: ExtendedDocumentPickerResponse = {
        ...res[0],
        source: 'local',
      };

      const file = {
        uri: res[0].uri,
        type: res[0].type || 'application/octet-stream',
        fileName: res[0].name || '',
        source: 'local',
        typeapi: 'FINANCIAL_INFO',
      };

      const uploadResponse = await uploadImage(file);

      if (uploadResponse) {
        const newFiles = [...selectedFiles, File];
        onFilesChange(newFiles);
        onDocumentIdsChange([
          ...selectedFiles.map(f => f.uri),
          uploadResponse.id || '',
        ]);
      }
    } catch (err) {
      console.error('Error picking document:', err);
    }
  };

  const handleRemoveFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    onFilesChange(newFiles);
    onDocumentIdsChange(newFiles.map(f => f.uri));
  };

  return (
    <View style={styles.boxInput}>
      <Text style={styles.headingTitle}>
        {t('formCreateLoan.financialInfo.documents')}
      </Text>

      <View style={styles.uploadSection}>
        <View style={styles.uploadInfo}>
          <Image source={AppIcons.infoIcon} style={styles.fileIcon} />
          <Text style={styles.uploadInfoText}>
            Hỗ trợ PDF, DOCX, JPG, PNG (Max: 5MB)
          </Text>
        </View>

        <TouchableOpacity
          style={styles.uploadButton}
          onPress={handleDocumentPick}>
          <Image source={AppIcons.upLoad} style={styles.uploadIcon} />
          <Text style={styles.uploadText}>
            {t('formCreateLoan.financialInfo.uploadDocument')}
          </Text>
        </TouchableOpacity>

        <View style={styles.filesList}>
          {selectedFiles.map((file, index) => (
            <View key={index} style={styles.fileItemContainer}>
              <TouchableOpacity
                style={styles.fileContent}
                onPress={() => handleFilePress(file)}>
                <Image source={AppIcons.infoIcon} style={styles.fileIcon} />
                <Text style={styles.fileName} numberOfLines={1}>
                  {file.name || 'Unknown File'}
                </Text>
                <Text style={styles.fileSize}>
                  {file.size ? formatFileSize(file.size) : '0 B'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleRemoveFile(index)}>
                <Image source={AppIcons.closeIcon} style={styles.removeIcon} />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {showImage && selectedFileUri && (
          <Modal
            visible={showImage}
            transparent={true}
            onRequestClose={() => setShowImage(false)}>
            <View style={styles.modalContainer}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowImage(false)}>
                <Image
                  source={AppIcons.closeIcon}
                  style={styles.closeButtonIcon}
                />
              </TouchableOpacity>
              <View style={styles.modalContent}>
                <ImageDisplay fileUri={selectedFileUri} />
              </View>
            </View>
          </Modal>
        )}
      </View>
    </View>
  );
};

export default DocumentUpload;
