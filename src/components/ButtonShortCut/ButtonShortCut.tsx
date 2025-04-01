import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ImageSourcePropType,
  ImageStyle,
} from 'react-native';
import React from 'react';
import {Theme} from '../../theme/colors';

interface ButtonShortCutProps {
  name: string;
  urlIcon: ImageSourcePropType;
  styleCustom?: ImageStyle;
  onPress: () => void;
  theme: Theme;
}

const ButtonShortCut: React.FC<ButtonShortCutProps> = ({
  name,
  urlIcon,
  styleCustom,
  onPress,
  theme,
}) => {
  const styles = StyleSheet.create({
    wrapButton: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      width: '20%',
    },
    borderButton: {
      width: 54,
      height: 54,
      borderRadius: 9999,
      backgroundColor: theme.iconShortCut,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 8,
    },
    textButton: {
      textAlign: 'center',
    },
    styleIcon: {
      width: 24,
      height: 24,
      resizeMode: 'contain',
      tintColor: theme.iconPrimaryColor,
    },
  });

  return (
    <View style={styles.wrapButton}>
      <TouchableOpacity style={[styles.borderButton]} onPress={onPress}>
        <Image style={[styles.styleIcon, styleCustom]} source={urlIcon} />
      </TouchableOpacity>
      <Text style={[styles.textButton, {color: theme.text}]}>{name}</Text>
    </View>
  );
};

export default ButtonShortCut;
