/* eslint-disable react/no-unstable-nested-components */
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Alert,
  Image,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import i18n from '../../../i18n';
import {AppIcons} from '../../icons';
import {Theme} from '../../theme/colors';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

interface FormDepositProps {
  theme: Theme;
}

interface BankFieldProps {
  label: string;
  value: string;
  icon?: boolean;
}

interface BankInfo {
  accountNumber: BankFieldProps;
  accountName: BankFieldProps;
  branch: BankFieldProps;
  desc: BankFieldProps;
}

interface BankInfoMap {
  [key: string]: BankInfo;
}

type ActiveSectionType = 'qr' | 'bank' | null;
type BankType = 'TPBank' | 'BIDV';

const FormDeposit: React.FC<FormDepositProps> = ({theme}) => {
  const currentLanguage = i18n.language;
  const {t} = useTranslation();
  const [selectedBank, setSelectedBank] = useState<BankType>('TPBank');
  const [activeSection, setActiveSection] = useState<ActiveSectionType>('qr');

  const toggleQRContent = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setActiveSection(activeSection === 'qr' ? null : 'qr');
  };

  const toggleBankContent = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setActiveSection(activeSection === 'bank' ? null : 'bank');
  };

  const bankInfo: BankInfoMap = {
    TPBank: {
      accountNumber: {
        label: t('deposit.accountFields.accountNumber'),
        value: '888888888888',
        icon: true,
      },
      accountName: {
        label: t('deposit.accountFields.accountName'),
        value: 'Pham Minh Quang',
      },
      branch: {
        label: t('deposit.accountFields.branch'),
        value: 'TPBank Saigon',
      },
      desc: {
        label: t('deposit.accountFields.content'),
        value: 'Pham Minh Quang 99MC9999',
        icon: true,
      },
    },
    BIDV: {
      accountNumber: {
        label: t('deposit.accountFields.accountNumber'),
        value: '888888888888',
        icon: true,
      },
      accountName: {
        label: t('deposit.accountFields.accountName'),
        value: 'Pham Minh Quang',
      },
      branch: {
        label: t('deposit.accountFields.branch'),
        value: 'BIDV Saigon',
      },
      desc: {
        label: t('deposit.accountFields.content'),
        value: 'Pham Minh Quang 99MC9999',
        icon: true,
      },
    },
  };

  const handleCopy = (text: string): void => {
    Clipboard.setString(text);
    Alert.alert(
      currentLanguage === 'vi' ? 'Thông báo' : 'Notification',
      currentLanguage === 'vi' ? 'Sao chép thành công!' : 'Copied successfully',
      [
        {
          text: 'OK',
          style: 'cancel',
        },
      ],
    );
  };

  const styles = StyleSheet.create({
    form: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    },

    wrapFunction: {
      paddingHorizontal: 20,
      borderTopColor: '#bbb',
      borderTopWidth: 1,
      paddingBottom: 16,
    },
    hidden: {
      opacity: 0,
      pointerEvents: 'none',
    },

    icon: {
      tintColor: theme.iconColor,
      width: 24,
      height: 24,
    },

    toggleButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 16,
      borderRadius: 5,
      paddingBottom: 12,
    },
    buttonText: {
      color: theme.text,
      fontSize: 16,
      fontWeight: 'bold',
    },

    content: {
      overflow: 'hidden', // Đảm bảo nội dung không tràn ra ngoài
      marginVertical: 0,
      width: '100%',
      height: 'auto', // Let content determine height
    },
    contentText: {
      color: theme.text,
      fontSize: 14,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    wrapQr: {
      display: 'flex',
      backgroundColor: theme.backgroundBox,
      paddingHorizontal: 10, // Đệm ngang cho nội dung
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 20,
      gap: 24,
      borderRadius: 8,
    },
    wrapImageQr: {
      width: 110,
      height: 110,
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
      backgroundColor: 'white',
      borderRadius: 8,
    },
    qr: {
      width: 100,
      height: 100,
      padding: Platform.OS === 'ios' ? 0 : 0,
      backgroundColor: 'white',
      resizeMode: 'contain',
      borderRadius: 8,
    },
    wrapDownload: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    iconDownload: {
      tintColor: theme.iconColor,
      width: 15,
      height: 15,
    },

    textDownload: {
      color: theme.text,
    },

    wrapTransfer: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderWidth: 1,
      borderColor: 'orange',
      marginTop: 12,
      borderRadius: 8,
    },
    wrapQrText: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'flex-start',
      gap: 6,
    },
    wrapTextTransfer: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    textTitle: {
      fontSize: 12,
      color: theme.noteText,
    },
    compulsory: {
      color: 'red',
    },
    descTransfer: {
      fontSize: 14,
      color: theme.text,
      fontWeight: 'bold',
    },

    wrapTransferBank: {
      display: 'flex',
      flexDirection: 'column',
      gap: 24,
    },

    noteTransfer: {
      fontSize: 12,
      color: theme.noteText,
      lineHeight: 18,
    },

    wrapBank: {
      display: 'flex',
      flexDirection: 'row',
      gap: 8,
      justifyContent: 'space-between',
    },

    borderBank: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 12,
      padding: 12,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 8,
      width: '48%',
      backgroundColor: theme.background,
    },
    activeBank: {
      borderColor: 'orange',
      borderWidth: 2,
    },

    iconBank: {
      width: 24,
      height: 24,
    },

    textBank: {
      color: theme.text,
    },

    wrapBankTransfer: {
      display: 'flex',
      backgroundColor: theme.backgroundBox,
      flexDirection: 'column',
      paddingHorizontal: 16, // Đệm ngang cho nội dung
      paddingVertical: 12,
      gap: 20,
      borderRadius: 8,
    },

    wrapField: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    wrapTitleBank: {
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
    },
    titleBank: {
      fontSize: 12,
      color: theme.noteText,
    },
    descBank: {
      fontSize: 14,
      color: theme.text,
      fontWeight: 'bold',
    },
  });

  const BankField: React.FC<BankFieldProps> = ({label, value, icon}) => {
    const content = (
      <>
        <View style={styles.wrapTitleBank}>
          <Text style={styles.titleBank}>{label}</Text>
          <Text style={styles.descBank}>{value}</Text>
        </View>
        {icon && <Image style={styles.iconDownload} source={AppIcons.copy} />}
      </>
    );

    return icon ? (
      <Pressable
        style={styles.wrapField}
        onPress={() => handleCopy(value)}
        android_ripple={{color: 'rgba(0,0,0,0.1)'}}>
        {content}
      </Pressable>
    ) : (
      <View style={styles.wrapField}>{content}</View>
    );
  };

  return (
    <View style={styles.form}>
      <View style={styles.wrapFunction}>
        {/* Nút bấm để toggle */}
        <Pressable
          onPress={toggleQRContent}
          style={({pressed}) => [
            styles.toggleButton,
            pressed && {opacity: 0.6}, // Optional: add pressed state effect
          ]}>
          <Text style={styles.buttonText}>{t('deposit.scanQR')}</Text>
          {activeSection === 'qr' ? (
            <Image style={styles.icon} source={AppIcons.chevronUp} />
          ) : (
            <Image style={styles.icon} source={AppIcons.chevronDown} />
          )}
        </Pressable>

        {/* Nội dung có animation */}
        <View style={styles.content}>
          {activeSection === 'qr' && (
            <>
              <View style={styles.wrapQr}>
                <Text style={styles.contentText}>
                  Pham Minh Quang - 99MC9999
                </Text>
                <View style={styles.wrapImageQr}>
                  <Image style={styles.qr} source={AppIcons.qr} />
                </View>
                <Pressable style={styles.wrapDownload}>
                  <Image
                    style={styles.iconDownload}
                    source={AppIcons.downLoad}
                  />
                  <Text style={styles.textDownload}>
                    {t('deposit.downloadQR')}
                  </Text>
                </Pressable>
              </View>
              <Pressable
                style={styles.wrapTransfer}
                onPress={() => handleCopy('Pham Minh Quang 99MC9999')}>
                <View style={styles.wrapQrText}>
                  <View style={styles.wrapTextTransfer}>
                    <Text style={styles.textTitle}>
                      {t('deposit.transferContent')}
                    </Text>
                    <Text style={[styles.textTitle, styles.compulsory]}>
                      {t('deposit.required')}
                    </Text>
                  </View>
                  <Text style={styles.descTransfer}>
                    Pham Minh Quang 99MC9999
                  </Text>
                </View>
                <Pressable
                  onPress={() => handleCopy('Pham Minh Quang 99MC9999')}>
                  <Image style={styles.iconDownload} source={AppIcons.copy} />
                </Pressable>
              </Pressable>
            </>
          )}
        </View>
      </View>

      <View style={styles.wrapFunction}>
        {/* Nút bấm để toggle */}
        <Pressable
          onPress={toggleBankContent}
          style={({pressed}) => [
            styles.toggleButton,
            pressed && {opacity: 0.6}, // Optional: add pressed state effect
          ]}>
          <Text style={styles.buttonText}>{t('deposit.transferFromBank')}</Text>
          {activeSection === 'bank' ? (
            <Image style={styles.icon} source={AppIcons.chevronUp} />
          ) : (
            <Image style={styles.icon} source={AppIcons.chevronDown} />
          )}
        </Pressable>

        {/* Nội dung có animation */}
        <View style={styles.content}>
          {activeSection === 'bank' && (
            <View style={styles.wrapTransferBank}>
              <Text style={styles.noteTransfer}>
                {t('deposit.transferNote')}
              </Text>

              <View style={styles.wrapBank}>
                <Pressable
                  style={[
                    styles.borderBank,
                    selectedBank === 'TPBank' && styles.activeBank,
                  ]}
                  onPress={() => setSelectedBank('TPBank')}>
                  <Image style={styles.iconBank} source={AppIcons.tpBank} />
                  <Text style={styles.textBank}>TPBank</Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.borderBank,
                    selectedBank === 'BIDV' && styles.activeBank,
                  ]}
                  onPress={() => setSelectedBank('BIDV')}>
                  <Image style={styles.iconBank} source={AppIcons.BIDV} />
                  <Text style={styles.textBank}>BIDV</Text>
                </Pressable>
              </View>

              <View style={styles.wrapBankTransfer}>
                {Object.values(bankInfo[selectedBank]).map((field, index) => (
                  <BankField
                    key={index}
                    label={field.label}
                    value={field.value}
                    icon={field.icon}
                  />
                ))}
              </View>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default FormDeposit;
