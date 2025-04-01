import React from 'react';
import {View, Text, TouchableOpacity, Platform, Modal} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Theme} from '../../theme/colors';
import {createStyles} from '../FormAssetCollateral/styles';

interface DatePickerProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: (date: string) => void;
  value: Date;
  onChange: (date: Date) => void;
  theme: Theme;
  minimumDate?: Date;
  locale?: string;
}

const DatePicker: React.FC<DatePickerProps> = ({
  isVisible,
  onClose,
  onConfirm,
  value,
  onChange,
  theme,
  minimumDate,
  locale = 'vi-VN',
}) => {
  const styles = createStyles(theme);

  if (Platform.OS === 'ios') {
    return (
      <Modal
        visible={isVisible}
        transparent
        animationType="fade"
        onRequestClose={onClose}>
        <View style={styles.datePickerOverlay}>
          <TouchableOpacity
            style={styles.datePickerBackdrop}
            activeOpacity={1}
            onPress={onClose}>
            <View style={styles.datePickerContainer}>
              <View style={styles.datePickerWrapper}>
                <DateTimePicker
                  value={value}
                  mode="date"
                  display="spinner"
                  onChange={(_, date) => {
                    if (date) onChange(date);
                  }}
                  minimumDate={minimumDate}
                  locale={locale}
                  textColor={theme.text}
                />
              </View>
              <View style={styles.datePickerButtons}>
                <TouchableOpacity
                  style={styles.datePickerButton}
                  onPress={onClose}>
                  <Text
                    style={[styles.datePickerButtonText, {color: theme.text}]}>
                    Huỷ
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.datePickerButton}
                  onPress={() => {
                    const formattedDate = value.toISOString().split('T')[0];
                    onConfirm(formattedDate);
                  }}>
                  <Text
                    style={[styles.datePickerButtonText, {color: theme.text}]}>
                    Xác nhận
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }

  if (!isVisible) return null;

  return (
    <DateTimePicker
      value={value}
      mode="date"
      is24Hour={true}
      display="spinner"
      onChange={(event, date) => {
        if (event.type === 'set' && date) {
          const formattedDate = date.toISOString().split('T')[0];
          onConfirm(formattedDate);
        }
        onClose();
      }}
      minimumDate={minimumDate}
      locale={locale}
    />
  );
};

export default DatePicker;
