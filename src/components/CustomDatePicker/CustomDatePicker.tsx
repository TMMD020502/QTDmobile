import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTranslation } from 'react-i18next';
import { Theme } from '../../theme/colors';


interface CustomDatePickerProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: (date: Date) => void;
  selectedDate: Date | null;
  minimumDate?: Date;
  theme: Theme;
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  isVisible,
  onClose,
  onConfirm,
  selectedDate,
  minimumDate,
  theme,
}) => {
  const { t, i18n } = useTranslation();
  const [tempDate, setTempDate] = useState<Date>(selectedDate || new Date());

  if (!isVisible) return null;

  const handleChange = (event: any, date?: Date) => {
    if (Platform.OS === 'android') {
      onClose();
      if (event.type === 'set' && date) {
        onConfirm(date);
      }
    } else if (date) {
      setTempDate(date);
    }
  };

  const handleConfirm = () => {
    onConfirm(tempDate);
    onClose();
  };

  return (
    <>
      {Platform.OS === 'ios' ? (
        <View style={styles.datePickerOverlay}>
          <View style={styles.datePickerContainer}>
            <View style={styles.datePickerWrapper}>
              <DateTimePicker
                value={tempDate}
                mode="date"
                display="spinner"
                onChange={(event, date) => date && setTempDate(date)}
                minimumDate={minimumDate}
                locale={i18n.language === 'vi' ? 'vi-VN' : 'en-US'}
                textColor="black"
              />
            </View>
            <View style={styles.datePickerButtons}>
              <TouchableOpacity
                style={styles.datePickerButton}
                onPress={onClose}>
                <Text style={[styles.datePickerButtonText, { color: theme.buttonSubmit }]}>
                  {t('register.resultScreen.datePicker.cancel')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.datePickerButton}
                onPress={handleConfirm}>
                <Text style={[styles.datePickerButtonText, { color: theme.buttonSubmit }]}>
                  {t('register.resultScreen.datePicker.confirm')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ) : (
        <DateTimePicker
          value={tempDate}
          mode="date"
          is24Hour={true}
          display="spinner"
          onChange={handleChange}
          minimumDate={minimumDate}
          locale={i18n.language === 'vi' ? 'vi-VN' : 'en-US'}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  datePickerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  datePickerContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    height: Platform.OS === 'ios' ? 260 : 'auto',
    padding: 20,
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  datePickerWrapper: {
    height: 200,
    justifyContent: 'center',
  },
  datePickerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
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
});

export default CustomDatePicker;
