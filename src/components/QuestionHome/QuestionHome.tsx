import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageSourcePropType,
  TouchableOpacity,
} from 'react-native';
import React from 'react';

interface Theme {
  backgroundBox: string;
  iconColor: string;
  text: string;
}

interface QuestionHomeProps {
  question: string;
  urlIcon: ImageSourcePropType;
  theme: Theme;
  onPress?: () => void;
  data?: any; // Data to pass to the Questions screen
}

const QuestionHome: React.FC<QuestionHomeProps> = ({
  question,
  urlIcon,
  theme,
  onPress,
}) => {
  const styles = StyleSheet.create({
    boxContent: {
      width: '48%',
      paddingHorizontal: 12,
      paddingVertical: 20,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8, // Reduced gap between icon and text
      borderRadius: 16,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.08,
      shadowRadius: 5,
      elevation: 4,
    },
    iconContainer: {
      width: 36, // Slightly smaller to reduce space usage
      height: 36, // Slightly smaller to reduce space usage
      borderRadius: 10,
      backgroundColor: `${theme.iconColor}15`,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: -2, // Negative margin to pull closer to text
    },
    textQuestion: {
      flexGrow: 1,
      fontSize: 13,
      fontWeight: '500',
      flexShrink: 1,
      lineHeight: 18,
      paddingLeft: 2, // Add a bit of padding on the left of text
    },
    iconStyle: {
      tintColor: theme.iconColor,
      width: 18, // Slightly smaller icon
      height: 18, // Slightly smaller icon
    },
  });

  return (
    <TouchableOpacity
      style={[styles.boxContent, {backgroundColor: theme.backgroundBox}]}
      onPress={onPress}
      activeOpacity={0.7}>
      <View style={styles.iconContainer}>
        <Image style={styles.iconStyle} source={urlIcon} />
      </View>
      <Text
        style={[styles.textQuestion, {color: theme.text}]}
        numberOfLines={2}>
        {question}
      </Text>
    </TouchableOpacity>
  );
};

export default QuestionHome;
