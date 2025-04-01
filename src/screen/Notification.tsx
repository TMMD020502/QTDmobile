import {
  SafeAreaView,
  StyleSheet,
  View,
  ScrollView,
  Platform,
} from 'react-native';
import React, {useEffect} from 'react';
import Header from '../components/Header/Header';
import ContentNotification from '../components/ContentNotification/ContentNotification';
import i18n from '../../i18n';
// import {useTranslation} from 'react-i18next';
import {useTheme} from '../context/ThemeContext';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../navigators/RootNavigator';
import {getNotifications} from '../api/services/getNotifications';

type NotificationNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Notification'
>;

interface NotificationProps {
  navigation: NotificationNavigationProp;
}

interface NotificationItem {
  id: number;
  title: string;
  desc: string;
  time: string;
  seen: boolean;
}

const Notification: React.FC<NotificationProps> = ({navigation}) => {
  const currentLanguage = i18n.language;
  // const {t} = useTranslation();
  const {theme} = useTheme();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getNotifications();
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const notificationsVietnam: NotificationItem[] = [
    {
      id: 1,
      title: 'Số dư tài khoản',
      desc: 'Tài khoản của bạn được nạp thêm 5,000,000 đ. Số dư hiện tại là 100,000,000 đ',
      time: '1 phút trước',
      seen: false,
    },

    {
      id: 2,
      title: 'Số dư tài khoản',
      desc: 'Tài khoản của bạn được nạp thêm 10,000,000 đ. Số dư hiện tại là 90,000,000 đ',
      time: '3 phút trước',
      seen: true,
    },

    {
      id: 3,
      title: 'Cập nhật thông tin',
      desc: 'Đã cập nhật đầy đủ thông tin. Bạn có thể trải nghiệm mọi tính năng',
      time: '50 phút trước',
      seen: true,
    },
  ];

  const notificationsEnglish: NotificationItem[] = [
    {
      id: 1,
      title: 'Account Balance',
      desc: 'Your account has been credited with 5,000,000 VND. The current balance is 100,000,000 VND.',
      time: '1 minute ago',
      seen: false,
    },

    {
      id: 2,
      title: 'Account Balance',
      desc: 'Your account has been credited with 10,000,000 VND. The current balance is 90,000,000 VND.',
      time: '3 minutes ago',
      seen: true,
    },

    {
      id: 3,
      title: 'Information Update',
      desc: 'Your information has been fully updated. You can now enjoy all features.',
      time: '50 minutes ago',
      seen: true,
    },
  ];

  const notifications: NotificationItem[] =
    currentLanguage === 'vi' ? notificationsVietnam : notificationsEnglish;

  return (
    <SafeAreaView style={[styles.view, {backgroundColor: theme.background}]}>
      <View style={styles.container}>
        {/* Heading */}

        <Header Navbar="Notification" navigation={navigation} />

        {/* Body */}
        <ScrollView style={styles.body}>
          <View style={styles.wrapNotification}>
            {notifications.map((notification: NotificationItem) => (
              <ContentNotification data={notification} key={notification.id} />
            ))}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Notification;

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
  },

  wrapNotification: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    paddingBottom: Platform.OS === 'ios' ? 20 : 50,
  },
});
