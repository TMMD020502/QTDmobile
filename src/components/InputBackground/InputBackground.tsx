import {StyleSheet, TextInput, TextInputProps, View} from 'react-native';
import React, {forwardRef} from 'react';
import {useTheme} from '../../context/ThemeContext';

interface InputBackgroundProps extends TextInputProps {
  // Any additional props specific to InputBackground
}

// Define with forwardRef and proper type annotations
const InputBackground = forwardRef<TextInput, InputBackgroundProps>(
  (
    {
      value,
      onChangeText,
      placeholder,
      keyboardType = 'default',
      style,
      ...props
    },
    ref,
  ) => {
    // Convert undefined/null to empty string to avoid uncontrolled input warning
    const inputValue = value ?? '';
    const {theme} = useTheme();

    const styles = StyleSheet.create({
      container: {
        backgroundColor: theme.inputBackground,
        borderRadius: 8,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: theme.borderInputBackground,
      },
      input: {
        height: 40,
        paddingHorizontal: 15,
        fontSize: 14,
        color: '#000',
        width: '100%',
      },
    });

    return (
      <View style={styles.container}>
        <TextInput
          placeholder={placeholder}
          placeholderTextColor="#999"
          onChangeText={onChangeText}
          value={inputValue}
          style={[styles.input, style]}
          keyboardType={keyboardType}
          autoCapitalize="none"
          autoCorrect={false}
          ref={ref}
          {...props}
        />
      </View>
    );
  },
);

// Add displayName to help with debugging
InputBackground.displayName = 'InputBackground';

export default InputBackground;
