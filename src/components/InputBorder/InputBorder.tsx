import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Platform,
} from 'react-native';
import React from 'react';
import {AppIcons} from '../../icons';

interface InputBorderProps {
  name: string;
  iconSource: any; // Update this if you have a more specific type for icons
  placeholder: string;
  onSetValue: (value: string) => void;
  value: string;
  theme: {
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
  // Create a dedicated press handler for touchable fields
  const handlePress = () => {
    if (onPress) {
      onPress();
    }
  };

  const styles = StyleSheet.create({
    heading: {
      fontSize: 14,
      marginBottom: 16,
      color: theme.noteText,
    },
    icon: {
      position: 'absolute',
      left: 0,
      top: 0,
      tintColor: theme.iconColor,
      width: 24,
      height: 24,
    },
    iconPosition: {
      position: 'absolute',
      right: 0,
    },
    textInput: {
      borderBottomColor: theme.noteText,
      borderBottomWidth: 1,
      height: 32,
      paddingLeft: 40,
      paddingRight: 30,
      paddingBottom: 10,
      color: notChange ? theme.noteText : theme.text,
      paddingVertical: 0,
      textAlignVertical: 'center',
    },
    inputContainer: {
      position: 'relative',
    },
    touchableContainer: {
      width: '100%',
    },
    errorText: {
      color: 'red',
      fontSize: 12,
      marginTop: 4,
    },
    iconEyes: {
      bottom: Platform.OS === 'ios' ? 4 : 4,
      paddingVertical: 0,
      tintColor: theme.iconColor,
      width: 24,
      height: 24,
    },
  });

  // For touchable inputs (like date fields), return a completely different component structure
  if (onPress) {
    return (
      <View style={{marginBottom: 20}}>
        <Text style={styles.heading}>{name}</Text>
        <View style={styles.inputContainer}>
          <Image source={iconSource} style={styles.icon} />

          {/* Wrap the entire input area with TouchableOpacity */}
          <TouchableOpacity
            onPress={handlePress}
            activeOpacity={0.7}
            style={styles.touchableContainer}>
            {/* Explicitly make TextInput non-interactive for Android */}
            <TextInput
              placeholder={placeholder}
              placeholderTextColor={theme.noteText}
              value={value}
              style={styles.textInput}
              editable={false} // Force non-editable for touchable fields
              pointerEvents="none"
              autoCapitalize="none"
            />
          </TouchableOpacity>

          {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
      </View>
    );
  }

  // For regular, non-touchable inputs
  return (
    <View style={{marginBottom: 20}}>
      <Text style={styles.heading}>{name}</Text>
      <View style={styles.inputContainer}>
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
        />
        {touchEyes && (
          <TouchableOpacity style={styles.iconPosition} onPress={onPressIcon}>
            {secureVisible ? (
              <Image source={AppIcons.eyesOpen} style={styles.iconEyes} />
            ) : (
              <Image style={styles.iconEyes} source={AppIcons.eyesClose} />
            )}
          </TouchableOpacity>
        )}
        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
    </View>
  );
};

export default InputBorder;
