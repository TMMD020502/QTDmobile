import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ImageSourcePropType,
} from 'react-native';
import React from 'react';
import {useTheme} from '../../context/ThemeContext';

interface ButtonSettingProps {
  title: string;
  icon: ImageSourcePropType;
  onPress?: () => void;
  optionText?: string;
}

interface Theme {
  background: string;
  backgroundBox: string;
  text: string;
  noteText: string;
  iconColor: string;
}

const ButtonSetting: React.FC<ButtonSettingProps> = ({
  title,
  icon,
  onPress,
  optionText,
}) => {
  const {theme} = useTheme() as {theme: Theme};

  const styles = StyleSheet.create({
    wrapButton: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: 22,
      paddingBottom: 10,
      borderBottomWidth: 1,
      borderBottomColor: theme.backgroundBox,
      backgroundColor: theme.background,
    },
    textButton: {
      fontSize: 15,
      color: theme.text,
    },
    wrapText: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    wrapIcon: {
      justifyContent: 'center',
      alignItems: 'center',
      width: 24,
      height: 24,
      marginLeft: 16,
    },
    textOption: {
      fontSize: 14,
      color: theme.noteText,
    },
    iconStyle: {
      width: 16,
      height: 16,
      tintColor: theme.iconColor,
    },
  });

  return (
    <TouchableOpacity style={styles.wrapButton} onPress={onPress}>
      <Text style={styles.textButton}>{title}</Text>
      <View style={styles.wrapText}>
        {optionText && <Text style={styles.textOption}>{optionText}</Text>}
        <View style={styles.wrapIcon}>
          <Image source={icon} style={styles.iconStyle} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ButtonSetting;
