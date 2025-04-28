/* eslint-disable react-native/no-inline-styles */
import {
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import DropdownComponent from '../DropdownComponent/DropdownComponent';
import InputBackground from '../InputBackground/InputBackground';
// Import the CurrencyInput component
import CurrencyInput from '../CurrencyInput/CurrencyInput';
import {useTranslation} from 'react-i18next';
import i18n from '../../../i18n';
import {Theme} from '../../theme/colors';
import {
  BorrowerType,
  LoanSecurityType,
  LoanCollateralType,
} from '../../api/types/loanRequest';
import {
  getworkflowbyapplicationid,
  loanRequest,
  updateLoanRequest,
} from '../../api/services/loan';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../navigators/RootNavigator';
import CustomMultiSelect from '../CustomMultiSelect/CustomMultiSelect';
import {
  CreateLoanResponse,
  History,
  InterestType,
  LoanRequest,
} from '../../api/types/loanworkflowtypes';
import {useRoute} from '@react-navigation/native';
import {useQuery} from '@tanstack/react-query';
import {fetchInterestRates} from '../../api/services/loan';
//import LoanRequestService from './../../api/services/update-loan-request';
//import axios from 'axios';
//import AsyncStorage from '@react-native-async-storage/async-storage';
//import {WorkflowResult} from '../../api/types/loanInit';
//import KeyboardWrapper from '../KeyboardWrapper/KeyboardWrapper';

interface FormCreateLoanRequestProps {
  theme: Theme;
  appId: string;
  fromScreen?: string;
  status?: string;
  navigation: StackNavigationProp<RootStackParamList, 'CreateLoanRequest'>;
}

interface TargetItem {
  value: string;
  label: string;
}

interface FormData extends Omit<LoanRequest, 'application'> {
  selectedRate?: TargetItem;
  method?: string;
}

interface LoanTermOption {
  value: number; // Changed from string to number
  label: string;
  interest: number; // Changed from string to number
}
interface FormErrors {
  amount?: string;
  purpose?: string;
  note?: string;
  loanCollateralTypes?: string;
  monthlyIncome?: string;
  borrowerType?: string;
  loanSecurityType?: string;
  interestType?: string;
  loanTerm?: string;
  repaymentMethod?: string;
}

interface InterestRate {
  id: string;
  type: string;
  term: number;
  rate: number;
  createdAt: string;
  updatedAt: string;
  lastModifiedBy: string;
  createdBy: string;
  deleted: boolean;
}
const FormCreateLoanRequest: React.FC<FormCreateLoanRequestProps> = ({
  theme,
  navigation,
}) => {
  const route = useRoute();
  const {appId, fromScreen, status} = route.params as {
    appId: string;
    fromScreen?: string;
    status?: string;
  };
  const currentLanguage = i18n.language;
  const [transactionId, setTransactionId] = useState<string>();
  const [isUnsecured, setIsUnsecured] = useState(false);
  const {t} = useTranslation();

  const borrowerTypes = [
    {
      value: 'INDIVIDUAL',
      label: currentLanguage === 'vi' ? 'Cá nhân' : 'Individual',
    },
    {
      value: 'ORGANIZATION',
      label: currentLanguage === 'vi' ? 'Doanh nghiệp' : 'Business',
    },
  ];

  const interestTypes = [
    {
      value: 'FIXED',
      label: currentLanguage === 'vi' ? 'Lãi suất cố định' : 'Fixed Rate',
    },
    {
      value: 'FLOATING',
      label: currentLanguage === 'vi' ? 'Lãi suất thả nổi' : 'Floating Rate',
    },
  ];

  const securityTypes = [
    {
      value: 'MORTGAGE',
      label: currentLanguage === 'vi' ? 'Thế chấp' : 'Mortgage',
    },
    {
      value: 'UNSECURED',
      label: currentLanguage === 'vi' ? 'Tín chấp' : 'Unsecured',
    },
  ];

  const collateralTypes = [
    {
      value: 'VEHICLE',
      label: currentLanguage === 'vi' ? 'Phương tiện' : 'Vehicle',
    },
    {
      value: 'LAND',
      label: currentLanguage === 'vi' ? 'Bất động sản' : 'Property',
    },
    {
      value: 'APARTMENT',
      label: currentLanguage === 'vi' ? 'Căn hộ' : 'Equipment',
    },
    {
      value: 'MACHINERY',
      label: currentLanguage === 'vi' ? 'Máy móc' : 'Machinery',
    },
    {
      value: 'MARKET_STALLS',
      label: currentLanguage === 'vi' ? 'Quầy hàng' : 'Market Stalls',
    },
    {
      value: 'LAND_AND_IMPROVEMENT',
      label:
        currentLanguage === 'vi' ? 'Đất và cải tạo' : 'Land and Improvement',
    },
    {
      value: 'OTHER',
      label: currentLanguage === 'vi' ? 'Khác' : 'Other',
    },
  ];

  const repaymentMethods = [
    {
      value: 'EQUAL_INSTALLMENTS',
      label:
        currentLanguage === 'vi'
          ? 'Trả góp hàng tháng (gốc + lãi cố định)'
          : 'Monthly Installments (Fixed Principal + Interest)',
    },
    {
      value: 'EQUAL_PRINCIPAL',
      label:
        currentLanguage === 'vi'
          ? 'Trả góp hàng tháng (gốc + lãi giảm dần)'
          : 'Monthly Installment (Fixed Principal + Decreasing Interest)',
    },
    {
      value: 'INTEREST_ONLY',
      label:
        currentLanguage === 'vi'
          ? 'Chỉ trả lãi hàng tháng, trả gốc sau'
          : 'Pay Interest Monthly, Principal Later',
    },
    {
      value: 'BULLET_PAYMENT',
      label:
        currentLanguage === 'vi'
          ? 'Trả toàn bộ vào cuối kỳ (gốc + lãi)'
          : 'Lump Sum at Maturity (Principal + Interest)',
    },
  ];

  const defaultTerms = useMemo(
    () => [
      {
        value: 12,
        label: currentLanguage === 'vi' ? '12 tháng' : '12 months',
        interest: 15,
      },
      // ...other terms
    ],
    [currentLanguage],
  );

  const [formData, setFormData] = useState<FormData>({
    purpose: '',
    amount: 0,
    borrowerType: 'INDIVIDUAL',
    loanSecurityType: 'UNSECURED',
    loanCollateralTypes: [],
    note: '',
    monthlyIncome: 0,
    repaymentMethod: 'EQUAL_INSTALLMENTS',
    interestType: 'FIXED',
    loanTerm: 12,
    interestRate: 0,
    metadata: {
      key1: 'value1',
      key2: 'value2',
    },
  });

  //const [workflowData, setWorkflowData] = useState<LoanApplication | null>(null);
  const [selectedInterest, setSelectedInterest] = useState<number | undefined>(
    undefined,
  );

  const {
    data: interestRates,
    isLoading: isLoadingRates,
    error,
    status: queryStatus, // Add status to check query state
  } = useQuery<InterestRate[]>({
    queryKey: ['interestRates'],
    queryFn: async () => {
      console.log('⏳ Starting interest rates fetch...');
      try {
        const response = await fetchInterestRates();
        console.log('✅ Interest rates fetched:', response);
        console.log('📊 Number of rates:', response?.length || 0);
        return response;
      } catch (err) {
        console.error('❌ Error fetching rates:', err);
        throw err;
      }
    },
    retry: 3,
    staleTime: 1000 * 60 * 5,
  });

  const loanTerms = useMemo(() => {
    // Log current query state
    console.log('🔄 Query Status:', queryStatus);
    console.log('⌛ Loading:', isLoadingRates);
    console.log('❌ Error:', error);

    // Handle loading state
    if (isLoadingRates) {
      console.log('⏳ Loading interest rates...');
      return defaultTerms;
    }

    // Handle error state
    if (error) {
      console.error('❌ Error loading interest rates:', error);
      return defaultTerms;
    }

    // Handle success state
    if (queryStatus === 'success' && Array.isArray(interestRates)) {
      console.log('✅ Mapping interest rates to loan terms');
      return interestRates.map(rate => ({
        value: rate.term,
        label:
          currentLanguage === 'vi'
            ? `${rate.term} tháng`
            : `${rate.term} months`,
        interest: rate.rate,
      }));
    }

    // Fallback to default terms
    console.log('⚠️ Using default terms');
    return defaultTerms;
  }, [
    interestRates,
    currentLanguage,
    defaultTerms,
    isLoadingRates,
    error,
    queryStatus,
  ]);

  useEffect(() => {
    const fetchData = async () => {
      // Add loanTerms to the dependency array
      try {
        const data = await getworkflowbyapplicationid<CreateLoanResponse>(
          appId,
        );
        if (data.result) {
          const createLoanStep = data.result.steps.find(
            step => step.name === 'create-loan-request',
          );

          setTransactionId(createLoanStep?.transactionId ?? '');
          const lastValidHistory = Array.isArray(
            createLoanStep?.metadata?.histories,
          )
            ? createLoanStep?.metadata?.histories
                ?.filter(
                  (history: History<CreateLoanResponse>) => !history?.error,
                )
                .at(-1)
            : null;

          setFormData(prev => {
            const metadata =
              lastValidHistory?.response.approvalProcessResponse?.metadata;
            // Nếu form đã có dữ liệu, giữ nguyên
            if (prev.amount > 0 || prev.purpose) {
              return prev;
            }
            return {
              ...prev,
              // Basic loan information
              purpose: metadata?.purpose || '',
              amount: metadata?.amount || 0,

              // Customer and security information
              borrowerType:
                (metadata?.borrowerType as BorrowerType) ||
                ('' as BorrowerType),
              loanSecurityType:
                (metadata?.loanSecurityType as LoanSecurityType) ||
                ('' as LoanSecurityType),
              loanCollateralTypes:
                (metadata?.loanCollateralTypes as LoanCollateralType[]) || [],

              // Financial information
              monthlyIncome: metadata?.monthlyIncome || 0,

              // Loan terms and conditions
              interestType:
                (metadata?.interestType as InterestType) ||
                ('' as InterestType),
              loanTerm: metadata?.loanTerm || 12,
              interestRate: metadata?.interestRate || 0,
              repaymentMethod: metadata?.repaymentMethod || '',

              // Additional information
              note: metadata?.note || '',

              // Metadata
              metadata: {
                key1: metadata?.key1 || '',
                key2: metadata?.key2 || '',
              },
            };
          });
        }
      } catch (error) {
        console.error('Error fetching workflow:', error);
      }
    };

    fetchData();
  }, [appId]);
  useEffect(() => {
    const selectedTerm = loanTerms.find(
      term => term.value === formData.loanTerm,
    );
    setSelectedInterest(selectedTerm?.interest || undefined);
  }, [formData.loanTerm, loanTerms]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isOpen, setIsOpen] = useState(false);
  const multiSelectRef = useRef<View>(null);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    // Validate amount
    if (!formData.amount || formData.amount <= 999999) {
      newErrors.amount =
        currentLanguage === 'vi'
          ? 'Vui lòng nhập số tiền lớn hơn 1,000,000 đ'
          : 'Please enter an amount greater than 1,000,000 VND';
      isValid = false;
    }

    // Validate purpose
    if (!formData.purpose.trim()) {
      newErrors.purpose =
        currentLanguage === 'vi'
          ? 'Vui lòng nhập mục đích vay'
          : 'Please enter loan purpose';
      isValid = false;
    }

    // Validate borrowerType
    if (!formData.borrowerType) {
      newErrors.borrowerType =
        currentLanguage === 'vi'
          ? 'Vui lòng chọn loại khách hàng'
          : 'Please select customer type';
      isValid = false;
    }

    // Validate loanSecurityType
    if (!formData.loanSecurityType) {
      newErrors.loanSecurityType =
        currentLanguage === 'vi'
          ? 'Vui lòng chọn hình thức bảo đảm'
          : 'Please select security type';
      isValid = false;
    }

    // Validate collateral types only if security type is MORTGAGE
    if (
      formData.loanSecurityType === 'MORTGAGE' &&
      (!formData.loanCollateralTypes ||
        formData.loanCollateralTypes.length === 0)
    ) {
      newErrors.loanCollateralTypes =
        currentLanguage === 'vi'
          ? 'Vui lòng chọn ít nhất một loại tài sản'
          : 'Please select at least one collateral type';
      isValid = false;
    }

    // Validate monthly income
    if (!formData.monthlyIncome || formData.monthlyIncome <= 0) {
      newErrors.monthlyIncome =
        currentLanguage === 'vi'
          ? 'Vui lòng nhập thu nhập hàng tháng'
          : 'Please enter monthly income';
      isValid = false;
    }

    // Validate interest type
    if (!formData.interestType) {
      newErrors.interestType =
        currentLanguage === 'vi'
          ? 'Vui lòng chọn loại lãi suất'
          : 'Please select interest type';
      isValid = false;
    }

    // Validate loan term
    if (!formData.loanTerm) {
      newErrors.loanTerm =
        currentLanguage === 'vi'
          ? 'Vui lòng chọn kỳ hạn vay'
          : 'Please select loan term';
      isValid = false;
    }

    // Validate repayment method
    if (!formData.repaymentMethod.trim()) {
      newErrors.repaymentMethod =
        currentLanguage === 'vi'
          ? 'Vui lòng chọn phương thức trả nợ'
          : 'Please enter repayment plan';
      isValid = false;
    }

    // Validate note

    setErrors(newErrors);
    return isValid;
  };
  const handleSubmit = async (_actionType: 'next' | 'update') => {
    console.log('Form data:', formData);
    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);

      const loanData = {
        monthlyIncome: formData.monthlyIncome,
        repaymentMethod: formData.repaymentMethod,
        interestType: formData.interestType,
        loanTerm: formData.loanTerm,
        interestRate: selectedInterest,
        purpose: formData.purpose,
        amount: formData.amount,
        borrowerType: formData.borrowerType,
        loanSecurityType: formData.loanSecurityType,
        loanCollateralTypes: formData.loanCollateralTypes,
        note: formData.note,
        metadata: {
          key1: '',
          key2: '',
        },
      };

      if (_actionType === 'next') {
        const response = await loanRequest(appId, loanData);
        console.log('Create loan request ngoài' + response.result.id);
        console.log('Loan request response:', response);
        if (response.code === 201) {
          navigation.replace('CreateFinancialInfo', {appId});
        }
      } else if (_actionType === 'update') {
        console.log('test');
        const response = await updateLoanRequest(
          appId,
          loanData,
          transactionId || '',
        );
        console.log('Loan request response:', response);
        if (response.code === 200) {
          navigation.goBack();
        }
      }
    } catch (err) {
      // Changed from error to err
      console.log('Error creating loan request:', err.response);
      Alert.alert(
        currentLanguage === 'vi' ? 'Lỗi' : 'Error',
        currentLanguage === 'vi'
          ? 'Có lỗi xảy ra khi tạo khoản vay'
          : 'Error occurred while creating loan request',
      );
    } finally {
      setIsLoading(false);
    }
  };

  // 4. Add logging in useMemo

  const handleOnchange = (field: keyof FormData, value: any): void => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    if (field === 'loanTerm') {
      console.log('Interest rates:', interestRates);
      const selectedTerm = loanTerms.find(term => term.value === value);
      setSelectedInterest(selectedTerm?.interest || undefined);
    }
  };

  const styles = StyleSheet.create({
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
      paddingRight: 15,
      paddingTop: 10,
      paddingBottom: 10,
      color: '#000',
      paddingVertical: 0,
      textAlignVertical: 'center',
    },

    placeholderStyle: {
      color: '#aaa',
      fontSize: 14,
    },

    selectedTextStyle: {
      color: '#000',
      fontSize: 14,
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

    dropdown: {
      borderColor: '#ccc',
      borderWidth: 1,
      borderRadius: 5,
      height: 50,
      zIndex: 5000,
    },
    dropdownContainer: {
      borderColor: '#ccc',
      zIndex: 5000,
      position: 'absolute',
    },

    rateText: {
      marginTop: 12,
      fontSize: 14,
      color: '#007BFF',
    },
    textWhite: {
      color: 'white',
    },
    errorText: {
      color: 'red',
      fontSize: 12,
      marginTop: 8,
    },
    checkboxContainer: {
      flexDirection: 'column',
      flexWrap: 'wrap',
      gap: 12,
    },
    checkboxItem: {
      // flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#f4f4f4',
      padding: 10,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#ddd',
    },
    checkboxSelected: {
      backgroundColor: '#e3f0ff',
      borderColor: '#007BFF',
    },
    checkboxText: {
      color: '#000',
    },
    checkboxTextSelected: {
      color: '#007BFF',
    },
  });

  const handleCollateralTypeChange = (value: LoanCollateralType) => {
    setFormData(prev => {
      const currentTypes = prev.loanCollateralTypes || [];
      const newTypes = currentTypes.includes(value)
        ? currentTypes.filter(type => type !== value)
        : [...currentTypes, value];

      return {
        ...prev,
        loanCollateralTypes: newTypes,
      };
    });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{flexGrow: 1}}
        contentInsetAdjustmentBehavior="automatic"
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={false}>
        <View style={styles.boxInput}>
          <Text style={styles.headingTitle}>
            {currentLanguage === 'vi' ? 'Số tiền vay' : 'Loan Amount'}
          </Text>
          {/* Use the CurrencyInput component */}
          <CurrencyInput
            placeholder={
              currentLanguage === 'vi' ? 'Nhập số tiền' : 'Enter amount'
            }
            value={formData.amount}
            onChangeText={(value: number) => handleOnchange('amount', value)}
          />
          {errors.amount && (
            <Text style={styles.errorText}>{errors.amount}</Text>
          )}
        </View>

        <View style={styles.boxInput}>
          <Text style={styles.headingTitle}>
            {currentLanguage === 'vi' ? 'Mục đích vay' : 'Loan Purpose'}
          </Text>
          <InputBackground
            placeholder={
              currentLanguage === 'vi' ? 'Nhập mục đích' : 'Enter purpose'
            }
            onChangeText={(value: string) => handleOnchange('purpose', value)}
            value={formData.purpose}
          />
          {errors.purpose && (
            <Text style={styles.errorText}>{errors.purpose}</Text>
          )}
        </View>

        <View style={styles.boxInput}>
          <Text style={styles.headingTitle}>
            {currentLanguage === 'vi' ? 'Loại khách hàng' : 'Customer Type'}
          </Text>
          <DropdownComponent
            value={formData.borrowerType}
            data={borrowerTypes}
            placeholder={currentLanguage === 'vi' ? 'Chọn loại' : 'Select type'}
            onChange={(value: TargetItem) =>
              handleOnchange('borrowerType', value.value as BorrowerType)
            }
          />
        </View>

        <View style={styles.boxInput}>
          <Text style={styles.headingTitle}>
            {currentLanguage === 'vi' ? 'Hình thức bảo đảm' : 'Security Type'}
          </Text>
          <DropdownComponent
            value={formData.loanSecurityType}
            data={securityTypes}
            placeholder={
              currentLanguage === 'vi' ? 'Chọn hình thức' : 'Select type'
            }
            onChange={(value: TargetItem) => {
              handleOnchange(
                'loanSecurityType',
                value.value as LoanSecurityType,
              );

              // Nếu chọn "Tín Chấp", làm trống danh sách tài sản đảm bảo và khóa component
              if (value.value === 'UNSECURED') {
                handleOnchange('loanCollateralTypes', []); // Làm trống danh sách tài sản đảm bảo
                setIsUnsecured(true); // Khóa component
              } else {
                setIsUnsecured(false); // Mở khóa component
              }
            }}
          />
        </View>

        <View style={styles.boxInput}>
          <Text style={styles.headingTitle}>
            {currentLanguage === 'vi'
              ? 'Loại tài sản đảm bảo'
              : 'Collateral Type'}
          </Text>
          <CustomMultiSelect
            ref={multiSelectRef}
            value={formData.loanCollateralTypes}
            options={collateralTypes}
            placeholder={
              currentLanguage === 'vi'
                ? 'Chọn loại tài sản'
                : 'Select collateral types'
            }
            onChange={value => handleOnchange('loanCollateralTypes', value)}
            onItemSelect={handleCollateralTypeChange}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            theme={theme}
            disabled={isUnsecured}
          />
          {errors.loanCollateralTypes && (
            <Text style={styles.errorText}>{errors.loanCollateralTypes}</Text>
          )}
        </View>

        <View style={styles.boxInput}>
          <Text style={styles.headingTitle}>
            {currentLanguage === 'vi'
              ? 'Thu nhập hàng tháng'
              : 'Monthly Income'}
          </Text>
          <CurrencyInput
            placeholder={
              currentLanguage === 'vi' ? 'Nhập thu nhập' : 'Enter income'
            }
            value={formData.monthlyIncome}
            onChangeText={(value: number) =>
              handleOnchange('monthlyIncome', value)
            }
          />
          {errors.monthlyIncome && (
            <Text style={styles.errorText}>{errors.monthlyIncome}</Text>
          )}
        </View>

        <View style={styles.boxInput}>
          <Text style={styles.headingTitle}>
            {currentLanguage === 'vi' ? 'Loại lãi suất' : 'Interest Type'}
          </Text>
          <DropdownComponent
            value={formData.interestType}
            data={interestTypes} // Thay đổi từ borrowerTypes sang interestTypes
            placeholder={
              currentLanguage === 'vi'
                ? 'Chọn loại lãi suất'
                : 'Select interest type'
            }
            onChange={(value: TargetItem) =>
              handleOnchange('interestType', value.value as InterestType)
            }
          />
          {errors.interestType && (
            <Text style={styles.errorText}>{errors.interestType}</Text>
          )}
        </View>
        <View style={styles.boxInput}>
          <Text style={styles.headingTitle}>
            {currentLanguage === 'vi' ? 'Kỳ hạn vay' : 'Loan Term'}
          </Text>
          <DropdownComponent
            value={formData.loanTerm}
            data={loanTerms}
            placeholder={
              currentLanguage === 'vi' ? 'Chọn kỳ hạn' : 'Select term'
            }
            onChange={(item: LoanTermOption) =>
              handleOnchange('loanTerm', item.value)
            }
          />
          {selectedInterest && (
            <Text style={styles.rateText}>
              {currentLanguage === 'vi'
                ? `Lãi suất kỳ hạn vay ${
                    loanTerms.find(term => term.value === formData.loanTerm)
                      ?.label || ''
                  }: ${selectedInterest}%`
                : `Interest rate for ${
                    loanTerms.find(term => term.value === formData.loanTerm)
                      ?.label || ''
                  }: ${selectedInterest}%`}
            </Text>
          )}
        </View>
        <View style={styles.boxInput}>
          <Text style={styles.headingTitle}>
            {currentLanguage === 'vi' ? 'Phương thức trả nợ' : 'Repayment Plan'}
          </Text>
          <DropdownComponent
            value={formData.repaymentMethod}
            data={repaymentMethods}
            placeholder={
              currentLanguage === 'vi'
                ? 'Chọn phương thức trả nợ'
                : 'Select repayment plan'
            }
            onChange={(value: TargetItem) =>
              handleOnchange('repaymentMethod', value.value)
            }
          />
          {errors.repaymentMethod && (
            <Text style={styles.errorText}>{errors.repaymentMethod}</Text>
          )}
        </View>

        <View style={styles.boxInput}>
          <Text style={styles.headingTitle}>
            {currentLanguage === 'vi' ? 'Ghi chú' : 'Note'}
          </Text>
          <InputBackground
            placeholder={
              currentLanguage === 'vi' ? 'Nhập ghi chú' : 'Enter note'
            }
            onChangeText={(value: string) => handleOnchange('note', value)}
            value={formData.note}
          />
        </View>

        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          {status === 'completed' ? null : fromScreen === 'InfoCreateLoan' ? (
            <TouchableOpacity
              style={[
                styles.btn,
                isLoading && {opacity: 0.7},
                {flex: 1, marginRight: 8},
              ]}
              onPress={() => handleSubmit('update')}
              disabled={isLoading}>
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text
                  style={[
                    styles.textWhite,
                    {fontWeight: 'bold', textAlign: 'center'},
                  ]}>
                  {currentLanguage === 'vi' ? 'Cập nhật' : 'Update'}
                </Text>
              )}
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[
                styles.btn,
                isLoading && {opacity: 0.7},
                {flex: 1, marginLeft: 8},
              ]}
              onPress={() => handleSubmit('next')}
              disabled={isLoading}>
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text
                  style={[
                    styles.textWhite,
                    {fontWeight: 'bold', textAlign: 'center'},
                  ]}>
                  {t('formCreateLoan.next')}
                </Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

export default FormCreateLoanRequest;
