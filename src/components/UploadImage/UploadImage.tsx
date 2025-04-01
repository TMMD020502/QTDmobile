import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {useTranslation} from 'react-i18next';
import { Asset } from 'react-native-image-picker';

interface ImageResponse extends Asset {
  uri: string;
}

interface UploadImageProps {
  title: string;
  theme: {
    noteText: string;
    text: string;
  };
  typeImage: ImageResponse | null;
  onSelectImage: () => void;
  touched?: boolean;
  errors?: string;
}

const UploadImage: React.FC<UploadImageProps> = ({
  title,
  theme,
  typeImage,
  onSelectImage,
  touched,
  errors,
}) => {
  const {t} = useTranslation();

  const styles = StyleSheet.create({
    errorText: {
      color: 'red',
      marginTop: 12,
      textAlign: 'center',
    },
    imagePickerContainer: {
      marginBottom: 20,
    },
    imagePickerLabel: {
      fontSize: 14,
      marginBottom: 8,
      color: theme.noteText,
    },
    imagePickerButton: {
      borderWidth: 1,
      borderColor: theme.noteText,
      borderRadius: 8,
      padding: 12,
      alignItems: 'center',
    },
    selectedImage: {
      width: '100%',
      height: 200,
      marginTop: 8,
      borderRadius: 8,
    },
  });

  return (
    <View style={styles.imagePickerContainer}>
      <Text style={styles.imagePickerLabel}>
        {title} {t('register.resultScreen.imageSize')}
      </Text>
      <TouchableOpacity
        style={styles.imagePickerButton}
        onPress={onSelectImage}>
        <Text style={{color: theme.text}}>
          {typeImage
            ? t('register.resultScreen.changeImage')
            : t('register.resultScreen.selectImage')}
        </Text>
      </TouchableOpacity>
      {typeImage && (
        <Image
          source={{uri: typeImage.uri}}
          style={styles.selectedImage}
          resizeMode="cover"
        />
      )}
      {touched && errors && <Text style={styles.errorText}>{errors}</Text>}
    </View>
  );
};

export default UploadImage;
