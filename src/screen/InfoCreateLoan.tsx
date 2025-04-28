/* eslint-disable react/no-unstable-nested-components */
import React, {useCallback} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Header from '../components/Header/Header';
import {useTranslation} from 'react-i18next';
import {useTheme} from '../context/ThemeContext';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../navigators/RootNavigator';
import {RouteProp, useFocusEffect} from '@react-navigation/native';
import {cancelLoan, fetchWorkflowStatus} from '../api/services/loan';
//import {WorkflowResult} from '../api/types/loanInit';

import {useQuery} from '@tanstack/react-query';

type InfoCreateLoanNavigationProp = StackNavigationProp<
  RootStackParamList,
  'InfoCreateLoan'
>;

type InfoCreateLoanRouteProp = RouteProp<RootStackParamList, 'InfoCreateLoan'>;
interface InfoCreateLoanProps {
  navigation: InfoCreateLoanNavigationProp;
  route: InfoCreateLoanRouteProp;
}

const InfoCreateLoan: React.FC<InfoCreateLoanProps> = ({navigation, route}) => {
  const {t} = useTranslation();
  const {isDarkMode, theme} = useTheme();
  const {appId} = route.params;

  console.log('appId', appId);

  const {
    data: workflowData,
    isLoading,
    refetch: refetchWorkflow,
  } = useQuery({
    queryKey: ['workflowStatus', appId],
    queryFn: async () => {
      try {
        const response = await fetchWorkflowStatus(appId);
        if (!response || response.code !== 200) {
          throw new Error('Failed to fetch workflow status');
        }
        return response.result;
      } catch (error) {
        console.error('Error fetching workflow status:', error);
        throw error;
      }
    },
    enabled: !!appId,
    retry: 1,
    retryDelay: 1000,
    // Auto refresh options
    refetchInterval: 5000, // Tự động refetch mỗi 5 giây
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
    staleTime: 1000,
  });

  useFocusEffect(
    useCallback(() => {
      if (appId) {
        refetchWorkflow();
      }
    }, [appId, refetchWorkflow]),
  );

  const handleCancelLoan = () => {
    Alert.alert(
      'Xác nhận hủy',
      'Bạn có chắc chắn muốn hủy khoản vay này?',
      [
        {
          text: 'Không',
          style: 'cancel',
        },
        {
          text: 'Có',
          style: 'destructive',
          onPress: async () => {
            try {
              await cancelLoan(appId);
              navigation.goBack();
            } catch (error) {
              console.log('Error canceling loan:', error);
              // Handle error if needed
            }
          },
        },
      ],
      {cancelable: false},
    );
  };

  const styles = StyleSheet.create({
    view: {
      flex: 1,
      backgroundColor: theme.background,
    },
    container: {
      flex: 1,
      position: 'relative',
    },
    scrollContent: {
      flexGrow: 1,
      paddingBottom: 100, // Add padding to prevent content from being hidden behind buttons
    },
    optionsContainer: {
      padding: 20,
      backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff',
      borderRadius: 16,
      marginHorizontal: 15,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 5,
    },
    stepContainer: {
      marginBottom: 15,
      padding: 16,
      borderRadius: 12,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDarkMode ? '#262626' : '#ffffff',
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 1},
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      borderWidth: 2,
    },
    completedStep: {
      backgroundColor: isDarkMode ? '#064e3b' : '#ecfdf5',
      borderColor: isDarkMode ? '#059669' : '#34d399',
    },
    processingStep: {
      backgroundColor: isDarkMode ? '#172554' : '#eff6ff',
      borderColor: isDarkMode ? '#3b82f6' : '#60a5fa',
    },
    pendingStep: {
      backgroundColor: isDarkMode ? '#3f3f46' : '#fefce8',
      borderColor: isDarkMode ? '#d97706' : '#fbbf24',
    },
    stepText: {
      fontSize: 16,
      fontWeight: '500',
      color: theme.text,
      marginLeft: 12,
      flex: 1,
    },
    stepIcon: {
      width: 32,
      height: 32,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 16,
      backgroundColor: isDarkMode
        ? 'rgba(255,255,255,0.1)'
        : 'rgba(0,0,0,0.05)',
    },
    stepIconText: {
      fontSize: 18,
      fontWeight: '600',
    },
    buttonsContainer: {
      padding: 20,
      flexDirection: 'row',
      justifyContent: 'space-between',
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: theme.background,
      borderTopWidth: 1,
      borderTopColor: isDarkMode ? '#333' : '#e5e5e5',
    },
    button: {
      flex: 1,
      padding: 15,
      borderRadius: 8,
      alignItems: 'center',
      marginHorizontal: 5,
    },
    continueButton: {
      backgroundColor: '#1a73e8',
    },
    cancelButton: {
      backgroundColor: '#dc2626',
    },
    buttonText: {
      color: '#ffffff',
      fontSize: 16,
      fontWeight: '600',
    },
    legendContainer: {
      padding: 20,
      marginBottom: 20,
      marginTop: 20,
      backgroundColor: isDarkMode ? '#262626' : '#ffffff',
      borderRadius: 12,
      marginHorizontal: 15,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    legendTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.text,
      marginBottom: 10,
    },
    legendItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    legendIcon: {
      width: 24,
      height: 24,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 8,
    },
    legendText: {
      fontSize: 14,
      color: theme.text,
    },
    disabledStep: {opacity: 1},
  });

  const renderStepIcon = (status: 'completed' | 'processing' | 'pending') => {
    switch (status) {
      case 'completed':
        return (
          <View style={styles.stepIcon}>
            <Text
              style={[
                styles.stepIconText,
                {color: isDarkMode ? '#059669' : '#34d399'},
              ]}>
              ✓
            </Text>
          </View>
        );
      case 'processing':
        return (
          <View style={styles.stepIcon}>
            <ActivityIndicator
              size="small"
              color={isDarkMode ? '#3b82f6' : '#60a5fa'}
            />
          </View>
        );
      case 'pending':
        return (
          <View style={styles.stepIcon}>
            <Text
              style={[
                styles.stepIconText,
                {color: isDarkMode ? '#d97706' : '#fbbf24'},
              ]}>
              ○
            </Text>
          </View>
        );
    }
  };
  // Loading state
  if (isLoading) {
    return (
      <View style={[styles.view, {backgroundColor: theme.background}]}>
        <ActivityIndicator size="large" color={theme.borderInputBackground} />
      </View>
    );
  }

  const renderStep = (
    step: string,
    status: 'completed' | 'processing' | 'pending',
  ) => {
    const isPressable = status === 'processing' || status === 'completed'; // Chỉ cho phép nhấn khi đang xử lý

    return (
      <TouchableOpacity
        key={step}
        style={[
          styles.stepContainer,
          status === 'completed'
            ? styles.completedStep
            : status === 'processing'
            ? styles.processingStep
            : styles.pendingStep,
          !isPressable && styles.disabledStep, // Nếu không thể nhấn thì làm mờ
        ]}
        onPress={() => isPressable && handleStepPress(step, status)} // Chỉ chạy onPress nếu isPressable
        disabled={!isPressable} // Chặn sự kiện onPress nếu không phải "processing"
      >
        {renderStepIcon(status)}
        <Text style={styles.stepText}>{t(`formCreateLoan.steps.${step}`)}</Text>
      </TouchableOpacity>
    );
  };

  // Hàm hiển thị dialog khi nhấn vào step
  const handleStepPress = (step: string, status: string) => {
    console.log('Step' + step);
    if (step === 'create-loan-request') {
      navigation.navigate('CreateLoanRequest', {
        appId,
        fromScreen: 'InfoCreateLoan',
        status: status,
      });
    } else if (step === 'add-asset-collateral') {
      navigation.navigate('AssetCollateral', {
        appId,
        fromScreen: 'InfoCreateLoan',
        status: status,
      });
    } else if (step === 'create-financial-info') {
      navigation.navigate('CreateFinancialInfo', {
        appId,
        fromScreen: 'InfoCreateLoan',
        status: status,
      });
    } else if (step === 'create-credit-rating') {
      navigation.navigate('CreditRating', {
        appId,
        fromScreen: 'InfoCreateLoan',
        status: status,
      });
    } else {
      Alert.alert('Thông báo', `Bạn đã nhấn vào bước: ${step}`, [
        {text: 'OK', onPress: () => console.log('OK Pressed')},
      ]);
    }
  };

  const Legend = () => (
    <View style={styles.legendContainer}>
      <Text style={styles.legendTitle}>Chú thích trạng thái:</Text>
      <View style={styles.legendItem}>
        <View style={styles.legendIcon}>
          <Text style={{color: isDarkMode ? '#059669' : '#34d399'}}>✓</Text>
        </View>
        <Text style={styles.legendText}>Đã hoàn thành</Text>
      </View>
      <View style={styles.legendItem}>
        <View style={styles.legendIcon}>
          <ActivityIndicator
            size="small"
            color={isDarkMode ? '#3b82f6' : '#60a5fa'}
          />
        </View>
        <Text style={styles.legendText}>Chờ xét duyệt</Text>
      </View>
      <View style={styles.legendItem}>
        <View style={styles.legendIcon}>
          <Text style={{color: isDarkMode ? '#d97706' : '#fbbf24'}}>○</Text>
        </View>
        <Text style={styles.legendText}>Chưa hoàn thành</Text>
      </View>
    </View>
  );

  const filterAllowedSteps = (steps: string[]) => {
    const allowedSteps = [
      'init',
      'create-loan-request',
      'create-financial-info',
      'create-credit-rating',
      'add-asset-collateral',
    ];
    return steps
      .filter(step => allowedSteps.includes(step))
      .sort((a, b) => allowedSteps.indexOf(a) - allowedSteps.indexOf(b));
  };

  return (
    <SafeAreaView style={styles.view}>
      <View style={styles.container}>
        <Header Navbar="InfoCreateLoan" navigation={navigation} />

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Legend />
          <View style={styles.optionsContainer}>
            {workflowData?.prevSteps &&
              filterAllowedSteps(workflowData.prevSteps).map(step =>
                renderStep(step, 'completed'),
              )}
            {workflowData?.currentSteps &&
              filterAllowedSteps(workflowData.currentSteps).map(step =>
                renderStep(step, 'processing'),
              )}
            {workflowData?.nextSteps &&
              filterAllowedSteps(workflowData.nextSteps).map(step =>
                renderStep(step, 'pending'),
              )}
          </View>
        </ScrollView>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={handleCancelLoan}>
            <Text style={styles.buttonText}>Hủy khoản vay</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.continueButton]}
            onPress={() => navigation.replace('LoadingWorkflowLoan')}>
            <Text style={styles.buttonText}>Tiếp tục</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default InfoCreateLoan;
