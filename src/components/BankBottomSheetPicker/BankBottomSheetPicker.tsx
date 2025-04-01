/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  Pressable,
  TextInput,
  ScrollView,
  Dimensions,
  Animated,
  Easing,
} from 'react-native';
import {useTheme} from '../../context/ThemeContext';
import {useTranslation} from 'react-i18next';
// import i18n from '../../../i18n';

interface Bank {
  label: string;
  value: string;
}

interface BankBottomSheetPickerProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (value: string) => void;
  selectedValue: string;
}

interface Theme {
  background: string;
  text: string;
  iconColor: string;
  noteText: string;
  backgroundBox: string;
}

const BankBottomSheetPicker: React.FC<BankBottomSheetPickerProps> = ({
  visible,
  onClose,
  onSelect,
  selectedValue,
}) => {
  // const currentLanguage = i18n.language;
  const {t} = useTranslation();
  const [localVisible, setLocalVisible] = useState<boolean>(visible);
  const [searchText, setSearchText] = useState<string>('');
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const {theme} = useTheme() as {theme: Theme};

  useEffect(() => {
    if (visible) {
      setLocalVisible(true);
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 1,
          duration: 300,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 250,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setLocalVisible(false);
      onClose();
    });
  };

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [Dimensions.get('window').height, 0],
  });

  const banks: Bank[] = [
    {label: 'DigiFund', value: 'digi'},
    {label: 'Vietcombank', value: 'vcb'},
    {label: 'Techcombank', value: 'tcb'},
    {label: 'TPBank', value: 'tpb'},
    {label: 'BIDV', value: 'bidv'},
    {label: 'Agribank', value: 'agr'},
    {label: 'MBBank', value: 'mb'},
    {label: 'VietinBank', value: 'vtb'},
    {label: 'ACB', value: 'acb'},
    {label: 'VPBank', value: 'vpb'},
    {label: 'SacomBank', value: 'scb'},
    {label: 'HDBank', value: 'hdb'},
    {label: 'OCB', value: 'ocb'},
    {label: 'SeABank', value: 'seab'},
  ];

  const filteredBanks = banks.filter(
    bank => bank.label.toLowerCase().includes(searchText.toLowerCase()), // Changed from startsWith to includes for better search
  );

  const styles = StyleSheet.create({
    modalContainer: {
      flex: 1,
      justifyContent: 'flex-end',
    },
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    pressable: {
      flex: 1,
    },
    bottomSheetContainer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: theme.background,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      height: Dimensions.get('window').height * 0.65,
    },
    bottomSheet: {
      flex: 1,
      padding: 20,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    headerText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.text,
    },
    closeButton: {
      fontSize: 20,
      color: theme.iconColor,
    },
    searchInput: {
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 8,
      padding: 10,
      marginBottom: 12,
      backgroundColor: '#f8f8f8',
    },
    bankList: {
      flex: 1,
    },
    noResults: {
      padding: 16,
      alignItems: 'center',
    },
    noResultsText: {
      fontSize: 16,
      color: theme.noteText,
    },
    bankItem: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.noteText,
    },
    selectedItem: {
      backgroundColor: theme.backgroundBox,
    },
    bankItemText: {
      fontSize: 16,
      color: theme.text,
    },
  });

  return (
    <Modal
      visible={localVisible}
      transparent={true}
      animationType="none"
      onRequestClose={handleClose}>
      <View style={styles.modalContainer}>
        <Animated.View
          style={[
            styles.overlay,
            {
              opacity: fadeAnim,
            },
          ]}>
          <Pressable style={styles.pressable} onPress={handleClose} />
        </Animated.View>
        <Animated.View
          style={[
            styles.bottomSheetContainer,
            {
              transform: [{translateY}],
            },
          ]}>
          <View style={styles.bottomSheet}>
            <View style={styles.header}>
              <Text style={styles.headerText}>{t('transfer.selectBank')}</Text>
              <TouchableOpacity onPress={handleClose}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.searchInput}
              placeholder={t('transfer.searchBank')}
              value={searchText}
              keyboardType="default"
              onChangeText={setSearchText}
            />

            <ScrollView style={styles.bankList}>
              {filteredBanks.length > 0 ? (
                filteredBanks.map(bank => (
                  <TouchableOpacity
                    key={bank.value}
                    style={[
                      styles.bankItem,
                      selectedValue === bank.value && styles.selectedItem,
                    ]}
                    onPress={() => {
                      onSelect(bank.value);
                      handleClose();
                    }}>
                    <Text
                      style={[
                        styles.bankItemText,
                        selectedValue === bank.value && styles.bankItemText,
                      ]}>
                      {bank.label}
                    </Text>
                  </TouchableOpacity>
                ))
              ) : (
                <View style={styles.noResults}>
                  <Text style={styles.noResultsText}>
                    {t('transfer.noResults')}
                  </Text>
                </View>
              )}
            </ScrollView>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default BankBottomSheetPicker;
