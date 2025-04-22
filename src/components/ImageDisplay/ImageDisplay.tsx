import React, {useEffect, useState} from 'react';
import {Image, View, Text, Dimensions, StyleSheet} from 'react-native';
import {fetchImage} from '../../api/services/uploadImage'; // Đường dẫn tới hàm fetchImage

const ImageDisplay = ({fileUri}: {fileUri: string}) => {
  const [imageBase64, setImageBase64] = useState<string | null>(null);

  // Lấy kích thước màn hình
  const {width, height} = Dimensions.get('window');

  useEffect(() => {
    const loadImage = async () => {
      try {
        const base64 = await fetchImage(fileUri);
        setImageBase64(base64);
      } catch (error) {
        console.error('Failed to load image:', error);
      }
    };

    loadImage();
  }, [fileUri]);

  return (
    <View style={styles.container}>
      {imageBase64 ? (
        <Image
          source={{uri: imageBase64}}
          style={[styles.image, {width: width * 0.9, height: height * 0.8}]}
          resizeMode="contain"
        />
      ) : (
        <Text style={styles.loadingText}>Loading image...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  image: {
    borderRadius: 8, // Bo góc hình ảnh
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
});

export default ImageDisplay;
