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
} from 'react-native';
import {useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useEffect, useState} from 'react';
import Header from '../components/Header/Header';
import SelectedTabs from '../components/SelectedTabs/SelectedTabs';
import {AppIcons} from '../icons';
import {useTheme} from '../context/ThemeContext';
import i18n from '../../i18n';

import {RootStackParamList} from '../navigators/RootNavigator';
import {RootState} from '../store/store';

type InfoPersonScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'InfoPerson'
>;

interface InfoPersonProps {
  navigation: InfoPersonScreenNavigationProp;
}

interface TabItem {
  key: string;
  label: string;
}

interface UserFormat {
  address: string;
  gender: string;
  dateOfBirth: string;
  issueDate: string;
  expirationDate: string;
}

const InfoPerson: React.FC<InfoPersonProps> = ({navigation}) => {
  const currentLanguage = i18n.language;
  const {t} = useTranslation();
  const [selectedTab, setSelectedTab] = useState<'info' | 'paper'>('info');
  const [isEditable, setIsEditable] = useState<boolean>(false);
  const [userFormat, setUserFormat] = useState<UserFormat>({
    address: '',
    gender: '',
    dateOfBirth: '',
    issueDate: '',
    expirationDate: '',
  });
  const {theme} = useTheme();
  const user = useSelector((state: RootState) => state.user.userData);
  console.log('user', user);
  const tabs: TabItem[] = [
    {key: 'info', label: (t('info.infoContact') as string).toUpperCase()},
    {key: 'paper', label: (t('info.identityDocument') as string).toUpperCase()},
  ];

  const convertDateFormat = (dateString: string): string => {
    const [year, month, day] = dateString.split('T')[0].split('-');
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    if (user) {
      setUserFormat({
        address: `${user.address.streetAddress}, ${user.address.wardOrCommune}, ${user.address.district}, ${user.address.cityProvince}`,
        gender: user.identityInfo.gender === 'MALE' ? 'Nam' : 'Nữ',
        dateOfBirth: convertDateFormat(user.identityInfo.dateOfBirth),
        issueDate: convertDateFormat(user.identityInfo.issueDate),
        expirationDate: convertDateFormat(user.identityInfo.expirationDate),
      });
    }
  }, [user]);

  const handleSubmit = (): void => {
    Alert.alert(
      currentLanguage === 'vi' ? 'Thông báo' : 'Notification',
      currentLanguage === 'vi' ? 'Cập nhật thành công' : 'Update successfully',
    );
    setIsEditable(false);
  };

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
    boxAvatar: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 16,
    },
    boxSeparate: {
      flexDirection: 'column',
      justifyContent: 'space-between',
    },
    avatar: {
      width: 100,
      height: 100,
      resizeMode: 'cover',
      borderRadius: 9999,
    },
    name: {
      fontSize: 18,
      fontWeight: 'bold',
      marginTop: 24,
    },
    nameTitle: {
      marginTop: 4,
      fontSize: 14,
      color: '#aaa',
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
      fontSize: 12,
      marginBottom: 8,
      color: theme.text,
    },
    textInput: {
      backgroundColor: theme.backgroundBox,
      borderRadius: 8,
      height: 40,
      paddingLeft: 15,
      paddingRight: 15,
      paddingTop: 10,
      paddingBottom: 10,
      color: '#888',
      paddingVertical: 0,
      textAlignVertical: 'center',
    },
    textEdit: {
      color: theme.text,
    },

    placeholderStyle: {
      color: '#aaa',
      fontSize: 14,
    },

    selectedTextStyle: {
      color: '#000',
      fontSize: 14,
    },

    wrapBtn: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 12,
      paddingHorizontal: 20,
      paddingVertical: 8,
    },

    btn: {
      // flex: '1',
      width: '48%',
      padding: 12,
      borderRadius: 12,
      marginTop: 8,
    },

    btnPrimary: {
      backgroundColor: '#007BFF',
    },

    btnNormal: {
      backgroundColor: '#ddd',
    },
  });

  return (
    <SafeAreaView style={[styles.view, {backgroundColor: theme.background}]}>
      <View style={styles.container}>
        {/* Heading */}

        <Header Navbar="InfoPerson" navigation={navigation} />

        {/* Body */}

        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          nestedScrollEnabled={true}
          showsVerticalScrollIndicator={false}>
          <View style={styles.body}>
            <View>
              <View style={styles.boxAvatar}>
                <Image style={styles.avatar} source={AppIcons.avatar} />
                <Text style={[styles.name, {color: theme.text}]}>
                  {user?.identityInfo.fullName}
                </Text>
                <Text style={styles.nameTitle}>Quỹ TDND Châu Đức</Text>
              </View>

              {/* Tabs bar */}
              <SelectedTabs
                tabs={tabs}
                selectedTab={selectedTab}
                onSelectTab={(key: string) =>
                  setSelectedTab(key as 'info' | 'paper')
                }
                theme={theme}
              />

              {selectedTab === 'info' ? (
                <View>
                  <View style={styles.boxInput}>
                    <Text style={styles.headingTitle}>{t('info.phone')}</Text>
                    <TextInput
                      placeholderTextColor="#aaa"
                      keyboardType="numeric"
                      value={user?.phone}
                      style={[
                        styles.textInput,
                        isEditable ? styles.textEdit : '',
                      ]}
                      editable={isEditable} // Chỉ cho phép focus khi `isEditable` là true
                    />
                  </View>

                  <View style={styles.boxInput}>
                    <Text style={styles.headingTitle}>{t('info.email')}</Text>
                    <TextInput
                      placeholderTextColor="#aaa"
                      keyboardType="email-address"
                      value={user?.email}
                      style={[
                        styles.textInput,
                        isEditable ? styles.textEdit : '',
                      ]}
                      editable={isEditable} // Chỉ cho phép focus khi `isEditable` là true
                    />
                  </View>

                  <View style={styles.boxInput}>
                    <Text style={styles.headingTitle}>{t('info.address')}</Text>
                    <TextInput
                      placeholderTextColor="#aaa"
                      keyboardType="numeric"
                      value={userFormat.address}
                      style={[
                        styles.textInput,
                        isEditable ? styles.textEdit : '',
                      ]}
                      editable={isEditable} // Chỉ cho phép focus khi `isEditable` là true
                    />
                  </View>
                </View>
              ) : (
                <View>
                  <View style={styles.boxInput}>
                    <Text style={styles.headingTitle}>
                      {t('info.identityNumber')}
                    </Text>
                    <TextInput
                      placeholderTextColor="#aaa"
                      keyboardType="numeric"
                      value={user?.identityInfo?.identifyId}
                      style={[styles.textInput]}
                      editable={false} // Chỉ cho phép focus khi `isEditable` là true
                    />
                  </View>

                  <View style={styles.boxInput}>
                    <Text style={styles.headingTitle}>{t('info.gender')}</Text>
                    <TextInput
                      placeholderTextColor="#aaa"
                      value={userFormat.gender}
                      style={[styles.textInput]}
                      editable={false} // Chỉ cho phép focus khi `isEditable` là true
                    />
                  </View>

                  <View style={styles.boxInput}>
                    <Text style={styles.headingTitle}>
                      {t('info.dateOfBirth')}
                    </Text>
                    <TextInput
                      placeholderTextColor="#aaa"
                      value={userFormat.dateOfBirth}
                      style={[styles.textInput]}
                      editable={false} // Chỉ cho phép focus khi `isEditable` là true
                    />
                  </View>

                  <View style={styles.boxInput}>
                    <Text style={styles.headingTitle}>
                      {t('info.identityAddress')}
                    </Text>
                    <TextInput
                      placeholderTextColor="#aaa"
                      value={user?.identityInfo?.issuingAuthority}
                      style={[styles.textInput]}
                      editable={false} // Chỉ cho phép focus khi `isEditable` là true
                    />
                  </View>

                  <View style={styles.boxInput}>
                    <Text style={styles.headingTitle}>
                      {t('info.identitySupplyDay')}
                    </Text>
                    <TextInput
                      placeholderTextColor="#aaa"
                      value={userFormat.issueDate}
                      style={[styles.textInput]}
                      editable={false} // Chỉ cho phép focus khi `isEditable` là true
                    />
                  </View>

                  <View style={styles.boxInput}>
                    <Text style={styles.headingTitle}>
                      {t('info.identityDueDay')}
                    </Text>
                    <TextInput
                      placeholderTextColor="#aaa"
                      value={userFormat.expirationDate}
                      style={[styles.textInput]}
                      editable={false} // Chỉ cho phép focus khi `isEditable` là true
                    />
                  </View>

                  <View style={styles.boxInput}>
                    <Text style={styles.headingTitle}>
                      {t('info.identityHome')}
                    </Text>
                    <TextInput
                      placeholderTextColor="#aaa"
                      value={user?.identityInfo?.permanentAddress}
                      style={[styles.textInput]}
                      editable={false} // Chỉ cho phép focus khi `isEditable` là true
                    />
                  </View>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
        <View style={styles.wrapBtn}>
          <TouchableOpacity
            style={[styles.btn, styles.btnNormal]}
            onPress={() => setIsEditable(true)}>
            <Text
              style={[
                styles.textWhite,
                {
                  fontWeight: 'bold',
                  textAlign: 'center',
                  color: '#000',
                },
              ]}>
              {t('info.edit')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.btn, styles.btnPrimary]}
            onPress={handleSubmit}>
            <Text
              style={[
                styles.textWhite,
                {fontWeight: 'bold', textAlign: 'center'},
              ]}>
              {t('info.update')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default InfoPerson;
