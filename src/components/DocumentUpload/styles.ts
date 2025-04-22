import {StyleSheet} from 'react-native';
import {Theme} from '../../theme/colors';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    boxInput: {
      marginBottom: 12,
    },
    headingTitle: {
      fontWeight: 'bold',
      marginBottom: 8,
      color: theme.text,
    },
    uploadSection: {
      borderRadius: 12,
      paddingVertical: 12,
    },
    uploadInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    fileIcon: {
      marginRight: 4,
      width: 16,
      height: 16,
      tintColor: theme.noteText || '#666',
    },
    uploadInfoText: {
      color: theme.noteText || '#666',
      fontSize: 12,
      marginLeft: 4,
    },
    uploadButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 12,
      borderRadius: 8,
      borderWidth: 1,
      borderStyle: 'dashed',
      borderColor: theme.borderInputBackground,
    },
    uploadIcon: {
      marginRight: 8,
      width: 24,
      height: 24,
      tintColor: theme.borderInputBackground,
    },
    uploadText: {
      color: theme.borderInputBackground,
      fontSize: 14,
      fontWeight: '600',
    },
    filesList: {
      marginTop: 8,
    },
    fileItemContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.backgroundBox,
      padding: 12,
      borderRadius: 8,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: 'rgba(0,0,0,0.1)',
    },
    fileContent: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
    },
    fileName: {
      flex: 1,
      color: theme.text,
      fontSize: 14,
    },
    fileSize: {
      color: theme.noteText || '#666',
      fontSize: 12,
      marginLeft: 8,
    },
    removeButton: {
      padding: 2,
      borderRadius: 12,
      backgroundColor: theme.error || '#ff4444',
      marginLeft: 8,
    },
    removeIcon: {
      width: 16,
      height: 16,
      tintColor: 'white',
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
    },
    modalContent: {
      position: 'absolute',
      top: '10%',
      backgroundColor: 'transparent',
      alignItems: 'center',
      justifyContent: 'center',
      width: '90%',
      maxHeight: '80%',
    },
    closeButton: {
      position: 'absolute',
      top: 10,
      right: 10,
      backgroundColor: 'rgba(255, 68, 68, 0.8)',
      padding: 8,
      borderRadius: 20,
      zIndex: 10,
    },
    closeButtonIcon: {
      width: 16,
      height: 16,
      tintColor: 'white',
    },
  });
