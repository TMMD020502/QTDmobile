/* eslint-disable react-native/no-inline-styles */
import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import React, {useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../navigators/RootNavigator'; // Fix import path
import {AppIcons} from '../../icons';
import {useTheme} from '../../context/ThemeContext';
import {useAuth} from '../../context/AuthContext';

interface HeaderProps {
  Navbar: string;
  navigation: StackNavigationProp<RootStackParamList, keyof RootStackParamList>;
  name?: string;
}

const Header: React.FC<HeaderProps> = ({Navbar, navigation, name}) => {
  const {t} = useTranslation();
  const {theme} = useTheme();
  const {logout} = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  useEffect(() => {
  }, [Navbar]);

  const styles = StyleSheet.create({
    containHeading: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      alignItems: 'center',
      paddingTop: 8,
      backgroundColor: theme.background,
    },
    containHeadingHome: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingHorizontal: 20,
      alignItems: 'center',
      paddingBottom: 8,
      backgroundColor: theme.background,

      shadowColor: theme.headerShadow,
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 4,
      paddingTop: 8,
    },
    containHeadingOneValue: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      paddingHorizontal: 20,
      alignItems: 'center',
      height: 50, //height + px padding top = 50 = 42 + 8
      paddingTop: 8,
      backgroundColor: theme.background,
    },
    heading: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.text,
    },
    borderAvatar: {
      width: 40,
      height: 40,
    },
    avatar: {
      width: '100%',
      height: '100%',
      borderRadius: 9999,
    },
    borderArrow: {
      width: 42,
      height: 42,
      backgroundColor: theme.backgroundIcon,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 9999,
    },
    icon: {
      tintColor: theme.iconColor,
      width: 24,
      height: 24,
    },
    noBorderArrow: {
      width: 42,
      height: 42,
      alignItems: 'flex-start',
      justifyContent: 'center',
    },
    hidden: {
      opacity: 0,
      pointerEvents: 'none',
    },
  });

  return (
    <>
      {/* Render header when navbar name home */}

      {Navbar === 'Home' && (
        <View style={styles.containHeadingHome}>
          <TouchableOpacity
            style={styles.borderAvatar}
            onPress={() => navigation.navigate('InfoPerson')}>
            <Image source={AppIcons.avatar} style={styles.avatar} />
          </TouchableOpacity>
          <View style={{flex: 1, marginLeft: 16, gap: 4}}>
            <Text style={{color: theme.text}}>{t('home.welcome')}</Text>
            <Text style={styles.heading}>{name}</Text>
          </View>
          <TouchableOpacity
            style={styles.borderArrow}
            onPress={() => navigation.navigate('Notification')}>
            <Image source={AppIcons.notification} style={styles.icon} />
          </TouchableOpacity>
        </View>
      )}

      {/* Render header when navbar name save */}
      {Navbar === 'Save' && (
        <View style={styles.containHeading}>
          <TouchableOpacity
            style={styles.borderArrow}
            onPress={() => navigation.navigate('SentSave')}>
            <Image source={AppIcons.add} style={styles.icon} />
          </TouchableOpacity>
          <View>
            <Text style={styles.heading}>{t('save.title')}</Text>
          </View>
          <TouchableOpacity
            style={styles.borderArrow}
            onPress={() => navigation.navigate('Notification')}>
            <Image source={AppIcons.notification} style={styles.icon} />
          </TouchableOpacity>
        </View>
      )}

      {/* Render header when navbar name loan */}
      {Navbar === 'Loan' && (
        <View style={styles.containHeading}>
          <TouchableOpacity
            style={styles.borderArrow}
            onPress={() => navigation.navigate('LoadingWorkflowLoan')}>
            <Image source={AppIcons.add} style={styles.icon} />
          </TouchableOpacity>
          <View>
            <Text style={styles.heading}>{t('loan.title')}</Text>
          </View>
          <TouchableOpacity
            style={styles.borderArrow}
            onPress={() => navigation.navigate('Notification')}>
            <Image source={AppIcons.notification} style={styles.icon} />
          </TouchableOpacity>
        </View>
      )}

      {/* Render header when navbar name rate */}
      {Navbar === 'Rate' && (
        <View style={styles.containHeadingOneValue}>
          <View>
            <Text style={styles.heading}>{t('rate.title')}</Text>
          </View>
        </View>
      )}

      {/* Render header when navbar name setting */}
      {Navbar === 'Setting' && (
        <View style={styles.containHeading}>
          <TouchableOpacity style={styles.borderArrow} onPress={handleLogout}>
            <Image source={AppIcons.logOut} style={styles.icon} />
          </TouchableOpacity>
          <View>
            <Text style={styles.heading}>{t('settings.title')}</Text>
          </View>
          <TouchableOpacity
            style={styles.borderArrow}
            onPress={() => navigation.navigate('Notification')}>
            <Image source={AppIcons.notification} style={styles.icon} />
          </TouchableOpacity>
        </View>
      )}

      {/* Render header when navbar name changePassword */}
      {Navbar === 'ChangePassword' && (
        <View style={styles.containHeading}>
          <TouchableOpacity
            style={styles.noBorderArrow}
            onPress={() => navigation.goBack()}>
            <Image source={AppIcons.back} style={styles.icon} />
          </TouchableOpacity>
          <View>
            <Text style={styles.heading}>{t('changePassword.title')}</Text>
          </View>
          <TouchableOpacity style={[styles.borderArrow, styles.hidden]}>
            <Image source={AppIcons.notification} style={styles.icon} />
          </TouchableOpacity>
        </View>
      )}

      {/* Render header when navbar name LinkingBank */}
      {Navbar === 'LinkingBank' && (
        <View style={styles.containHeading}>
          <TouchableOpacity
            style={styles.noBorderArrow}
            onPress={() => navigation.goBack()}>
            <Image source={AppIcons.back} style={styles.icon} />
          </TouchableOpacity>
          <View>
            <Text style={styles.heading}>{t('linkBank.title')}</Text>
          </View>
          <TouchableOpacity style={[styles.borderArrow, styles.hidden]}>
            <Image source={AppIcons.notification} style={styles.icon} />
          </TouchableOpacity>
        </View>
      )}

      {/* Render header when navbar name Services */}
      {Navbar === 'Services' && (
        <View style={styles.containHeading}>
          <TouchableOpacity
            style={styles.noBorderArrow}
            onPress={() => navigation.goBack()}>
            <Image source={AppIcons.back} style={styles.icon} />
          </TouchableOpacity>
          <View>
            <Text style={styles.heading}>{t('services.title')}</Text>
          </View>
          <TouchableOpacity style={[styles.borderArrow, styles.hidden]}>
            <Image source={AppIcons.notification} style={styles.icon} />
          </TouchableOpacity>
        </View>
      )}

      {/* Render header when navbar name Promotions */}
      {Navbar === 'Promotions' && (
        <View style={styles.containHeading}>
          <TouchableOpacity
            style={styles.noBorderArrow}
            onPress={() => navigation.goBack()}>
            <Image source={AppIcons.back} style={styles.icon} />
          </TouchableOpacity>
          <View>
            <Text style={styles.heading}>{t('services.promotions.title')}</Text>
          </View>
          <TouchableOpacity style={[styles.borderArrow, styles.hidden]}>
            <Image source={AppIcons.notification} style={styles.icon} />
          </TouchableOpacity>
        </View>
      )}

      {/* Render header when navbar name MobileTopUp */}
      {Navbar === 'MobileTopUp' && (
        <View style={styles.containHeading}>
          <TouchableOpacity
            style={styles.noBorderArrow}
            onPress={() => navigation.goBack()}>
            <Image source={AppIcons.back} style={styles.icon} />
          </TouchableOpacity>
          <View>
            <Text style={styles.heading}>{t('mobileTopUp.title')}</Text>
          </View>
          <TouchableOpacity style={[styles.borderArrow, styles.hidden]}>
            <Image source={AppIcons.notification} style={styles.icon} />
          </TouchableOpacity>
        </View>
      )}

      {/* Render header when navbar name WaterBill */}
      {Navbar === 'WaterBill' && (
        <View style={styles.containHeading}>
          <TouchableOpacity
            style={styles.noBorderArrow}
            onPress={() => navigation.goBack()}>
            <Image source={AppIcons.back} style={styles.icon} />
          </TouchableOpacity>
          <View>
            <Text style={styles.heading}>{t('waterBill.title')}</Text>
          </View>
          <TouchableOpacity style={[styles.borderArrow, styles.hidden]}>
            <Image source={AppIcons.notification} style={styles.icon} />
          </TouchableOpacity>
        </View>
      )}

      {/* Render header when navbar name ElectricityBill */}
      {Navbar === 'ElectricityBill' && (
        <View style={styles.containHeading}>
          <TouchableOpacity
            style={styles.noBorderArrow}
            onPress={() => navigation.goBack()}>
            <Image source={AppIcons.back} style={styles.icon} />
          </TouchableOpacity>
          <View>
            <Text style={styles.heading}>{t('electricityBill.title')}</Text>
          </View>
          <TouchableOpacity style={[styles.borderArrow, styles.hidden]}>
            <Image source={AppIcons.notification} style={styles.icon} />
          </TouchableOpacity>
        </View>
      )}

      {/* Render header when navbar name InternetBill */}
      {Navbar === 'InternetBill' && (
        <View style={styles.containHeading}>
          <TouchableOpacity
            style={styles.noBorderArrow}
            onPress={() => navigation.goBack()}>
            <Image source={AppIcons.back} style={styles.icon} />
          </TouchableOpacity>
          <View>
            <Text style={styles.heading}>{t('Bill.title')}</Text>
          </View>
          <TouchableOpacity style={[styles.borderArrow, styles.hidden]}>
            <Image source={AppIcons.notification} style={styles.icon} />
          </TouchableOpacity>
        </View>
      )}

      {/* Render header when navbar name LanguageSetting */}
      {Navbar === 'LanguageSetting' && (
        <View style={styles.containHeading}>
          <TouchableOpacity
            style={styles.noBorderArrow}
            onPress={() => navigation.goBack()}>
            <Image source={AppIcons.back} style={styles.icon} />
          </TouchableOpacity>
          <View>
            <Text style={styles.heading}>{t('languageSettings.title')}</Text>
          </View>
          <TouchableOpacity style={[styles.borderArrow, styles.hidden]}>
            <Image source={AppIcons.notification} style={styles.icon} />
          </TouchableOpacity>
        </View>
      )}

      {/* Render header when navbar name DarkModeSetting */}
      {Navbar === 'DarkModeSetting' && (
        <View style={styles.containHeading}>
          <TouchableOpacity
            style={styles.noBorderArrow}
            onPress={() => navigation.goBack()}>
            <Image source={AppIcons.back} style={styles.icon} />
          </TouchableOpacity>
          <View>
            <Text style={styles.heading}>{t('screen.title')}</Text>
          </View>
          <TouchableOpacity style={[styles.borderArrow, styles.hidden]}>
            <Image source={AppIcons.notification} style={styles.icon} />
          </TouchableOpacity>
        </View>
      )}

      {/* Render header when navbar name InfoPerson */}
      {Navbar === 'InfoPerson' && (
        <View style={styles.containHeading}>
          <TouchableOpacity
            style={styles.noBorderArrow}
            onPress={() => navigation.goBack()}>
            <Image source={AppIcons.back} style={styles.icon} />
          </TouchableOpacity>
          <View>
            <Text style={styles.heading}>{t('info.title')}</Text>
          </View>
          <TouchableOpacity style={[styles.borderArrow, styles.hidden]}>
            <Image source={AppIcons.notification} style={styles.icon} />
          </TouchableOpacity>
        </View>
      )}

      {/* Render header when navbar name Notification */}
      {Navbar === 'Notification' && (
        <View style={styles.containHeading}>
          <TouchableOpacity
            style={[styles.noBorderArrow]}
            onPress={() => navigation.goBack()}>
            <Image source={AppIcons.back} style={styles.icon} />
          </TouchableOpacity>
          <View>
            <Text style={styles.heading}>{t('notification.title')}</Text>
          </View>
          <TouchableOpacity style={[styles.noBorderArrow]}>
            <Text
              style={{
                position: 'absolute',
                right: 0,
                width: 80, // Changed from '80' to 80
                textAlign: 'right',
                flexShrink: 1,
                flexWrap: 'nowrap',
                flexDirection: 'row',
                color: '#007BFF',
                fontSize: 14,
              }}>
              {t('notification.seen')}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Render header when navbar name CreateLoanRequest */}
      {Navbar === 'CreateLoanRequest' && (
        <View style={styles.containHeading}>
          <TouchableOpacity
            style={styles.noBorderArrow}
            onPress={() => navigation.goBack()}>
            <Image source={AppIcons.back} style={styles.icon} />
          </TouchableOpacity>
          <View>
            <Text style={styles.heading}>
              {t('formCreateLoan.loanRequest')}
            </Text>
          </View>
          <TouchableOpacity style={[styles.borderArrow, styles.hidden]}>
            <Image source={AppIcons.notification} style={styles.icon} />
          </TouchableOpacity>
        </View>
      )}

      {/* Render header when navbar name CreateLoanPlan */}
      {Navbar === 'CreateLoanPlan' && (
        <View style={styles.containHeading}>
          <TouchableOpacity
            style={styles.noBorderArrow}
            onPress={() => navigation.goBack()}>
            <Image source={AppIcons.back} style={styles.icon} />
          </TouchableOpacity>
          <View>
            <Text style={styles.heading}>{t('formCreateLoan.loanPlan')}</Text>
          </View>
          <TouchableOpacity style={[styles.borderArrow, styles.hidden]}>
            <Image source={AppIcons.notification} style={styles.icon} />
          </TouchableOpacity>
        </View>
      )}

      {/* Render header when navbar name CreateFinancialInfo */}
      {Navbar === 'CreateFinancialInfo' && (
        <View style={styles.containHeading}>
          <TouchableOpacity
            style={styles.noBorderArrow}
            onPress={() => navigation.goBack()}>
            <Image source={AppIcons.back} style={styles.icon} />
          </TouchableOpacity>
          <View>
            <Text style={styles.heading}>
              {t('formCreateLoan.financialInfo.title')}
            </Text>
          </View>
          <TouchableOpacity style={[styles.borderArrow, styles.hidden]}>
            <Image source={AppIcons.notification} style={styles.icon} />
          </TouchableOpacity>
        </View>
      )}

      {/* Render header when navbar name CreditRating */}
      {Navbar === 'CreditRating' && (
        <View style={styles.containHeading}>
          <TouchableOpacity
            style={styles.noBorderArrow}
            onPress={() => navigation.goBack()}>
            <Image source={AppIcons.back} style={styles.icon} />
          </TouchableOpacity>
          <View>
            <Text style={styles.heading}>Xếp hạng tín dụng</Text>
          </View>
          <TouchableOpacity style={[styles.borderArrow, styles.hidden]}>
            <Image source={AppIcons.notification} style={styles.icon} />
          </TouchableOpacity>
        </View>
      )}

      {/* Render header when navbar name AssetCollateral */}
      {Navbar === 'AssetCollateral' && (
        <View style={styles.containHeading}>
          <TouchableOpacity
            style={styles.noBorderArrow}
            onPress={() => navigation.goBack()}>
            <Image source={AppIcons.back} style={styles.icon} />
          </TouchableOpacity>
          <View>
            <Text style={styles.heading}>Tài sản thế chấp</Text>
          </View>
          <TouchableOpacity style={[styles.borderArrow, styles.hidden]}>
            <Image source={AppIcons.notification} style={styles.icon} />
          </TouchableOpacity>
        </View>
      )}

      {/* Render header when navbar name InfoCreateLoan */}
      {Navbar === 'InfoCreateLoan' && (
        <View style={styles.containHeading}>
          <TouchableOpacity
            style={styles.noBorderArrow}
            onPress={() => navigation.goBack()}>
            <Image source={AppIcons.back} style={styles.icon} />
          </TouchableOpacity>
          <View>
            <Text style={styles.heading}>Khoản vay đang tạo</Text>
          </View>
          <TouchableOpacity style={[styles.borderArrow, styles.hidden]}>
            <Image source={AppIcons.notification} style={styles.icon} />
          </TouchableOpacity>
        </View>
      )}

      {/* Render header when navbar name SentSave */}
      {Navbar === 'SentSave' && (
        <View style={styles.containHeading}>
          <TouchableOpacity
            style={styles.noBorderArrow}
            onPress={() => navigation.goBack()}>
            <Image source={AppIcons.back} style={styles.icon} />
          </TouchableOpacity>
          <View>
            <Text style={styles.heading}>{t('formCreateSave.title')}</Text>
          </View>
          <TouchableOpacity style={[styles.borderArrow, styles.hidden]}>
            <Image source={AppIcons.notification} style={styles.icon} />
          </TouchableOpacity>
        </View>
      )}

      {/* Render header when navbar name Deposit */}
      {Navbar === 'Deposit' && (
        <View style={styles.containHeading}>
          <TouchableOpacity
            style={styles.noBorderArrow}
            onPress={() => navigation.goBack()}>
            <Image source={AppIcons.back} style={styles.icon} />
          </TouchableOpacity>
          <View>
            <Text style={styles.heading}>{t('deposit.title')}</Text>
          </View>
          <TouchableOpacity style={[styles.borderArrow, styles.hidden]}>
            <Image source={AppIcons.notification} style={styles.icon} />
          </TouchableOpacity>
        </View>
      )}

      {/* Render header when navbar name Deposit */}
      {Navbar === 'Transfer' && (
        <View style={styles.containHeading}>
          <TouchableOpacity
            style={styles.noBorderArrow}
            onPress={() => navigation.goBack()}>
            <Image source={AppIcons.back} style={styles.icon} />
          </TouchableOpacity>
          <View>
            <Text style={styles.heading}>{t('transfer.title')}</Text>
          </View>
          <TouchableOpacity style={[styles.borderArrow, styles.hidden]}>
            <Image source={AppIcons.notification} style={styles.icon} />
          </TouchableOpacity>
        </View>
      )}

      {/* Render header when navbar name InfoSave */}
      {Navbar === 'InfoSave' && (
        <View style={styles.containHeading}>
          <TouchableOpacity
            style={styles.noBorderArrow}
            onPress={() => navigation.goBack()}>
            <Image source={AppIcons.back} style={styles.icon} />
          </TouchableOpacity>
          <View>
            <Text style={styles.heading}>{t('infoSave.title')}</Text>
          </View>
          <TouchableOpacity style={[styles.borderArrow, styles.hidden]}>
            <Image source={AppIcons.notification} style={styles.icon} />
          </TouchableOpacity>
        </View>
      )}

      {/* Render header when navbar name InfoLoan */}
      {Navbar === 'InfoLoan' && (
        <View style={styles.containHeading}>
          <TouchableOpacity
            style={styles.noBorderArrow}
            onPress={() => navigation.goBack()}>
            <Image source={AppIcons.back} style={styles.icon} />
          </TouchableOpacity>
          <View>
            <Text style={styles.heading}>{t('infoLoan.title')}</Text>
          </View>
          <TouchableOpacity style={[styles.borderArrow, styles.hidden]}>
            <Image source={AppIcons.notification} style={styles.icon} />
          </TouchableOpacity>
        </View>
      )}

      {/* Render header when navbar name NotificationScan */}
      {Navbar === 'NotificationScan' && (
        <View style={styles.containHeading}>
          <TouchableOpacity
            style={[styles.noBorderArrow]}
            onPress={() => navigation.goBack()}>
            <Image source={AppIcons.back} style={styles.icon} />
          </TouchableOpacity>
          <View>
            <Text style={styles.heading}>{t('register.camera.title')}</Text>
          </View>
          <TouchableOpacity style={[styles.noBorderArrow, styles.hidden]} />
        </View>
      )}

      {/* Render header when navbar name ScanQR */}
      {Navbar === 'ScanQR' && (
        <View
          style={[
            styles.containHeading,
            {paddingTop: 50, backgroundColor: 'rgba(0,0,0,0.6)'},
          ]}>
          <TouchableOpacity
            style={[styles.noBorderArrow]}
            onPress={() => navigation.goBack()}>
            <Image source={AppIcons.back} style={styles.icon} />
          </TouchableOpacity>
          <View>
            <Text style={styles.heading}>{t('register.camera.title')}</Text>
          </View>
          <TouchableOpacity style={[styles.noBorderArrow, styles.hidden]} />
        </View>
      )}

      {/* Render header when navbar name ConfirmInfo */}
      {Navbar === 'ConfirmInfo' && (
        <View style={[styles.containHeading]}>
          <TouchableOpacity
            style={[styles.noBorderArrow]}
            onPress={() => navigation.goBack()}>
            <Image source={AppIcons.back} style={styles.icon} />
          </TouchableOpacity>
          <View>
            <Text style={styles.heading}>
              {t('register.resultScreen.title')}
            </Text>
          </View>
          <TouchableOpacity style={[styles.noBorderArrow, styles.hidden]} />
        </View>
      )}

      {/* Render header when navbar name ConfirmAddress */}
      {Navbar === 'ConfirmAddress' && (
        <View style={[styles.containHeading]}>
          <TouchableOpacity
            style={[styles.noBorderArrow]}
            onPress={() => navigation.goBack()}>
            <Image source={AppIcons.back} style={styles.icon} />
          </TouchableOpacity>
          <View>
            <Text style={styles.heading}>{t('register.address.title')}</Text>
          </View>
          <TouchableOpacity style={[styles.noBorderArrow, styles.hidden]} />
        </View>
      )}

      {/* Render header when navbar name Privacy */}
      {Navbar === 'Privacy' && (
        <View style={[styles.containHeading]}>
          <TouchableOpacity
            style={[styles.noBorderArrow]}
            onPress={() => navigation.goBack()}>
            <Image source={AppIcons.back} style={styles.icon} />
          </TouchableOpacity>
          <View>
            <Text style={styles.heading}>{t('privacy.title')}</Text>
          </View>
          <TouchableOpacity style={[styles.noBorderArrow, styles.hidden]} />
        </View>
      )}

      {/* Render header when navbar name TotalAssets */}
      {Navbar === 'TotalAssets' && (
        <View style={[styles.containHeading]}>
          <TouchableOpacity
            style={[styles.noBorderArrow]}
            onPress={() => navigation.goBack()}>
            <Image source={AppIcons.back} style={styles.icon} />
          </TouchableOpacity>
          <View>
            <Text style={styles.heading}>{t('totalAssets.title')}</Text>
          </View>
          <TouchableOpacity style={[styles.noBorderArrow, styles.hidden]} />
        </View>
      )}

      {/* Render header when navbar name DetailTransaction */}
      {Navbar === 'DetailTransaction' && (
        <View style={styles.containHeading}>
          <TouchableOpacity
            style={styles.noBorderArrow}
            onPress={() => navigation.goBack()}>
            <Image source={AppIcons.back} style={styles.icon} />
          </TouchableOpacity>
          <View>
            <Text style={styles.heading}>Chi tiết giao dịch</Text>
          </View>
          <TouchableOpacity style={[styles.borderArrow, styles.hidden]}>
            <Image source={AppIcons.notification} style={styles.icon} />
          </TouchableOpacity>
        </View>
      )}

      {/* Render header when navbar name TransactionHistory */}
      {Navbar === 'TransactionHistory' && (
        <View style={styles.containHeading}>
          <TouchableOpacity
            style={styles.noBorderArrow}
            onPress={() => navigation.goBack()}>
            <Image source={AppIcons.back} style={styles.icon} />
          </TouchableOpacity>
          <View>
            <Text style={styles.heading}>Lịch sử giao dịch</Text>
          </View>
          <TouchableOpacity style={[styles.borderArrow, styles.hidden]}>
            <Image source={AppIcons.notification} style={styles.icon} />
          </TouchableOpacity>
        </View>
      )}

      {/* Render header when navbar name Introduceloan */}
      {Navbar === 'IntroduceLoan' && (
        <View style={styles.containHeading}>
          <TouchableOpacity
            style={styles.noBorderArrow}
            onPress={() => navigation.goBack()}>
            <Image source={AppIcons.back} style={styles.icon} />
          </TouchableOpacity>
          <View>
            <Text style={styles.heading}>{t('formCreateLoan.introduce')}</Text>
          </View>
          <TouchableOpacity style={[styles.borderArrow, styles.hidden]}>
            <Image source={AppIcons.notification} style={styles.icon} />
          </TouchableOpacity>
        </View>
      )}
    </>
  );
};

export default Header;
