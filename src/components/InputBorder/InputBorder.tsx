import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {AppIcons} from '../../icons';

interface InputBorderProps {
  name: string;
  iconSource: any; // Update this if you have a more specific type for icons
  placeholder: string;
  onSetValue: (value: string) => void;
  value: string;
  theme: {
    inputBackground: string;
    noteText: string;
    iconColor: string;
    text: string;
  };
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  secureVisible?: boolean;
  onPressIcon?: () => void;
  touchEyes?: boolean;
  editable?: boolean;
  textContentType?: string;
  onPress?: () => void;
  pointerEvents?: 'auto' | 'none' | 'box-none' | 'box-only' | undefined;
  notChange?: boolean;
  error?: string | boolean | undefined;
}

const InputBorder: React.FC<InputBorderProps> = ({
  name,
  iconSource,
  placeholder,
  onSetValue,
  value,
  theme,
  keyboardType,
  secureVisible,
  onPressIcon,
  touchEyes,
  onPress,
  pointerEvents,
  notChange,
  error,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const styles = StyleSheet.create({
    heading: {
      fontSize: 14,
      marginBottom: 10,
      color: theme.text,
      fontWeight: '500',
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.inputBackground,
      borderRadius: 14,
      borderWidth: 1.5,
      borderColor: isFocused ? '#0066ff' : '#e0e0e0',
      paddingHorizontal: 14,
      paddingVertical: Platform.OS === 'ios' ? 14 : 10,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.06,
      shadowRadius: 6,
      elevation: 2,
    },
    icon: {
      marginRight: 10,
      width: 22,
      height: 22,
      tintColor: '#5e5c5c',
    },
    textInput: {
      flex: 1,
      fontSize: 16,
      color: notChange ? theme.noteText : theme.text,
      fontFamily: 'Roboto',
      paddingVertical: 0,
      backgroundColor: 'transparent',
    },
    iconEyes: {
      marginLeft: 8,
      width: 24,
      height: 24,
      //tintColor: theme.iconColor,
    },
    errorText: {
      color: 'red',
      fontSize: 12,
      marginTop: 4,
      marginLeft: 6,
    },
  });

  // For touchable inputs (like date fields)
  if (onPress) {
    return (
      <View style={{marginBottom: 20}}>
        <Text style={styles.heading}>{name}</Text>
        <TouchableOpacity
          onPress={onPress}
          activeOpacity={0.7}
          style={[
            styles.inputContainer,
            {backgroundColor: theme.inputBackground},
          ]}>
          <Image source={iconSource} style={styles.icon} />
          <TextInput
            placeholder={placeholder}
            placeholderTextColor={theme.noteText}
            value={value}
            style={styles.textInput}
            editable={false}
            pointerEvents="none"
            autoCapitalize="none"
          />
        </TouchableOpacity>
        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
    );
  }

  // For regular, non-touchable inputs
  return (
    <View style={{marginBottom: 20}}>
      <Text style={styles.heading}>{name}</Text>
      <View
        style={[
          styles.inputContainer,
          {backgroundColor: theme.inputBackground},
        ]}>
        <Image source={iconSource} style={styles.icon} />
        <TextInput
          placeholder={placeholder}
          placeholderTextColor={theme.noteText}
          keyboardType={keyboardType}
          onChangeText={onSetValue}
          secureTextEntry={secureVisible}
          value={value}
          style={styles.textInput}
          autoCapitalize="none"
          editable={!notChange}
          pointerEvents={pointerEvents}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        {touchEyes && (
          <TouchableOpacity onPress={onPressIcon}>
            <Image
              source={secureVisible ? AppIcons.eyesOpen : AppIcons.eyesClose}
              style={styles.iconEyes}
            />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

export default InputBorder;
