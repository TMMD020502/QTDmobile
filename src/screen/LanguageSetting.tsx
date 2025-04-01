/* eslint-disable react-native/no-inline-styles */
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import React, {useState} from 'react';
import Header from '../components/Header/Header';
import {useLanguage} from '../context/LanguageContext';
import i18n from '../../i18n';
import {useTranslation} from 'react-i18next';
import {useTheme} from '../context/ThemeContext';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../navigators/RootNavigator';

type LanguageSettingNavigationProp = StackNavigationProp<
  RootStackParamList,
  'LanguageSetting'
>;

interface LanguageSettingProps {
  navigation: LanguageSettingNavigationProp;
}

type LanguageType = 'vi' | 'en';

const LanguageSetting: React.FC<LanguageSettingProps> = ({navigation}) => {
  const currentLanguage = i18n.language;

  const [selectedLanguage, setSelectedLanguage] = useState<LanguageType>(
    currentLanguage as LanguageType,
  );
  const {changeLanguage} = useLanguage();
  const {t} = useTranslation();
  const {theme} = useTheme();

  const submitLanguage = (): void => {
    changeLanguage(selectedLanguage);
    Alert.alert(
      `${selectedLanguage === 'vi' ? 'Thông báo' : 'Notification'}`,
      `${
        selectedLanguage === 'vi'
          ? 'Bạn đã chọn ngôn ngữ Tiếng Việt'
          : 'You have selected English language.'
      }`,
    );
  };

  console.log(currentLanguage);

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

    btn: {
      width: '100%',
      backgroundColor: '#007BFF',
      padding: 12,
      borderRadius: 12,
      marginTop: 8,
    },

    hidden: {
      opacity: 0,
      pointerEvents: 'none',
    },

    optionContainer: {
      flexDirection: 'column',
      marginBottom: 8,
    },
    radioButton: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
      alignSelf: 'flex-start',
      paddingVertical: 8,
    },
    radioCircle: {
      height: 20,
      width: 20,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: theme.text,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 10,
      padding: 4,
    },
    radioFill: {
      width: '100%',
      height: '100%',
      backgroundColor: '#007BFF',
      borderRadius: 7,
    },

    label: {
      fontSize: 16,
      color: theme.text,
    },
  });

  return (
    <SafeAreaView style={[styles.view, {backgroundColor: theme.background}]}>
      <View style={styles.container}>
        {/* Heading */}

        <Header Navbar="LanguageSetting" navigation={navigation} />

        {/* Body */}

        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          nestedScrollEnabled={true}
          showsVerticalScrollIndicator={false}>
          <View style={styles.body}>
            <View>
              <View style={styles.optionContainer}>
                <TouchableOpacity
                  style={styles.radioButton}
                  onPress={() => setSelectedLanguage('vi')}>
                  <View style={[styles.radioCircle]}>
                    {selectedLanguage === 'vi' && (
                      <View style={styles.radioFill} />
                    )}
                  </View>
                  <Text style={styles.label}>
                    {t('languageSettings.languageVietnam')}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.radioButton}
                  onPress={() => setSelectedLanguage('en')}>
                  <View style={[styles.radioCircle]}>
                    {selectedLanguage === 'en' && (
                      <View style={styles.radioFill} />
                    )}
                  </View>
                  <Text style={styles.label}>
                    {t('languageSettings.languageEnglish')}
                  </Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.btn} onPress={submitLanguage}>
                <Text
                  style={[
                    styles.textWhite,
                    {fontWeight: 'bold', textAlign: 'center'},
                  ]}>
                  {t('languageSettings.button')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default LanguageSetting;
