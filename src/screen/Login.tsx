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
  ImageBackground,
} from 'react-native';
import React, {useState} from 'react';
import {AppIcons} from '../icons';
import {useTheme} from '../context/ThemeContext';
import InputBorder from '../components/InputBorder/InputBorder';
import {useTranslation} from 'react-i18next';
import {useAuth} from '../context/AuthContext';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import LogoSvg from '../components/ConfigSvg/LogoSvg';

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
    const result = await login(username, password);
    if (result === true) {
      //navigation.navigate('HomeTabs');
    } else {
      Alert.alert(
        t('notification.title'),
        'Email / Số điện thoại hoặc mật khẩu không đúng !',
      );
    }
  };

  const styles = StyleSheet.create({
    view: {
      flex: 2,
      backgroundColor: theme.background,
    },
    container: {
      width: '100%',
      height: '100%',
    },
    button: {
      backgroundColor: '#0066ff',
      padding: 10,
      alignItems: 'center',
      borderRadius: 16,
      marginTop: 10,
      width: '50%',
      alignSelf: 'center',
    },
    title: {
      color: '#fff',
      fontFamily: 'Roboto',
      textShadowColor: '#00000033',
      textShadowOffset: {width: 1, height: 2},
      textShadowRadius: 4,
      letterSpacing: 1,
      fontSize: 20,
      fontWeight: 'bold',

      marginTop: 10,
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
    dialoglogin: {
      marginHorizontal: 24,
      marginTop: 0.15 * windowHeight,
      backgroundColor: theme.dialogBackground,
      borderRadius: 20,
      padding: 20,
      elevation: 0, // Android shadow
      shadowColor: '#000', // iOS shadow
      shadowOffset: {width: 0, height: 4},
      shadowOpacity: 0.2,
      shadowRadius: 8,
      zIndex: 2,
    },
    textbutton: {
      color: '#007BFF',
      fontWeight: 'bold',
      fontSize: 12,
      textAlign: 'right',
      padding: 5,
    },
  });

  return (
    <SafeAreaView style={styles.view}>
      <ImageBackground
        source={AppIcons.bglogin}
        style={{flex: 1, width: '100%', height: '100%'}}
        resizeMode="cover">
        <View style={styles.container}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 12,
            }}>
            <LogoSvg style={{marginLeft: 20, marginTop: 10}} />
            <Text style={styles.title}>{t('CreditDemonName')}</Text>
          </View>
          <View style={styles.dialoglogin}>
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
                style={{alignSelf: 'flex-end'}}
                onPress={() => {
                  navigation.navigate('ForgetPassword');
                }}>
                <Text
                  style={styles.textbutton}>
                  {t('login.forgotPassword')}
                </Text>
              </TouchableOpacity>
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
                <Text style={{color: theme.text, fontSize: 14}}>
                  {t('login.newUser')}{' '}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('Register');
                  }}>
                  <Text
                    style={{
                      color: '#007BFF',
                      fontWeight: 'bold',
                      fontSize: 14,
                      padding: 5,
                    }}>
                    {t('login.register')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default Login;
