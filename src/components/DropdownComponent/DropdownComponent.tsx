import {StyleSheet, View, Text} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import React from 'react';
import { useTheme } from '../../context/ThemeContext';

interface DropdownItem {
  value: string | number | undefined;
  label: string;
  rate?: string;
}

interface DropdownComponentProps<T> {
  data: T[];
  placeholder: string;
  value: string | number | undefined;
  onChange: (item: T) => void;
}

const DropdownComponent = <T extends DropdownItem>({
  data,
  placeholder,
  value,
  onChange,
}: DropdownComponentProps<T>) => {
  const {theme} = useTheme(); // Add type assertion here

  const renderItem = (item: T) => {
    return (
      <View style={styles.item}>
        <Text style={styles.textItem}>{item.label}</Text>
      </View>
    );
  };

  const styles = StyleSheet.create({
    textInput: {
      backgroundColor: theme.inputBackground,
      borderRadius: 8,
      height: 40,
      paddingLeft: 15,
      paddingRight: 15,
      paddingTop: 10,
      paddingBottom: 10,
      color: '#000',
      paddingVertical: 0,
      textAlignVertical: 'center',
      borderWidth: 1,
      borderColor: theme.borderInputBackground,
    },

    placeholderStyle: {
      color: '#aaa',
      fontSize: 14,
    },

    selectedTextStyle: {
      color: '#000',
      fontSize: 14,
    },

    item: {
      padding: 17,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderRadius: 999,
    },
    textItem: {
      flex: 1,
      fontSize: 14,
    },

    iconStyle: {
      width: 20,
      height: 20,
      tintColor: '#000',
    },

    dropDownContainer: {
      backgroundColor: '#fff',
      borderRadius: 8,
    },
  });

  return (
    <Dropdown
      style={styles.textInput}
      selectedTextStyle={styles.selectedTextStyle}
      placeholderStyle={styles.placeholderStyle}
      iconStyle={styles.iconStyle}
      containerStyle={styles.dropDownContainer} // Changed from dropDownContainerStyle
      activeColor="#e3f0ff"
      maxHeight={200}
      value={value}
      data={data}
      valueField="value"
      labelField="label"
      placeholder={placeholder}
      searchPlaceholder="Search..."
      onChange={onChange}
      renderItem={renderItem}
    />
  );
};

export default DropdownComponent;
