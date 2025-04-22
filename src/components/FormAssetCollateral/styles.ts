import {StyleSheet} from 'react-native';
import {Theme} from '../../theme/colors';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingBottom: 8,
    },
    section: {
      marginBottom: 8,
      backgroundColor: theme.backgroundBox,
      borderRadius: 8,
      padding: 6,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 10,
      color: theme.text,
      borderLeftWidth: 3,
      borderLeftColor: theme.buttonSubmit,
      paddingLeft: 8,
    },
    gridItem: {
      width: '50%',
      marginBottom: 6,
      paddingHorizontal: 2,
      minHeight: 60,
    },
    gridItemnumberLarge: {
      width: '60%',
      marginBottom: 6,
      paddingHorizontal: 2,
      minHeight: 60,
    },
    gridItemnumberSmall: {
      width: '40%', // Thu nhỏ lại cho ngày sinh và ngày cấp
      marginBottom: 6,
      paddingHorizontal: 2,
      minHeight: 40,
    },
    gridContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      marginHorizontal: -4, // Bù trừ padding của gridItem
      alignItems: 'flex-start',
    },
    gridItemDateSmall: {
      width: '30%', // Thu nhỏ lại cho ngày sinh và ngày cấp
      marginBottom: 6,
      paddingHorizontal: 2,
      minHeight: 55,
    },
    gridItemDateLarge: {
      width: '70%', // Mở rộng ra cho CMND/CCCD và nơi cấp
      marginBottom: 8,
      paddingHorizontal: 2,
      minHeight: 60,
    },
    gridItemDateLargecn: {
      width: '70%', // Mở rộng ra cho CMND/CCCD và nơi cấp
      marginBottom: 12,
      paddingHorizontal: 2,
      minHeight: 60,
    },
    fieldContainer: {
      marginBottom: 16,
    },
    label: {
      fontSize: 13,
      //marginBottom: 0,
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
      padding: 4, // Giảm padding
      height: 38, // Thêm chiều cao cố định
      borderRadius: 6,
      backgroundColor: theme.inputBackground,
      borderWidth: 1,
      borderColor: theme.borderInputBackground,
      justifyContent: 'center', // Căn giữa nội dung theo chiều dọc
    },
    dateInputText: {
      fontSize: 13,
      lineHeight: 16, // Thêm line-height để căn chỉnh text
      color: '#000',
    },
    dateInputPlaceholder: {
      fontSize: 13,
      lineHeight: 16, // Thêm line-height để căn chỉnh text
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
    //{/* Chỗ đậu xe */}
    gridItemMetadataLarge1: {
      width: '30%',
      marginBottom: 8,
      paddingHorizontal: 2,
      // minHeight: 45,
    },
    gridItemMetadataLarge: {
      width: '55%',
      marginBottom: 8,
      paddingHorizontal: 2,
      // minHeight: 45,
    },
    gridItemMetadataSmall: {
      width: '15%',
      marginBottom: 8,
      paddingHorizontal: 2,
      // minHeight: 15,
    },
    gridItemDateLargeWithOffset: {
      width: '70%',
      marginBottom: 8,
      marginTop: 4, // Thêm offset
      paddingHorizontal: 2,
      minHeight: 60,
      paddingTop: 15,
    },
    boxInput: {
      marginBottom: 12,
    },
    headingTitle: {
      fontWeight: 'bold',
      marginBottom: 8,
      color: theme.text,
    },
    uploadSection: {
      // backgroundColor: theme.buttonSubmit,
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
      // backgroundColor: theme.buttonSubmit,
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
      backgroundColor: theme.backgroundBox || '#f5f5f5',
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
    closeButton: {
      position: 'absolute', // Đặt vị trí tuyệt đối
      top: 10, // Cách mép trên 10px
      right: 10, // Cách mép phải 10px
      backgroundColor: 'rgba(255, 68, 68, 0.8)', // Nền đỏ mờ
      padding: 8, // Đệm bên trong nút
      borderRadius: 20, // Bo tròn nút
      zIndex: 10, // Đảm bảo nút nằm trên hình ảnh
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.8)', // Nền mờ
    },
    modalContent: {
      position: 'absolute', // Đặt vị trí tuyệt đối
      top: '10%', // Đẩy nội dung lên cao hơn (10% từ trên màn hình)
      backgroundColor: 'transparent', // Làm nền trong suốt
      alignItems: 'center',
      justifyContent: 'center',
      width: '90%', // Chiều rộng 90% màn hình
      maxHeight: '80%', // Chiều cao tối đa 80% màn hình
    },
    closeButtonIcon: {
      width: 16, // Kích thước icon
      height: 16,
      tintColor: 'white', // Màu icon
    },
  });
