/* eslint-disable curly */
/* eslint-disable react-native/no-inline-styles */
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Switch,
  Platform,
} from 'react-native';
import React, {useState} from 'react';
import BankBottomSheetPicker from '../BankBottomSheetPicker/BankBottomSheetPicker';
import {useTheme} from '../../context/ThemeContext';
import i18n from '../../../i18n';
import {useTranslation} from 'react-i18next';

interface BankNames {
  [key: string]: {
    vi: string;
    en: string;
  };
}

// interface FormData {
//   selectedBank: string;
//   accountNumber: string;
//   receiverName: string;
//   amount: string;
//   content: string;
// }

const FormTransfer: React.FC = () => {
  const currentLanguage: 'vi' | 'en' = i18n.language as 'vi' | 'en';
  const {t} = useTranslation();

  const [selectedBank, setSelectedBank] = useState<string>('');
  const [showPicker, setShowPicker] = useState<boolean>(false);
  const [accountNumber, setAccountNumber] = useState<string>('');
  // const [receiverName, setReceiverName] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [isEnabled, setIsEnabled] = useState<boolean>(false);
  const {theme} = useTheme();

  const toggleSwitch = (): void =>
    setIsEnabled(previousState => !previousState);

  const getBankName = (value: string): string => {
    if (!value)
      return currentLanguage === 'vi' ? 'Chọn ngân hàng' : 'Select bank';

    const banks: BankNames = {
      digi: {vi: 'DigiFund', en: 'DigiFund'},
      vcb: {vi: 'Vietcombank', en: 'Vietcombank'},
      tcb: {vi: 'Techcombank', en: 'Techcombank'},
      tpb: {vi: 'TPBank', en: 'TPBank'},
      bidv: {vi: 'BIDV', en: 'BIDV'},
      agr: {vi: 'Agribank', en: 'Agribank'},
      mb: {vi: 'MBBank', en: 'MBBank'},
      vtb: {vi: 'VietinBank', en: 'VietinBank'},
      acb: {vi: 'ACB', en: 'ACB'},
      vpb: {vi: 'VPBank', en: 'VPBank'},
      scb: {vi: 'SacomBank', en: 'SacomBank'},
      hdb: {vi: 'HDBank', en: 'HDBank'},
      ocb: {vi: 'OCB', en: 'OCB'},
      seab: {vi: 'SeABank', en: 'SeABank'},
    };
    return banks[value]?.[currentLanguage] || value;
  };

  const styles = StyleSheet.create({
    box: {
      marginBottom: 80,
    },
    sourceMoney: {
      backgroundColor: theme.background,
      marginTop: 20,
      marginHorizontal: 20,
      borderRadius: 12,
      padding: 12,
      display: 'flex',
      flexDirection: 'column',
    },
    heading: {
      fontSize: 14,
      fontWeight: 'bold',
      color: theme.text,
    },
    boxWrapMoney: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 12,
    },
    titleMoney: {
      color: theme.noteText,
      fontSize: 12,
    },

    boxTransfer: {
      backgroundColor: theme.background,
      marginTop: 20,
      marginHorizontal: 20,
      borderRadius: 12,
      padding: 12,
      display: 'flex',
      flexDirection: 'column',
    },
    formGroup: {
      marginTop: 12,
    },
    label: {
      fontSize: 12,
      color: theme.text,
      marginBottom: 8,
    },
    bankSelector: {
      borderWidth: 1,
      borderColor: '#aaa',
      borderRadius: 8,
      padding: 12,
      marginBottom: 12,
      backgroundColor: '#fff',
    },
    input: {
      borderWidth: 1,
      borderColor: '#aaa',
      borderRadius: 8,
      padding: 12,
      marginBottom: 12,
      backgroundColor: '#fff',
      color: '#000', // Changed from 'red' to '#000' for consistency
    },
    contentInput: {
      height: 100,
      textAlignVertical: 'top',
    },
    charCount: {
      fontSize: 12,
      color: '#aaa',
      textAlign: 'right',
      marginTop: -8,
      marginBottom: 12,
    },
    wrapToggle: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      // height: 32,  // Adjust this value based on your label height
    },
    labelToggle: {
      fontSize: 12,
      color: theme.text,
    },
    switch: {
      transform:
        Platform.OS === 'ios'
          ? [{scaleX: 0.6}, {scaleY: 0.6}]
          : [{scaleX: 1}, {scaleY: 1}],
    },
  });

  return (
    <View style={styles.box}>
      <View style={styles.sourceMoney}>
        <Text style={styles.heading}>{t('transfer.source')}</Text>
        <View style={styles.boxWrapMoney}>
          <Text style={styles.titleMoney}>{t('transfer.availableCash')}</Text>
          <Text style={styles.heading}>500,000đ</Text>
        </View>
        <View style={styles.boxWrapMoney}>
          <Text style={styles.titleMoney}>{t('transfer.availableLimit')}</Text>
          <Text style={styles.heading}>500,000đ</Text>
        </View>
      </View>

      <View style={styles.boxTransfer}>
        <Text style={styles.heading}>{t('transfer.transferInfo')}</Text>
        <View style={styles.formGroup}>
          <Text style={styles.label}>{t('transfer.receivingBank')}</Text>
          <TouchableOpacity
            style={styles.bankSelector}
            onPress={() => setShowPicker(true)}>
            <Text>{getBankName(selectedBank)}</Text>
          </TouchableOpacity>

          <BankBottomSheetPicker
            visible={showPicker}
            onClose={() => setShowPicker(false)}
            onSelect={setSelectedBank}
            selectedValue={selectedBank}
          />

          <Text style={styles.label}>{t('transfer.accountNumber')}</Text>
          <TextInput
            style={styles.input}
            value={accountNumber}
            onChangeText={setAccountNumber}
            keyboardType="numeric"
            placeholder={t('transfer.accountPlaceholder')}
          />

          {accountNumber.length > 5 && (
            <>
              <Text style={styles.label}>{t('transfer.receiverName')}</Text>
              <TextInput
                style={[styles.input, {color: '#000'}]}
                value={'NGUYEN VAN A'}
                editable={false}
              />
            </>
          )}

          <Text style={styles.label}>{t('transfer.amount')}</Text>
          <TextInput
            style={styles.input}
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            placeholder={t('transfer.amountPlaceholder')}
          />

          <Text style={styles.label}>{t('transfer.content')}</Text>
          <TextInput
            style={[styles.input, styles.contentInput]}
            value={content}
            onChangeText={setContent}
            multiline
            maxLength={160}
            placeholder={t('transfer.contentPlaceholder')}
          />
          <Text style={styles.charCount}>{content.length}/160</Text>
          <View style={styles.wrapToggle}>
            <Text style={styles.labelToggle}>{t('transfer.saveReceiver')}</Text>
            <Switch
              style={styles.switch}
              trackColor={{false: '#E0E0E0', true: '#007BFF'}}
              thumbColor={isEnabled ? '#FFFFFF' : '#FFFFFF'}
              ios_backgroundColor="#E0E0E0"
              onValueChange={toggleSwitch}
              value={isEnabled}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default FormTransfer;
