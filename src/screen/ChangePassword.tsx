/* eslint-disable react-native/no-inline-styles */
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Platform,
} from 'react-native';
import React, {useState} from 'react';
import Header from '../components/Header/Header';
import {useTheme} from '../context/ThemeContext';
import {useTranslation} from 'react-i18next';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../navigators/RootNavigator';
import {AppIcons} from '../icons';

type ChangePasswordNavigationProp = StackNavigationProp<
  RootStackParamList,
  'ChangePassword'
>;

interface ChangePasswordProps {
  navigation: ChangePasswordNavigationProp;
}

interface PasswordNotes {
  mainNote: string;
  subTitle: string;
  note1: string;
  note2: string;
}

const ChangePassword: React.FC<ChangePasswordProps> = ({navigation}) => {
  const [currentPassword, setCurrentPassword] = useState<string>('12345678');
  const [password, setPassword] = useState<string>('123456789');
  const [confirmPassword, setConfirmPassword] = useState<string>('123456789');
  const [invisibleCurrent, setInvisibleCurrent] = useState<boolean>(true);
  const [invisible, setInvisible] = useState<boolean>(true);
  const [invisibleConfirm, setInvisibleConfirm] = useState<boolean>(true);
  const {theme} = useTheme();
  const {t, i18n} = useTranslation();

  const getPasswordNotes = (): PasswordNotes => {
    if (i18n.language === 'vi') {
      return {
        mainNote:
          'Để bảo vệ thông tin và ngăn ngừa người khác xâm nhập vào tài khoản của bạn, hãy sử dụng mật khẩu mạnh và thay đổi mật khẩu 3 - 6 tháng/lần',
        subTitle: 'Một số điểm cần lưu ý để có mật khẩu mạnh:',
        note1:
          'Không sử dụng dẫy dễ đoán (dãy số tăng giảm, trùng nhau hoặc ngày sinh).',
        note2: 'Không dùng lại các mật khẩu đã sử dụng trước đó.',
      };
    }
    return {
      mainNote:
        'To protect your information and prevent others from accessing your account, use a strong password and change it every 3-6 months',
      subTitle: 'Some notes for a strong password:',
      note1:
        'Do not use predictable sequences (increasing/decreasing numbers, repeated numbers, or birthdates).',
      note2: 'Do not reuse passwords that have been used before.',
    };
  };

  const notes: PasswordNotes = getPasswordNotes();

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
      marginTop: 16,
      paddingHorizontal: 20,
    },

    textWhite: {
      color: 'white',
    },
    textPrimary: {
      color: '#007BFF',
    },
    iconPrimary: {
      tintColor: '#007BFF',
    },

    boxInput: {
      marginBottom: 12,
    },

    headingTitle: {
      fontWeight: 'bold',
      marginBottom: 8,
      color: theme.text,
    },
    textInput: {
      backgroundColor: '#f4f4f4',
      borderRadius: 8,
      height: 40,
      paddingLeft: 15,
      paddingRight: 50,
      paddingTop: 10,
      paddingBottom: 10,
      color: '#1e1e2d',
      paddingVertical: 0,
      textAlignVertical: 'center',
    },

    btn: {
      width: '100%',
      backgroundColor: '#007BFF',
      padding: 12,
      borderRadius: 12,
      marginTop: 8,
    },

    note: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      marginBottom: 12,
    },

    listItem: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'baseline',
    },
    bullet: {
      color: theme.noteText,
      fontSize: 24,
      marginRight: 8,
    },
    textNote: {
      color: theme.noteText,
      letterSpacing: 0.5,
      lineHeight: 24,
    },
    iconEyes: {
      position: 'absolute',
      right: 16,
      top: 10,
    },
    iconStyle: {
      bottom: Platform.OS === 'ios' ? 2 : 4,
      paddingVertical: 0,
      width: 24,
      height: 24,
    },
  });

  return (
    <SafeAreaView style={[styles.view, {backgroundColor: theme.background}]}>
      <View style={styles.container}>
        {/* Heading */}

        <Header Navbar="ChangePassword" navigation={navigation} />

        {/* Body */}

        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          nestedScrollEnabled={true}
          showsVerticalScrollIndicator={false}>
          <View style={styles.body}>
            <View>
              <View style={styles.note}>
                <Text style={styles.textNote}>{notes.mainNote}</Text>
                <View>
                  <Text style={styles.textNote}>{notes.subTitle}</Text>
                  <View style={styles.listItem}>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={styles.textNote}>{notes.note1}</Text>
                  </View>
                  <View style={styles.listItem}>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={styles.textNote}>{notes.note2}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.boxInput}>
                <Text style={styles.headingTitle}>
                  {t('changePassword.oldPassword')}
                </Text>
                <View>
                  <TextInput
                    placeholder={
                      i18n.language === 'vi'
                        ? 'Nhập mật khẩu hiện tại'
                        : 'Enter current password'
                    }
                    placeholderTextColor="#aaa"
                    secureTextEntry={invisibleCurrent}
                    onChangeText={setCurrentPassword}
                    value={currentPassword}
                    style={styles.textInput}
                  />
                  <TouchableOpacity
                    style={styles.iconEyes}
                    onPress={() => setInvisibleCurrent(!invisibleCurrent)}>
                    {invisibleCurrent ? (
                      <Image
                        source={AppIcons.eyesOpen}
                        style={styles.iconStyle}
                      />
                    ) : (
                      <Image
                        style={styles.iconStyle}
                        source={AppIcons.eyesClose}
                      />
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.boxInput}>
                <Text style={styles.headingTitle}>
                  {t('changePassword.newPassword')}
                </Text>
                <View>
                  <TextInput
                    placeholder={
                      i18n.language === 'vi'
                        ? 'Nhập mật khẩu mới'
                        : 'Enter new password'
                    }
                    placeholderTextColor="#aaa"
                    secureTextEntry={invisible}
                    onChangeText={setPassword}
                    value={password}
                    style={styles.textInput}
                  />
                  <TouchableOpacity
                    style={styles.iconEyes}
                    onPress={() => setInvisible(!invisible)}>
                    {invisible ? (
                      <Image
                        source={AppIcons.eyesOpen}
                        style={styles.iconStyle}
                      />
                    ) : (
                      <Image
                        style={styles.iconStyle}
                        source={AppIcons.eyesClose}
                      />
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.boxInput}>
                <Text style={styles.headingTitle}>
                  {t('changePassword.confirmPassword')}
                </Text>
                <View>
                  <TextInput
                    placeholder={
                      i18n.language === 'vi'
                        ? 'Nhập lại mật khẩu mới'
                        : 'Confirm new password'
                    }
                    placeholderTextColor="#aaa"
                    secureTextEntry={invisibleConfirm}
                    onChangeText={setConfirmPassword}
                    value={confirmPassword}
                    style={styles.textInput}
                  />
                  <TouchableOpacity
                    style={styles.iconEyes}
                    onPress={() => setInvisibleConfirm(!invisibleConfirm)}>
                    {invisibleConfirm ? (
                      <Image
                        source={AppIcons.eyesOpen}
                        style={styles.iconStyle}
                      />
                    ) : (
                      <Image
                        style={styles.iconStyle}
                        source={AppIcons.eyesClose}
                      />
                    )}
                  </TouchableOpacity>
                </View>
              </View>
              <TouchableOpacity
                style={styles.btn}
                onPress={() =>
                  Alert.alert(
                    i18n.language === 'vi' ? 'Thông báo' : 'Notification',
                    i18n.language === 'vi'
                      ? 'Thay đổi mật khẩu thành công'
                      : 'Password changed successfully',
                  )
                }>
                <Text
                  style={[
                    styles.textWhite,
                    {fontWeight: 'bold', textAlign: 'center'},
                  ]}>
                  {t('changePassword.submit')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default ChangePassword;
