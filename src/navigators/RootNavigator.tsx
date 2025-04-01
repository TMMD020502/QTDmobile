/* eslint-disable react/react-in-jsx-scope */
import {Text, View, Image, StyleSheet, ImageSourcePropType} from 'react-native';
import {
  NavigationContainer,
  NavigationContainerRef,
} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import {TransitionPresets} from '@react-navigation/stack';
import {useTranslation} from 'react-i18next';
import {AppIcons} from '../icons';
import {useTheme} from '../context/ThemeContext';

// Import all screens
import HomeScreen from '../screen/Home';
import SettingScreen from '../screen/Setting';
import LoanScreen from '../screen/Loan';
import SaveScreen from '../screen/Save';
import RateScreen from '../screen/Rate';
import InfoSaveScreen from '../screen/InfoSave';
import InfoLoanScreen from '../screen/InfoLoan';
import SentSaveScreen from '../screen/SentSave';
import DepositScreen from '../screen/Deposit';
import TransferScreen from '../screen/Transfer';
import CreateLoanRequestScreen from '../screen/CreateLoanRequest';
import CreateLoanPlanScreen from '../screen/CreateLoanPlan';
import CreateFinancialInfoScreen from '../screen/CreateFinancialInfo';
import CreditRatingScreen from '../screen/CreditRating';
import AssetCollateralScreen from '../screen/AssetCollateral';
import InfoCreateLoanScreen from '../screen/InfoCreateLoan';
import IntroduceLoanScreen from '../screen/IntroduceLoan';
import NotificationScreen from '../screen/Notification';
import InfoPersonScreen from '../screen/InfoPerson';
import LanguageSettingScreen from '../screen/LanguageSetting';
import LinkingBankScreen from '../screen/LinkingBank';
import ServicesScreen from '../screen/Services';
import MobileTopUpScreen from '../screen/MobileTopUp';
import WaterBillScreen from '../screen/WaterBill';
import ElectricityBillScreen from '../screen/ElectricityBill';
import InternetBillScreen from '../screen/InternetBill';

import PromotionsScreen from '../screen/Promotions';
import DarkModeSettingScreen from '../screen/DarkModeSetting';
import ChangePasswordScreen from '../screen/ChangePassword';
import QRScannerApp from '../screen/QRpage';
import ResultQRApp from '../screen/ResultQR';
import NotificationScanScreen from '../screen/NotificationScan';
import LoginScreen from '../screen/Login';
import ForgetPasswordScreen from '../screen/ForgetPassword';
import RegisterScreen from '../screen/Register';
import RegisterAddressScreen from '../screen/RegisterAddress';
import PrivacyScreen from '../screen/Privacy';
import QuestionsScreen from '../screen/Questions';
import TotalAssetsScreen from '../screen/TotalAssets';
import DetailTransactionScreen from '../screen/DetailTransaction';
import TransactionHistoryScreen from '../screen/TransactionHistory';
import LoadingWorkflowLoanScreen from '../screen/LoadingWorkflowLoan';
import React from 'react';
import {useAuth} from '../context/AuthContext';

export interface FormDataAddress {
  country: string;
  cityProvince: string;
  district: string;
  wardOrCommune: string;
  streetAddress: string;
}

export interface FormDataUser {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface UserData {
  id: string;
  name: string;
  email: string;
  phone: string;
  // Add other user data fields as needed
}

export interface DataTransaction {
  code: string;
  title: string;
  money: string;
  date: string;
  status: string;
  source: string;
}

interface Question {
  id: string;
  question: string;
  answer: string;
  icon: ImageSourcePropType;
  relatedQuestions: string[];
}

export type RootStackParamList = {
  HomeTabs: {screen: string};
  Login: undefined;
  Register: undefined;
  RegisterAddress: {
    formDataUser: FormDataUser;
  };
  ForgetPassword: undefined;
  QrScreen: {
    formDataAddress: FormDataAddress;
    formDataUser: FormDataUser;
  };
  ResultQR: {
    formDataAddress: FormDataAddress;
    formDataUser: FormDataUser;
    qrData: string[];
  };
  NotificationScan: {
    formDataAddress: FormDataAddress;
    formDataUser: FormDataUser;
  };
  InfoSave: {id?: string};
  InfoLoan: {id?: string};
  InfoPerson: undefined;
  Deposit: undefined;
  Transfer: undefined;
  SentSave: undefined;
  CreateLoanRequest: {appId: string};
  CreateLoanPlan: {appId: string};
  CreateFinancialInfo: {appId: string};
  CreditRating: {appId: string};
  AssetCollateral: {appId: string};
  InfoCreateLoan: {appId: string};
  IntroduceLoan: undefined; // Changed this line
  LoadingWorkflowLoan: undefined;
  LanguageSetting: undefined;
  LinkingBank: undefined;
  Services: undefined;
  MobileTopUp: undefined;
  WaterBill: undefined;
  ElectricityBill: undefined;
  InternetBill: undefined;
  Promotions: undefined;
  DarkModeSetting: undefined;
  ChangePassword: undefined;
  Notification: undefined;
  Home: undefined;
  Save: undefined;
  Loan: undefined;
  Rate: undefined;
  Setting: undefined;
  ScanQR: undefined;
  ConfirmInfo: undefined;
  ConfirmAddress: undefined;
  Privacy: undefined;
  TotalAssets: undefined;
  DetailTransaction: {
    dataTransaction: DataTransaction;
  };
  TransactionHistory: undefined;
  Questions: {
    questionData: Question;
    allQuestions: Question[];
  };
  // Add other routes as needed
  [key: string]: any;
};

export type TabParamList = {
  Home: undefined;
  Save: undefined;
  Loan: undefined;
  Rate: undefined;
  Setting: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createStackNavigator<RootStackParamList>();

const MyTabs = () => {
  const {t} = useTranslation();
  const {theme} = useTheme();

  const getTabIcon = (routeName: keyof TabParamList) => {
    switch (routeName) {
      case 'Home':
        return AppIcons.home;
      case 'Save':
        return AppIcons.save;
      case 'Loan':
        return AppIcons.loan;
      case 'Rate':
        return AppIcons.rate;
      case 'Setting':
        return AppIcons.settings;
      default:
        return AppIcons.home;
    }
  };

  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarShowLabel: false,
        // eslint-disable-next-line react/no-unstable-nested-components
        tabBarIcon: ({focused}) => {
          const iconSource = getTabIcon(route.name);

          return (
            <View style={styles.tabIconContainer}>
              <Image
                source={iconSource}
                style={[
                  styles.icon,
                  {
                    tintColor: focused
                      ? theme.iconColorActive
                      : theme.iconColor,
                  },
                ]}
              />
              <Text
                style={[
                  styles.tabLabel,
                  // eslint-disable-next-line react-native/no-inline-styles
                  {
                    color: focused ? theme.iconColorActive : theme.iconColor,
                    fontSize: 10,
                  },
                ]}>
                {t(`navbar.${route.name.toLowerCase()}`)}
              </Text>
            </View>
          );
        },
        tabBarStyle: {
          height: 75,
          paddingBottom: 20,
          paddingTop: 15,
          backgroundColor: theme.tabBarBackground,
        },
      })}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Save" component={SaveScreen} />
      <Tab.Screen name="Loan" component={LoanScreen} />
      <Tab.Screen name="Rate" component={RateScreen} />
      <Tab.Screen name="Setting" component={SettingScreen} />
    </Tab.Navigator>
  );
};

export const navigationRef =
  React.createRef<NavigationContainerRef<RootStackParamList>>();

const AuthStack = () => (
  <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
    <Stack.Screen name="RegisterAddress" component={RegisterAddressScreen} />
    <Stack.Screen name="ForgetPassword" component={ForgetPasswordScreen} />
    <Stack.Screen name="QrScreen" component={QRScannerApp} />
    <Stack.Screen name="ResultQR" component={ResultQRApp} />
    <Stack.Screen name="NotificationScan" component={NotificationScanScreen} />
  </Stack.Navigator>
);

const AppStack = () => (
  <Stack.Navigator
    initialRouteName="HomeTabs"
    screenOptions={{
      headerShown: false,
      gestureEnabled: true,
      cardStyleInterpolator: ({current, layouts}) => ({
        cardStyle: {
          opacity: current.progress,
          transform: [
            {
              translateX: current.progress.interpolate({
                inputRange: [0, 1],
                outputRange: [layouts.screen.width, 0],
              }),
            },
          ],
        },
        overlayStyle: {
          opacity: current.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 0.5],
          }),
        },
      }),
    }}>
    <Stack.Screen name="HomeTabs" component={MyTabs} />

    <Stack.Screen name="InfoSave" component={InfoSaveScreen} />
    <Stack.Screen name="InfoLoan" component={InfoLoanScreen} />
    <Stack.Screen name="InfoPerson" component={InfoPersonScreen} />
    <Stack.Screen name="Deposit" component={DepositScreen} />
    <Stack.Screen name="Transfer" component={TransferScreen} />
    <Stack.Screen name="SentSave" component={SentSaveScreen} />
    <Stack.Screen
      name="CreateLoanRequest"
      component={CreateLoanRequestScreen}
    />
    <Stack.Screen name="CreateLoanPlan" component={CreateLoanPlanScreen} />
    <Stack.Screen
      name="CreateFinancialInfo"
      component={CreateFinancialInfoScreen}
    />
    <Stack.Screen name="CreditRating" component={CreditRatingScreen} />
    <Stack.Screen name="AssetCollateral" component={AssetCollateralScreen} />
    <Stack.Screen name="InfoCreateLoan" component={InfoCreateLoanScreen} />

    <Stack.Screen
      name="LoadingWorkflowLoan"
      component={LoadingWorkflowLoanScreen}
    />
    <Stack.Screen name="IntroduceLoan" component={IntroduceLoanScreen} />
    <Stack.Screen name="LanguageSetting" component={LanguageSettingScreen} />
    <Stack.Screen name="LinkingBank" component={LinkingBankScreen} />
    <Stack.Screen name="Services" component={ServicesScreen} />
    <Stack.Screen name="MobileTopUp" component={MobileTopUpScreen} />
    <Stack.Screen name="WaterBill" component={WaterBillScreen} />
    <Stack.Screen name="Promotions" component={PromotionsScreen} />
    <Stack.Screen name="ElectricityBill" component={ElectricityBillScreen} />
    <Stack.Screen name="InternetBill" component={InternetBillScreen} />
    <Stack.Screen name="DarkModeSetting" component={DarkModeSettingScreen} />
    <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
    <Stack.Screen name="Questions" component={QuestionsScreen} />
    <Stack.Screen
      name="Notification"
      component={NotificationScreen}
      options={{
        ...TransitionPresets.ModalSlideFromBottomIOS,
        gestureDirection: 'vertical',
        cardStyleInterpolator: ({
          current,
          layouts,
        }: {
          current: any;
          layouts: any;
        }) => ({
          cardStyle: {
            transform: [
              {
                translateY: current.progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [layouts.screen.height, 0],
                }),
              },
            ],
          },
        }),
      }}
    />
    <Stack.Screen name="Privacy" component={PrivacyScreen} />
    <Stack.Screen name="TotalAssets" component={TotalAssetsScreen} />
    <Stack.Screen
      name="DetailTransaction"
      component={DetailTransactionScreen}
    />
    <Stack.Screen
      name="TransactionHistory"
      component={TransactionHistoryScreen}
    />
  </Stack.Navigator>
);
const RootComponent: React.FC = () => {
  const {isAuthenticated} = useAuth();
  return (
    <NavigationContainer ref={navigationRef}>
      {isAuthenticated ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 'auto',
  },
  icon: {
    width: 24,
    height: 24,
    marginBottom: 4,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default RootComponent;
