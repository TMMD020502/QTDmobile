import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import InputBackground from '../InputBackground/InputBackground';
import {ownerInfoFields} from './formFields';

interface OwnerInfoFieldsProps {
  ownerInfo: any;
  onChangeField: (field: string, value: any) => void;
  onDatePress: () => void;
  formatDate: (date: string) => string;
  styles: any;
}

const OwnerInfoFields: React.FC<OwnerInfoFieldsProps> = ({
  ownerInfo,
  onChangeField,
  onDatePress,
  formatDate,
  styles,
}) => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Thông tin chủ sở hữu</Text>
      {ownerInfoFields.map(({field, label, placeholder, isDate}) => (
        <View key={field} style={styles.fieldContainer}>
          <Text style={styles.label}>{label}</Text>
          {isDate ? (
            <TouchableOpacity style={styles.dateInput} onPress={onDatePress}>
              <Text
                style={
                  ownerInfo.dayOfBirth
                    ? styles.dateText
                    : styles.datePlaceholder
                }>
                {ownerInfo.dayOfBirth
                  ? formatDate(ownerInfo.dayOfBirth)
                  : placeholder}
              </Text>
            </TouchableOpacity>
          ) : (
            <InputBackground
              value={ownerInfo[field]}
              onChangeText={value => onChangeField(field, value)}
              placeholder={placeholder}
            />
          )}
        </View>
      ))}
    </View>
  );
};

export default OwnerInfoFields;
