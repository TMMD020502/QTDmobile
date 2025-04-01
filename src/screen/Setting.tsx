import {
  Linking,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Alert,
} from 'react-native';
import React from 'react';
import Header from '../components/Header/Header';
import ButtonSetting from '../components/ButtonSetting/ButtonSetting';
import {useTranslation} from 'react-i18next';
import {useTheme} from '../context/ThemeContext';
import i18n from '../../i18n';
import {AppIcons} from '../icons';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../navigators/RootNavigator';
// import { Modalize } from 'react-native-modalize';

type SettingScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Setting'
>;

interface SettingProps {
  navigation: SettingScreenNavigationProp;
}

interface Theme {
  background: string;
  noteText: string;
  iconColorActive: string;
  iconColor: string;
}

const Setting: React.FC<SettingProps> = ({navigation}) => {
  const {t} = useTranslation();
  const {theme} = useTheme() as {theme: Theme};
  const {isDarkMode} = useTheme();
  const currentLanguage = i18n.language;
  // const modalizeRef = useRef(null);

  // const openBottomSheet = () => {
  //   modalizeRef.current?.open();
  // };

  // const closeBottomSheet = () => {
  //   modalizeRef.current?.close();
  // };
  const phoneNumber = '1234567890'; // Thay bằng số điện thoại bạn muốn
  console.log(currentLanguage);

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

  // Move StyleSheet inside component to access theme
  const styles = StyleSheet.create({
    view: {
      flex: 1,
      backgroundColor: theme.background,
    },
    container: {
      width: '100%',
      height: '100%',
    },
    containBody: {
      paddingHorizontal: 20,
      marginTop: 32,
    },
    boxContent: {
      marginBottom: 31,
    },
    title: {
      fontSize: 14,
      color: theme.noteText,
      textTransform: 'uppercase',
    },
    wrapContent: {
      display: 'flex',
      flexDirection: 'column',
      marginTop: 16,
    },
  });

  return (
    <SafeAreaView style={[styles.view, {backgroundColor: theme.background}]}>
      <View style={styles.container}>
        {/* Heading */}

        <Header Navbar="Setting" navigation={navigation} />

        {/* Body */}

        <View style={styles.containBody}>
          <View style={styles.boxContent}>
            <Text style={styles.title}>{t('settings.generalInformation')}</Text>
            <View style={styles.wrapContent}>
              <ButtonSetting
                title={t('settings.personalInformation')}
                icon={AppIcons.next}
                onPress={() => navigation.navigate('InfoPerson')}
              />

              <ButtonSetting
                title={t('settings.language')}
                icon={AppIcons.next}
                onPress={() => navigation.navigate('LanguageSetting')}
                optionText={t('settings.languageSelected')}
              />

              <ButtonSetting
                title={t('settings.screenMode')}
                icon={AppIcons.next}
                onPress={() => navigation.navigate('DarkModeSetting')}
                optionText={
                  currentLanguage === 'vi'
                    ? isDarkMode
                      ? 'Tối'
                      : 'Sáng'
                    : isDarkMode
                    ? 'Dark'
                    : 'Light'
                }
              />

              <ButtonSetting
                title={t('settings.hotline')}
                icon={AppIcons.next}
                onPress={confirmAndMakeCall}
                optionText={phoneNumber}
              />
            </View>
          </View>

          <View style={styles.boxContent}>
            <Text style={styles.title}>{t('settings.security')}</Text>
            <View style={styles.wrapContent}>
              <ButtonSetting
                title={t('settings.changePassword')}
                icon={AppIcons.next}
                onPress={() => navigation.navigate('ChangePassword')}
              />

              <ButtonSetting
                title={t('settings.privacyPolicy')}
                icon={AppIcons.next}
                onPress={() => navigation.navigate('Privacy')}
              />
            </View>
          </View>
          {/* <Modalize
            ref={modalizeRef}
            modalHeight={300}
            handleStyle={styles.handle}
            overlayStyle={styles.overlay}
            modalStyle={styles.modal}>
            <View style={styles.content}>
              <Text style={styles.title}>Nội dung Bottom Sheet</Text>
              <Button title="Đóng" onPress={closeBottomSheet} />
            </View>
          </Modalize> */}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Setting;
