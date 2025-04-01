import {StyleSheet} from 'react-native';
import {Theme} from '../../theme/colors';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingBottom: 20,
    },
    section: {
      marginBottom: 24,
      backgroundColor: theme.backgroundBox,
      borderRadius: 12,
      padding: 16,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 16,
      color: theme.text,
      borderLeftWidth: 3,
      borderLeftColor: theme.buttonSubmit,
      paddingLeft: 8,
    },
    fieldContainer: {
      marginBottom: 16,
    },
    label: {
      fontSize: 14,
      marginBottom: 8,
      color: theme.text,
      fontWeight: '500',
    },
    submitButton: {
      backgroundColor: theme.buttonSubmit,
      padding: 16,
      borderRadius: 12,
      alignItems: 'center',
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
    },
    dateInput: {
      padding: 12,
      borderRadius: 8,
      marginTop: 4,
      backgroundColor: theme.inputBackground,
      borderWidth: 1,
      borderColor: theme.borderInputBackground,
    },
    dateInputText: {
      fontSize: 14,
      fontWeight: '400',
      color: '#000',
    },
    dateInputPlaceholder: {
      fontSize: 14,
      fontWeight: '400',
      color: '#999',
    },
    datePickerOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999, // Ensure overlay is on top
    },
    datePickerContainer: {
      backgroundColor: theme.backgroundBox,
      borderRadius: 12,
      padding: 20,
      width: '90%',
    },
    datePickerWrapper: {
      height: 200,
      justifyContent: 'center',
    },
    datePickerButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 20,
    },
    datePickerButton: {
      padding: 10,
      minWidth: 100,
      alignItems: 'center',
    },
    datePickerButtonText: {
      fontSize: 16,
      fontWeight: '500',
    },
    wrapper: {
      flex: 1,
      position: 'relative',
    },
  });
