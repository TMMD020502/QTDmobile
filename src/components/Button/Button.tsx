import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import {useTheme} from '../../context/ThemeContext';

interface ButtonProps {
  text: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
}

const Button: React.FC<ButtonProps> = ({
  text,
  onPress,
  style,
  textStyle,
  disabled = false,
  loading = false,
  variant = 'primary',
  size = 'medium',
}) => {
  const {theme} = useTheme();

  // Define styles based on variant
  const getVariantStyle = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: theme.buttonSubmit,
          borderColor: theme.buttonSubmit,
          borderWidth: 1,
        };
      case 'secondary':
        return {
          backgroundColor: theme.backgroundBox,
          borderColor: theme.tableBorderColor,
          borderWidth: 1,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderColor: theme.buttonSubmit,
          borderWidth: 1,
        };
      default:
        return {
          backgroundColor: theme.buttonSubmit,
          borderColor: theme.buttonSubmit,
          borderWidth: 1,
        };
    }
  };

  // Define text color based on variant
  const getTextColor = () => {
    switch (variant) {
      case 'primary':
        return theme.textButtonSubmit;
      case 'secondary':
        return theme.text;
      case 'outline':
        return theme.buttonSubmit;
      default:
        return theme.textButtonSubmit;
    }
  };

  // Define size-based padding
  const getSizePadding = () => {
    switch (size) {
      case 'small':
        return {paddingVertical: 8, paddingHorizontal: 12};
      case 'medium':
        return {paddingVertical: 12, paddingHorizontal: 16};
      case 'large':
        return {paddingVertical: 16, paddingHorizontal: 20};
      default:
        return {paddingVertical: 12, paddingHorizontal: 16};
    }
  };

  // Define text size based on button size
  const getTextSize = () => {
    switch (size) {
      case 'small':
        return 14;
      case 'medium':
        return 16;
      case 'large':
        return 18;
      default:
        return 16;
    }
  };

  const styles = StyleSheet.create({
    button: {
      ...getVariantStyle(),
      ...getSizePadding(),
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      opacity: disabled ? 0.6 : 1,
    },
    text: {
      color: getTextColor(),
      fontWeight: '600',
      fontSize: getTextSize(),
      letterSpacing: 0.3,
    },
    loadingIndicator: {
      marginRight: 8,
    },
  });

  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}>
      {loading && (
        <ActivityIndicator
          size="small"
          color={getTextColor()}
          style={styles.loadingIndicator}
        />
      )}
      <Text style={[styles.text, textStyle]}>{text}</Text>
    </TouchableOpacity>
  );
};

export default Button;
