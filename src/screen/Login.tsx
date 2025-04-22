/* eslint-disable react-native/no-inline-styles */
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Alert,
  ActivityIndicator,
} from 'react-native';
import React, {useState} from 'react';
import {AppIcons} from '../icons';
import {useTheme} from '../context/ThemeContext';
import InputBorder from '../components/InputBorder/InputBorder';
import {useTranslation} from 'react-i18next';
import {useAuth} from '../context/AuthContext';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

interface LoginProps {
  navigation: NativeStackNavigationProp<any>;
}

interface FormData {
  username: string;
  password: string;
}

const windowHeight = Dimensions.get('window').height;

const Login: React.FC<LoginProps> = ({navigation}) => {
  const [formData, setFormData] = useState<FormData>({
    username: 'demo@gmail.com',
    password: '123456',
  });
  const [invisible, setInvisible] = useState<boolean>(true);
  const {theme} = useTheme();
  const {t} = useTranslation();
  const {login, loading} = useAuth();

  const handleChange = (field: keyof FormData, value: string): void => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  // Hàm kiểm tra định dạng email
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Hàm kiểm tra định dạng số điện thoại
  const isValidPhone = (phone: string): boolean => {
    const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
    return phoneRegex.test(phone);
  };

  const handleSubmit = async (): Promise<void> => {
    const {username, password} = formData;

    // Validation checks
    if (!username || !password) {
      Alert.alert(t('notification.title'), t('login.errors.missingFields'));
      return;
    }

    // Kiểm tra username là email hoặc số điện thoại hợp lệ
    if (!isValidEmail(username) && !isValidPhone(username)) {
      Alert.alert(
        t('notification.title'),
        t('login.errors.invalidEmailOrPhone'),
      );
      return;
    }

    if (password.length < 6) {
      Alert.alert(t('notification.title'), t('login.errors.passwordLength'));
      return;
    }
    console.log('Login:', username, password);
    const result = await login(username, password);

    console.log('Result: ', JSON.stringify(result));
    if (result === true) {
      // navigation.navigate('HomeTabs');
    } else {
      Alert.alert(
        t('notification.title'),
        'Email / Số điện thoại hoặc mật khẩu không đúng !',
      );
    }
  };

  const styles = StyleSheet.create({
    view: {
      flex: 1,
      backgroundColor: theme.background,
    },
    container: {
      width: '100%',
      height: '100%',
    },
    button: {
      backgroundColor: '#0066ff',
      padding: 20,
      alignItems: 'center',
      borderRadius: 16,
      marginTop: 20,
    },
    title: {
      color: theme.text,
      fontSize: 32,
      lineHeight: 32,
      marginBottom: 38,
    },

    textButton: {
      color: '#fff',
      fontSize: 14,
      fontWeight: 'bold',
    },
    optionsNew: {
      marginTop: 28,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    buttonDisabled: {
      opacity: 0.7,
    },
  });

  return (
    <SafeAreaView style={styles.view}>
      <View style={styles.container}>
        <View
          style={{
            width: '100%',
            height: 'auto',
            paddingHorizontal: 20,
            marginTop: 0.1 * windowHeight,
          }}>
          <Text style={styles.title}>{t('login.title')}</Text>

          <View>
            <InputBorder
              name={t('login.username')}
              iconSource={AppIcons.email}
              placeholder={t('login.username')}
              keyboardType="email-address"
              onSetValue={value => handleChange('username', value)}
              value={formData.username}
              theme={theme}
            />

            <InputBorder
              name={t('login.password')}
              iconSource={AppIcons.password}
              placeholder={t('login.password')}
              secureVisible={invisible}
              onSetValue={value => handleChange('password', value)}
              value={formData.password}
              theme={theme}
              touchEyes={true}
              onPressIcon={() => setInvisible(!invisible)}
            />
          </View>
          <View>
            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleSubmit}
              disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.textButton}>{t('login.submit')}</Text>
              )}
            </TouchableOpacity>
            <View style={styles.optionsNew}>
              <Text style={{color: theme.noteText, fontSize: 14}}>
                {t('login.newUser')}{' '}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('Register');
                }}>
                <Text
                  style={{
                    color: theme.textActive,
                    fontWeight: 'bold',
                    fontSize: 14,
                    padding: 5,
                  }}>
                  {t('login.register')}
                </Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={{alignSelf: 'center', marginTop: 8}}
              onPress={() => {
                navigation.navigate('ForgetPassword');
              }}>
              <Text
                style={{
                  color: theme.textActive,
                  fontWeight: 'bold',
                  fontSize: 14,
                  textAlign: 'center',
                  padding: 8,
                }}>
                {t('login.forgotPassword')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Login;
