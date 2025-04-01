import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

interface Theme {
  backgroundBox: string;
  text: string;
}

interface ProductHomeProps {
  header: string;
  desc: string;
  theme: Theme;
}

const ProductHome: React.FC<ProductHomeProps> = ({header, desc, theme}) => {
  return (
    <View style={[styles.boxProduct, {backgroundColor: theme.backgroundBox}]}>
      <Text style={[styles.headerProduct, {color: theme.text}]}>{header}</Text>
      <Text style={[styles.descriptionProduct, {color: theme.text}]}>
        {desc}
      </Text>
    </View>
  );
};

export default ProductHome;

const styles = StyleSheet.create({
  boxProduct: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    backgroundColor: '#f4f4f4',
    shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 4,
  },
  headerProduct: {
    fontWeight: 'bold',
  },
  descriptionProduct: {
    lineHeight: 22,
  },
});
