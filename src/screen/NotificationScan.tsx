/* eslint-disable react-native/no-inline-styles */
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
} from 'react-native';
import React from 'react';
import Header from '../components/Header/Header';
import {useTranslation} from 'react-i18next';
import {useTheme} from '../context/ThemeContext';
import {AppIcons} from '../icons';
import {RouteProp} from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigators/RootNavigator';

type NotificationScanNavigationProp = StackNavigationProp<
  RootStackParamList,
  'NotificationScan'
>;

interface NotificationScanProps {
  navigation: NotificationScanNavigationProp;
  route: RouteProp<RootStackParamList, 'NotificationScan'>;
}

const NotificationScan: React.FC<NotificationScanProps> = ({navigation, route}) => {
  const {formDataAddress, formDataUser} = route.params; // Lấy formData từ Register
  const {t} = useTranslation();
  const {theme} = useTheme();
  console.log('Notification formData:', formDataAddress); // Debug log

  return (
    <SafeAreaView style={[styles.view, {backgroundColor: theme.background}]}>
      <View style={styles.container}>
        {/* Heading */}

        <Header Navbar="NotificationScan" navigation={navigation} />

        {/* Body */}
        <View style={styles.body}>
          <View style={styles.wrapNotification}>
            <View style={styles.wrapBanner}>
              <Image source={AppIcons.banner} style={styles.banner} />
            </View>

            <View>
              <Text style={{color: theme.text, lineHeight: 24, fontSize: 13}}>
                {t('register.notificationScan.notice')}
                <Text style={{fontWeight: 600}}>
                  {t('register.notificationScan.emphasis')}
                </Text>
              </Text>
              <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('QrScreen', {formDataAddress, formDataUser})}>
                <Text style={styles.textButton}>
                  {t('register.notificationScan.button')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default NotificationScan;

const styles = StyleSheet.create({
  view: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    width: '100%',
    height: '100%',
  },

  body: {
    paddingTop: 20,
    marginTop: 12,
    paddingHorizontal: 20,
    paddingBottom: 8,
    flex: 1,
  },

  wrapNotification: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingBottom: Platform.OS === 'ios' ? 8 : 32,
  },
  wrapBanner: {
    width: '100%',
    height: 250,
  },
  banner: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    resizeMode: 'cover',
  },
  button: {
    backgroundColor: '#0066ff',
    padding: 20,
    alignItems: 'center',
    borderRadius: 16,
    marginTop: 12,
  },
  textButton: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
