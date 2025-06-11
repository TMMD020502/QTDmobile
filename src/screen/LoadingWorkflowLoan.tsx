import {StyleSheet, Text, View, ActivityIndicator} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect} from 'react';
import {useSelector} from 'react-redux';
import {RootState} from '../store/store';
import {fetchWorkflowStatus} from '../api/services/loan';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../navigators/RootNavigator';
import {useTheme} from '../context/ThemeContext';
import {StepName} from '../api/types/loanInit';
import {getApplication} from '../api/services/getApplicationsLoan';
import {getAccessToken} from '../../tokenStorage';

// Add type for screen names
type ScreenName =
  | 'IntroduceLoan'
  | 'CreateLoanRequest'
  | 'CreateLoanPlan'
  | 'CreateFinancialInfo'
  | 'CreditRating'
  | 'AssetCollateral'
  | 'InfoCreateLoan';

// Define the step to screen mapping with proper types
const stepToScreenMap: Record<StepName, ScreenName> = {
  init: 'IntroduceLoan',
  'create-loan-request': 'CreateLoanRequest',
  'create-loan-plan': 'CreateLoanPlan',
  'create-financial-info': 'CreateFinancialInfo',
  'create-credit-rating': 'CreditRating',
  'add-asset-collateral': 'AssetCollateral',
} as const;

type LoadingWorkflowLoanScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'LoadingWorkflowLoan'
>;

interface LoadingWorkflowLoanProps {
  navigation: LoadingWorkflowLoanScreenNavigationProp;
}

const LoadingWorkflowLoan: React.FC<LoadingWorkflowLoanProps> = ({
  navigation,
}) => {
  const {theme} = useTheme();
  const user = useSelector((state: RootState) => state.user.userData);
  const sortScreen = [
    'CreateLoanRequest',
    'CreateLoanPlan',
    'CreateFinancialInfo',
    'CreditRating',
    'AssetCollateral',
  ];

  const findNextScreen = (
    prevSteps: string[],
    currentSteps: string[],
    nextSteps: string[],
  ): ScreenName => {

    // If no initialization yet, go to IntroduceLoan
    if (!prevSteps.includes('init')) {
      return 'IntroduceLoan';
    }

    // IMPORTANT: We prioritize nextSteps here, ignoring currentSteps
    // Convert nextSteps to screen names
    if (nextSteps.length > 0) {
      const nextScreenNames = nextSteps
        .map(step => stepToScreenMap[step as StepName])
        .filter(Boolean);
      // Check if any nextScreens match our sortScreen order
      const validNextScreens = nextScreenNames.filter(screen =>
        sortScreen.includes(screen as string),
      );
      // If none of the nextScreens match our sortScreen, go to InfoCreateLoan
      if (validNextScreens.length === 0) {
        return 'InfoCreateLoan';
      }

      // Find the first screen in our sort order that appears in nextScreens
      for (const screenName of sortScreen) {
        if (nextScreenNames.includes(screenName as ScreenName)) {
          return screenName as ScreenName;
        }
      }
    }
    return 'InfoCreateLoan';
  };

  const navigateToScreen = (screen: ScreenName, appId: string) => {
    switch (screen) {
      case 'IntroduceLoan':
        navigation.replace('IntroduceLoan'); // No params for IntroduceLoan
        break;
      case 'CreateLoanRequest':
        navigation.replace('CreateLoanRequest', {
          appId,
          fromScreen: 'LoadingWorkflowLoan',
        });
        break;
      case 'CreateLoanPlan':
        navigation.replace('CreateLoanPlan', {
          appId,
          fromScreen: 'LoadingWorkflowLoan',
        });
        break;
      case 'CreateFinancialInfo':
        navigation.replace('CreateFinancialInfo', {
          appId,
          fromScreen: 'LoadingWorkflowLoan',
        });
        break;
      case 'CreditRating':
        navigation.replace('CreditRating', {
          appId,
          fromScreen: 'LoadingWorkflowLoan',
        });
        break;
      case 'AssetCollateral':
        navigation.replace('AssetCollateral', {
          appId,
          fromScreen: 'LoadingWorkflowLoan',
        });
        break;
      case 'InfoCreateLoan':
        navigation.replace('InfoCreateLoan', {
          appId,
          fromScreen: 'LoadingWorkflowLoan',
        });
        break;
    }
  };

  useEffect(() => {
    const checkWorkflowStatus = async (retryCount = 0) => {
      try {
        // Check for token first
        const token = await getAccessToken();
        if (!token) {
          navigation.replace('Login');
          return;
        }

        // Check if user exists
        if (!user?.id) {
          navigation.replace('Login');
          return;
        }

        // Get application with retry
        const appId = await getApplication(user.id);
        if (!appId?.id) {
          if (retryCount < 1) {
            setTimeout(() => checkWorkflowStatus(retryCount + 1), 1000);
            return;
          }
          navigation.replace('IntroduceLoan');
          return;
        }

        // Fetch workflow status with retry
        const response = await fetchWorkflowStatus(appId.id);
        if (!response.result || response.code !== 'S000001') {
          if (retryCount < 1) {
            setTimeout(() => checkWorkflowStatus(retryCount + 1), 1000);
            return;
          }
          navigation.replace('IntroduceLoan');
          return;
        }
        if (response.result.length === 0) {
          navigation.replace('IntroduceLoan');
          return;
        }
        let index = 0;
        let stepsObj = response.result[index];

        // Lặp qua các phần tử cho đến khi tìm được phần tử có ít nhất 1 trường không null/undefined
        while (
          stepsObj &&
          (!stepsObj.prevSteps || stepsObj.prevSteps.length === 0) &&
          (!stepsObj.activeSteps || stepsObj.activeSteps.length === 0) &&
          (!stepsObj.nextSteps || stepsObj.nextSteps.length === 0) &&
          index < response.result.length - 1
        ) {
          index += 1;
          stepsObj = response.result[index];
        }

        // Nếu không tìm được, gán mặc định là mảng rỗng
        const {prevSteps, activeSteps, nextSteps} = stepsObj || {};
        const nextScreen = findNextScreen(prevSteps, activeSteps, nextSteps);

        // Save currentStep to AsyncStorage if available, otherwise use first nextStep
        if (nextSteps && nextSteps.length > 0) {
          await AsyncStorage.setItem('currentStep', nextSteps[0]);
        } else if (activeSteps && activeSteps.length > 0) {
          await AsyncStorage.setItem('currentStep', activeSteps[0]);
        }
        navigateToScreen(nextScreen, appId.id);
      } catch (error) {
        if (retryCount < 1) {
          setTimeout(() => checkWorkflowStatus(retryCount + 1), 1000);
          return;
        }
        navigation.replace('Login');
      }
    };

    checkWorkflowStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, navigation]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.background,
    },
    loadingText: {
      marginTop: 12,
      color: theme.borderInputBackground,
      fontSize: 16,
    },
  });

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={theme.borderInputBackground} />
      <Text style={styles.loadingText}>Đang lấy dữ liệu...</Text>
    </View>
  );
};

export default LoadingWorkflowLoan;
