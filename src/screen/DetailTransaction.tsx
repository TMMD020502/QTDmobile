import React, {useEffect, useMemo, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Image,
  Alert,
  TouchableOpacity,
  Linking,
} from 'react-native';
import Header from '../components/Header/Header';
import {useTranslation} from 'react-i18next';
import {useTheme} from '../context/ThemeContext';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../navigators/RootNavigator';
import {RouteProp} from '@react-navigation/native';
import {AppIcons} from '../icons';
import Clipboard from '@react-native-clipboard/clipboard';
import i18n from '../../i18n';

type DetailTransactionNavigationProp = StackNavigationProp<
  RootStackParamList,
  'DetailTransaction'
>;

type DetailTransactionRouteProp = RouteProp<
  RootStackParamList,
  'DetailTransaction'
>;

interface DetailTransactionProps {
  navigation: DetailTransactionNavigationProp;
  route: DetailTransactionRouteProp;
}

const DetailTransaction: React.FC<DetailTransactionProps> = ({
  navigation,
  route,
}) => {
  const {t} = useTranslation();
  const currentLanguage = i18n.language;
  const {theme} = useTheme();
  const [iconTransaction, setIconTransaction] = useState(AppIcons.depositIcon);

  const transactionData = useMemo(
    () => route.params?.dataTransaction || {},
    [route.params],
  );

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

  const phoneNumber = '1234567890'; // Thay bằng số điện thoại bạn muốn

  const alertTexts = {
    title: {
      vi: 'Xác nhận cuộc gọi',
      en: 'Confirm Call',
    },
    message: {
      vi: `Bạn có muốn gọi đến số ${phoneNumber} không?`,
      en: `Do you want to call ${phoneNumber}?`,
    },
    cancel: {
      vi: 'Hủy',
      en: 'Cancel',
    },
    confirm: {
      vi: 'Đồng ý',
      en: 'Confirm',
    },
  };

  const confirmAndMakeCall = () => {
    Alert.alert(
      currentLanguage === 'vi' ? alertTexts.title.vi : alertTexts.title.en,
      currentLanguage === 'vi' ? alertTexts.message.vi : alertTexts.message.en,
      [
        {
          text:
            currentLanguage === 'vi'
              ? alertTexts.cancel.vi
              : alertTexts.cancel.en,
          style: 'cancel',
        },
        {
          text:
            currentLanguage === 'vi'
              ? alertTexts.confirm.vi
              : alertTexts.confirm.en,
          onPress: () => makeCall(),
        },
      ],
      {cancelable: true},
    );
  };

  const makeCall = () => {
    Linking.openURL(`tel:${phoneNumber}`).catch(err => {
      console.error('Failed to make a call', err);
    });
  };

  useEffect(() => {
    switch (transactionData.title) {
      case 'Nạp tiền':
        setIconTransaction(AppIcons.depositIcon);
        break;
      case 'Rút tiền':
        setIconTransaction(AppIcons.withdrawIcon);
        break;
      default:
        setIconTransaction(AppIcons.transactionIcon);
        break;
    }
  }, [transactionData]);

  console.log(transactionData);

  const styles = StyleSheet.create({
    view: {
      flex: 1,
      backgroundColor: theme.background,
    },
    container: {
      flex: 1,
    },
    detailsContainer: {
      backgroundColor: theme.backgroundBox,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 6,
      marginTop: 16,
      flexDirection: 'column',
      gap: 20,
      marginHorizontal: 20,
    },
    containerHeading: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      gap: 16,
    },
    textHeading: {
      flexDirection: 'column',
      gap: 4,
    },
    icon: {
      width: 30,
      height: 30,
      backgroundColor: '#fff',
      padding: 3,
      borderRadius: 99,
    },
    colorText: {
      fontSize: 14,
      color: theme.text,
    },
    containerStatus: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    money: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    noteText: {
      color: theme.noteText,
    },
    success: {
      color: theme.profit,
    },
    error: {
      color: theme.error,
    },
    gapDetails: {
      gap: 32,
      paddingVertical: 16,
    },
    wrapText: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    wrapCode: {
      flexDirection: 'row',
      gap: 6,
    },
    iconCode: {
      width: 16,
      height: 16,
      tintColor: theme.text,
    },
    valueDetail: {
      fontWeight: 'bold',
    },
    wrapSupport: {
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 20,
      marginHorizontal: 20,
      gap: 12,
    },
    wrapContact: {
      backgroundColor: theme.backgroundBox,
      width: '100%',
      justifyContent: 'center',
      flexDirection: 'row',
      gap: 8,
      padding: 12,
      borderRadius: 6,
    },
  });

  return (
    <SafeAreaView style={styles.view}>
      <View style={styles.container}>
        <Header Navbar="DetailTransaction" navigation={navigation} />
        <View style={styles.detailsContainer}>
          <View style={styles.containerHeading}>
            <Image source={iconTransaction} style={styles.icon} />
            <View style={styles.textHeading}>
              <Text style={styles.colorText}>
                {t(`totalAssets.transaction.types.${transactionData.title}`)}
              </Text>
              <Text style={[styles.colorText, styles.money]}>
                {transactionData.money}
              </Text>
            </View>
          </View>
          <View style={styles.containerStatus}>
            <Text style={[styles.colorText, styles.noteText]}>
              {t('totalAssets.transaction.status')}
            </Text>
            <Text
              style={[
                styles.colorText,
                transactionData.status === 'success'
                  ? styles.success
                  : styles.error,
              ]}>
              {t(`totalAssets.transaction.statuses.${transactionData.status}`)}
            </Text>
          </View>
        </View>

        {/* Update other translation paths similarly */}
        <View style={[styles.detailsContainer, styles.gapDetails]}>
          <View style={styles.wrapText}>
            <Text style={styles.colorText}>{t('totalAssets.transaction.date')}</Text>
            <Text style={[styles.colorText, styles.valueDetail]}>
              {transactionData.date}
            </Text>
          </View>
          <View style={styles.wrapText}>
            <Text style={styles.colorText}>{t('totalAssets.transaction.code')}</Text>
            <View style={styles.wrapCode}>
              <Text style={[styles.colorText, styles.valueDetail]}>
                {transactionData.code}
              </Text>
              <TouchableOpacity
                onPress={() => handleCopy(transactionData.code)}>
                <Image source={AppIcons.copy} style={styles.iconCode} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.wrapText}>
            <Text style={styles.colorText}>{t('totalAssets.transaction.amount')}</Text>
            <Text style={[styles.colorText, styles.valueDetail]}>
              {transactionData.money.split(' ')[1]}
            </Text>
          </View>
          <View style={styles.wrapText}>
            <Text style={styles.colorText}>{t('totalAssets.transaction.source')}</Text>
            <Text style={[styles.colorText, styles.valueDetail]}>
              {t(`totalAssets.transaction.sources.${transactionData.source}`)}
            </Text>
          </View>
        </View>

        <View style={styles.wrapSupport}>
          <Text style={styles.noteText}>
            {t('totalAssets.transaction.support.issue')}
          </Text>
          <TouchableOpacity onPress={confirmAndMakeCall} style={styles.wrapContact}>
            <Image source={AppIcons.supportIcon} style={styles.iconCode} />
            <Text style={styles.colorText}>
              {t('totalAssets.transaction.support.contact', {phone: phoneNumber})}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default DetailTransaction;
