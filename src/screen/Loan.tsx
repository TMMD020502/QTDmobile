import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import React, {useCallback} from 'react';
import Header from '../components/Header/Header';
import Table from '../components/Table/Table';
import BoxAdd from '../components/BoxAdd/BoxAdd';
import {useTranslation} from 'react-i18next';
import {useTheme} from '../context/ThemeContext';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../navigators/RootNavigator';
import i18n from '../../i18n';
import {
  getApplication,
  getApplications,
} from '../api/services/getApplicationsLoan';
import {RootState} from '../store/store';
import {useSelector} from 'react-redux';
import {Application} from '../api/types/getApplications';
import {Theme} from '../theme/colors';
import {RouteProp, useFocusEffect} from '@react-navigation/native';
import {useQuery} from '@tanstack/react-query';

type LoanScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Loan'>;

type LoanRouteProp = RouteProp<RootStackParamList, 'Loan'>;
interface LoanProps {
  navigation: LoanScreenNavigationProp;
  route: LoanRouteProp;
}
interface LoanBoxData {
  id: number;
  boxes: Array<{
    key: string;
    value: string | number;
  }>;
}

type AmountValue = string | number;

const parseAmount = (amount: AmountValue): number => {
  if (typeof amount === 'number') {
    return amount;
  }
  return Number(amount.replace(/[đ,\s]/g, '')) || 0;
};

const formatAmount = (amount: number): string => {
  return `${amount.toLocaleString('en-US')} đ`;
};

const Loan: React.FC<LoanProps> = ({navigation}) => {
  const {theme} = useTheme() as {theme: Theme};
  const {t} = useTranslation();
  const currentLanguage = i18n.language;
  const user = useSelector((state: RootState) => state.user.userData);
  // Query cho danh sách applications
  const {
    data: applications,
    isLoading: isLoadingApplications,
    refetch: refetchApplications,
  } = useQuery<Application[] | undefined>({
    queryKey: ['applications', user?.id],
    queryFn: () => getApplications(user?.id || ''),
    enabled: !!user?.id,
    // Thêm các options cho auto-refresh
    refetchInterval: 5000, // Tự động refetch mỗi 5 giây
    refetchOnWindowFocus: true, // Refetch khi focus lại window
    refetchOnMount: true, // Refetch khi component mount
    refetchOnReconnect: true, // Refetch khi có kết nối lại
    staleTime: 1000, // Data được coi là stale sau 1 giây
  });

  // Query cho application đang xử lý (spending)
  const {
    data: spendingApplication,
    isLoading: isLoadingSpending,
    refetch: refetchSpending,
  } = useQuery<Application | null | undefined>({
    queryKey: ['spendingApplication', user?.id],
    queryFn: async () => {
      try {
        const result = await getApplication(user?.id || '');
        return result || null;
      } catch (error) {
        console.error('Error fetching spending application:', error);
        return null;
      }
    },
    enabled: !!user?.id,
    // Thêm các options cho auto-refresh
    refetchInterval: 5000, // Tự động refetch mỗi 5 giây
    refetchOnWindowFocus: true, // Refetch khi focus lại window
    refetchOnMount: true, // Refetch khi component mount
    refetchOnReconnect: true, // Refetch khi có kết nối lại
    staleTime: 1000, // Data được coi là stale sau 1 giây
  });

  // Sử dụng useFocusEffect để refetch data khi màn hình được focus
  useFocusEffect(
    useCallback(() => {
      if (user?.id) {
        refetchApplications();
        refetchSpending();
      }
    }, [user?.id, refetchApplications, refetchSpending]),
  );

  const value =
    currentLanguage === 'vi'
      ? {
          purpose: 'Mua nhà',
          month: 'tháng',
          year: 'năm',
        }
      : {
          purpose: 'Buy a house',
          month: 'months',
          year: 'years',
        };

  const data: LoanBoxData[] = [
    {
      id: 1,
      boxes: [
        {key: t('loan.fields.loanAmount'), value: formatAmount(100000000)},
        {key: t('loan.fields.contractNumber'), value: '123-456-789'},
        {key: t('loan.fields.purpose'), value: value.purpose},
        {key: t('loan.fields.term'), value: `12 ${value.month}`},
        {key: t('loan.fields.rate'), value: `12%/${value.year}`},
        {key: t('loan.fields.principalPayment'), value: `6 ${value.month}`},
        {key: t('loan.fields.interestPayment'), value: `6 ${value.month}`},
        {key: t('loan.fields.effectiveDate'), value: '22/04/2024'},
        {key: t('loan.fields.dueDate'), value: '22/07/2024'},
      ],
    },
    {
      id: 2,
      boxes: [
        {key: t('loan.fields.loanAmount'), value: formatAmount(200000000)},
        {key: t('loan.fields.contractNumber'), value: '987-654-321'},
        {key: t('loan.fields.purpose'), value: value.purpose},
        {key: t('loan.fields.term'), value: `12 ${value.month}`},
        {key: t('loan.fields.rate'), value: `12%/${value.year}`},
        {key: t('loan.fields.principalPayment'), value: `6 ${value.month}`},
        {key: t('loan.fields.interestPayment'), value: `6 ${value.month}`},
        {key: t('loan.fields.effectiveDate'), value: '22/04/2024'},
        {key: t('loan.fields.dueDate'), value: '15/08/2024'},
      ],
    },
    {
      id: 3,
      boxes: [
        {key: t('loan.fields.loanAmount'), value: formatAmount(300000000)},
        {key: t('loan.fields.contractNumber'), value: '987-654-321'},
        {key: t('loan.fields.purpose'), value: value.purpose},
        {key: t('loan.fields.term'), value: `12 ${value.month}`},
        {key: t('loan.fields.rate'), value: `12%/${value.year}`},
        {key: t('loan.fields.principalPayment'), value: `6 ${value.month}`},
        {key: t('loan.fields.interestPayment'), value: `6 ${value.month}`},
        {key: t('loan.fields.status'), value: t('loan.fields.spending')},
      ],
    },
    {
      id: 4,
      boxes: [
        {key: t('loan.fields.loanAmount'), value: formatAmount(300000000)},
        {key: t('loan.fields.contractNumber'), value: '987-654-321'},
        {key: t('loan.fields.purpose'), value: value.purpose},
        {key: t('loan.fields.term'), value: `12 ${value.month}`},
        {key: t('loan.fields.rate'), value: `12%/${value.year}`},
        {key: t('loan.fields.principalPayment'), value: `6 ${value.month}`},
        {key: t('loan.fields.interestPayment'), value: `6 ${value.month}`},
        {key: t('loan.fields.effectiveDate'), value: '22/04/2024'},
        {key: t('loan.fields.dueDate'), value: '15/08/2024'},
      ],
    },
  ];

  const transformApiDataToTableFormat = (
    apiData: Application[] | undefined,
  ): LoanBoxData[] => {
    if (!apiData) return [];
    return apiData.map((app, index) => ({
      id: index + 1,
      boxes: [
        {
          key: t('loan.fields.loanAmount'),
          value: app.amount ? `${app.amount} đ` : 'N/A',
        },
        {
          key: t('loan.fields.contractNumber'),
          value: app.applicationCode || 'N/A',
        },
        {key: t('loan.fields.purpose'), value: app.purpose || 'N/A'},
        {
          key: t('loan.fields.term'),
          value: app.loanTerm ? `${app.loanTerm} tháng` : 'N/A',
        },
        {
          key: t('loan.fields.rate'),
          value: app.interestRate ? `${app.interestRate}%/năm` : 'N/A',
        },
        {key: t('loan.fields.effectiveDate'), value: app.startDate || 'N/A'},
        {key: t('loan.fields.dueDate'), value: app.dueDate || 'N/A'},
        {key: t('loan.fields.status'), value: app.status || 'N/A'},
      ],
    }));
  };

  const calculateTotalLoanAmount = (data: LoanBoxData[]): number => {
    return data.reduce((total, item) => {
      const loanAmount = item.boxes.find(
        box => box.key === t('loan.fields.loanAmount'),
      )?.value;

      if (loanAmount !== undefined) {
        return total + parseAmount(loanAmount);
      }
      return total;
    }, 0);
  };

  // Format the total amount with commas and currency symbol
  const totalLoanAmount = calculateTotalLoanAmount(data);

  console.log(totalLoanAmount);

  const styles = StyleSheet.create({
    view: {
      flex: 1,
    },
    container: {
      width: '100%',
      height: '100%',
    },

    body: {
      marginTop: 32,
      paddingHorizontal: 20,
      paddingBottom: 20,
    },

    listLoans: {
      marginTop: 18,
    },
    headingList: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    wrapContentSpending: {
      backgroundColor: theme.tableHeaderBackground,
      padding: 12,
      borderRadius: 10,
      marginTop: 12,
    },
    contentSpending: {
      color: theme.text,
    },
  });
  // Loading state
  if (isLoadingApplications || isLoadingSpending) {
    return (
      <View style={[styles.view, {backgroundColor: theme.background}]}>
        <ActivityIndicator size="large" color={theme.borderInputBackground} />
      </View>
    );
  }
  // Sử dụng data từ queries
  const loanData: Application[] = applications || [];
  const dataSpending = spendingApplication;
  const transformedData = transformApiDataToTableFormat(loanData);
  return (
    <SafeAreaView style={[styles.view, {backgroundColor: theme.background}]}>
      <View style={styles.container}>
        <Header Navbar="Loan" navigation={navigation} />

        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          showsVerticalScrollIndicator={false}>
          <View style={styles.body}>
            <BoxAdd
              title={t('loan.totalAssets')}
              number={formatAmount(totalLoanAmount)} // Use the calculated total here
              navigation={navigation}
              add={'LoadingWorkflowLoan' as unknown as never}
              addText={t('loan.add')}
            />

            {dataSpending && (
              <View style={styles.listLoans}>
                <Text style={[styles.headingList, {color: theme.text}]}>
                  {t('loan.spendingLoan')}
                </Text>

                <TouchableOpacity
                  style={styles.wrapContentSpending}
                  onPress={() => {
                    navigation.navigate('InfoCreateLoan', {
                      appId:
                        'id' in (dataSpending || {}) ? dataSpending?.id : 'N/A',
                    });
                  }}>
                  <Text style={styles.contentSpending}>
                    Bạn đang có 1 khoản vay đang tạo
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            <View style={styles.listLoans}>
              <Text style={[styles.headingList, {color: theme.text}]}>
                {t('loan.loanList')}
              </Text>

              <Table
                name="loan"
                data={transformedData} // Use loanData if available, fallback to mock data
                navigation={navigation}
                detail="InfoLoan" // TypeScript will ensure this is correct
              />
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Loan;
