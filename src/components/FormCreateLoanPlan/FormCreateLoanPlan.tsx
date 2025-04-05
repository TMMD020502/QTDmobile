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
import React, {useEffect, useState} from 'react';
import DropdownComponent from '../DropdownComponent/DropdownComponent';
import InputBackground from '../InputBackground/InputBackground';
import CurrencyInput from '../CurrencyInput/CurrencyInput';
import {useTranslation} from 'react-i18next';
import i18n from '../../../i18n';
import {Theme} from '../../theme/colors';
import {
  CreateLoanPlanRequest,
  LoanTermOptiontype,
} from '../../api/types/loanPlan';
import {
  getworkflowbyapplicationid,
  loanPlan,
  updateLoanPlan,
} from '../../api/services/loan';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../navigators/RootNavigator';
import {useRoute} from '@react-navigation/native';

interface FormCreateLoanPlanProps {
  theme: Theme;
  appId: string;
  fromScreen?: string;
  navigation: StackNavigationProp<RootStackParamList, 'CreateLoanPlan'>;
}

interface FormData extends Omit<CreateLoanPlanRequest, 'application'> {
  selectedLoanTerm: number | undefined;
}

interface LoanTermOption {
  value: number; // Changed from string to number
  label: string;
  interest: number; // Changed from string to number
}

const FormCreateLoanPlan: React.FC<FormCreateLoanPlanProps> = ({
  theme,
  navigation,
}) => {
  const route = useRoute();
  const {appId, fromScreen} = route.params as {
    appId: string;
    fromScreen?: string;
  };
  const currentLanguage = i18n.language;
  const {t} = useTranslation();

  const loanTerms: LoanTermOption[] = [
    {
      value: 12,
      label: currentLanguage === 'vi' ? '12 tháng' : '12 months',
      interest: 15,
    },
    {
      value: 24,
      label: currentLanguage === 'vi' ? '24 tháng' : '24 months',
      interest: 12,
    },
    {
      value: 36,
      label: currentLanguage === 'vi' ? '36 tháng' : '36 months',
      interest: 10,
    },
  ];

  const [formData, setFormData] = useState<FormData>({
    totalCapitalRequirement: 0,
    ownCapital: 0,
    proposedLoanAmount: 0,
    interestRate: 0,
    monthlyIncome: 0,
    repaymentPlan: '',
    note: '',
    loanTerm: 12,
    metadata: {
      key1: '',
      key2: '',
      key3: false,
    },
    selectedLoanTerm: 12,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [selectedInterest, setSelectedInterest] = useState<number | undefined>(
    undefined,
  );
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getworkflowbyapplicationid(appId);
        if (data.result) {
          console.log(
            '⚠️ API trả về dữ liệu ' +
              data.result.steps.at(-1)?.metadata.histories.at(-1)?.response
                .approvalProcessResponse?.metadata.purpose,
          );

          const createLoanStep = data.result.steps.find(
            step => step.name === 'create-loan-plan',
          );
          const lastValidHistory = createLoanStep?.metadata?.histories
            ?.filter(histories => !histories?.error) // Lọc ra các phần tử không có 'error'
            .at(-1); // Lấy phần tử cuối cùng trong danh sách hợp lệ

          console.log(createLoanStep);
          setFormData(prev => ({
            ...prev,
            totalCapitalRequirement:
              lastValidHistory?.response.approvalProcessResponse?.metadata
                .totalCapitalRequirement || 0,
            ownCapital:
              lastValidHistory?.response.approvalProcessResponse?.metadata
                .ownCapital || 0,
            proposedLoanAmount:
              lastValidHistory?.response.approvalProcessResponse?.metadata
                .proposedLoanAmount || 0,
            interestRate:
              lastValidHistory?.response.approvalProcessResponse?.metadata
                .interestRate || 0,
            monthlyIncome:
              lastValidHistory?.response.approvalProcessResponse?.metadata
                .monthlyIncome || 0,
            repaymentPlan:
              lastValidHistory?.response.approvalProcessResponse?.metadata
                .repaymentPlan || '',
            loanTerm:
              (lastValidHistory?.response.approvalProcessResponse?.metadata
                .loanTerm as LoanTermOptiontype) || (12 as LoanTermOptiontype),
            note:
              lastValidHistory?.response.approvalProcessResponse?.metadata
                .note || '',
            metadata: {
              key1: 'key1',
              key2: 'key 2',
            },
          }));
        }
      } catch (error) {
        console.error('Error fetching workflow:', error);
      }
    };

    fetchData();
  }, [appId]);
  const handleOnchange = (field: keyof FormData, value: any): void => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    if (field === 'selectedLoanTerm') {
      const selectedTerm = loanTerms.find(term => term.value === value);
      setSelectedInterest(selectedTerm?.interest || undefined);
    }
  };

  const handleSubmit = async (_actionType: 'next' | 'update') => {
    try {
      setIsLoading(true);
      console.log(fromScreen);
      const loanPlanData = {
        totalCapitalRequirement: formData.totalCapitalRequirement,
        ownCapital: formData.ownCapital,
        proposedLoanAmount: formData.proposedLoanAmount,
        monthlyIncome: formData.monthlyIncome,
        repaymentPlan: formData.repaymentPlan,
        note: formData.note,
        loanTerm: formData.loanTerm || 12, // Ensure it's a number
        interestRate: selectedInterest, // Already a number
        metadata: formData.metadata,
      };
      console.log('loanPlanData', loanPlanData);
      if (_actionType === 'next') {
        const response = await loanPlan(appId, loanPlanData);
        if (response) {
          navigation.replace('CreateFinancialInfo', {appId});
        }
      } else {
        console.log(fromScreen);
        const response = await updateLoanPlan(appId, loanPlanData);
        console.log('Loan request response:', response);
        if (response) {
          ///navigation.replace('InfoCreateLoan', {appId});
          navigation.goBack();
        }
      }
    } catch (err) {
      const error = err as {response?: {data?: {message?: string}}};
      console.log('Error creating loan plan:', {error});
      console.log('Error creating loan plan:', error.response?.data?.message);

      const errorMessage = error.response?.data?.message;
      if (errorMessage?.includes('Checksum is invalid. Proposed loan amount')) {
        const amounts = errorMessage.match(/\(([^)]+)\)/g);
        if (amounts && amounts.length === 2) {
          const formattedAmounts = amounts.map((amount: string) =>
            amount.replace(/(\.\d{2})/, ''),
          );
          Alert.alert(
            currentLanguage === 'vi' ? 'Lỗi' : 'Error',
            currentLanguage === 'vi'
              ? `Đề xuất hạn mức vay ${formattedAmounts[0]} không khớp với số tiền dự kiến ${formattedAmounts[1]}`
              : `Proposed loan amount ${formattedAmounts[0]} does not match the expected amount ${formattedAmounts[1]}`,
          );
        }
      } else {
        Alert.alert(
          currentLanguage === 'vi' ? 'Lỗi' : 'Error',
          currentLanguage === 'vi'
            ? 'Có lỗi xảy ra khi tạo kế hoạch vay'
            : 'Error occurred while creating loan plan',
        );
      }
    } finally {
      setIsLoading(false);
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
  });

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={false}>
        <View style={styles.boxInput}>
          <Text style={styles.headingTitle}>
            {currentLanguage === 'vi'
              ? 'Tổng vốn yêu cầu'
              : 'Total Capital Requirement'}
          </Text>
          <CurrencyInput
            placeholder={
              currentLanguage === 'vi' ? 'Nhập số tiền' : 'Enter amount'
            }
            value={formData.totalCapitalRequirement}
            onChangeText={(value: number) =>
              handleOnchange('totalCapitalRequirement', value)
            }
          />
        </View>

        <View style={styles.boxInput}>
          <Text style={styles.headingTitle}>
            {currentLanguage === 'vi' ? 'Vốn tự có' : 'Own Capital'}
          </Text>
          <CurrencyInput
            placeholder={
              currentLanguage === 'vi' ? 'Nhập số tiền' : 'Enter amount'
            }
            value={formData.ownCapital}
            onChangeText={(value: number) =>
              handleOnchange('ownCapital', value)
            }
          />
        </View>

        <View style={styles.boxInput}>
          <Text style={styles.headingTitle}>
            {currentLanguage === 'vi'
              ? 'Đề xuất hạn mức vay'
              : 'Proposed Loan Amount'}
          </Text>
          <CurrencyInput
            placeholder={
              currentLanguage === 'vi' ? 'Nhập số tiền' : 'Enter amount'
            }
            value={formData.proposedLoanAmount}
            onChangeText={(value: number) =>
              handleOnchange('proposedLoanAmount', value)
            }
          />
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
        </View>

        <View style={styles.boxInput}>
          <Text style={styles.headingTitle}>
            {currentLanguage === 'vi' ? 'Kỳ hạn vay' : 'Loan Term'}
          </Text>
          <DropdownComponent
            value={formData.selectedLoanTerm}
            data={loanTerms}
            placeholder={
              currentLanguage === 'vi' ? 'Chọn kỳ hạn' : 'Select term'
            }
            onChange={(item: LoanTermOption) =>
              handleOnchange('selectedLoanTerm', item.value)
            }
          />
          {selectedInterest && (
            <Text style={styles.rateText}>
              {currentLanguage === 'vi'
                ? `Lãi suất kỳ hạn vay ${
                    loanTerms.find(
                      term => term.value === formData.selectedLoanTerm,
                    )?.label || ''
                  }: ${selectedInterest}%`
                : `Interest rate for ${
                    loanTerms.find(
                      term => term.value === formData.selectedLoanTerm,
                    )?.label || ''
                  }: ${selectedInterest}%`}
            </Text>
          )}
        </View>

        <View style={styles.boxInput}>
          <Text style={styles.headingTitle}>
            {currentLanguage === 'vi' ? 'Kế hoạch trả nợ' : 'Repayment Plan'}
          </Text>
          <InputBackground
            placeholder={
              currentLanguage === 'vi' ? 'Nhập kế hoạch' : 'Enter plan'
            }
            onChangeText={(value: string) =>
              handleOnchange('repaymentPlan', value)
            }
            value={formData.repaymentPlan}
          />
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
        {fromScreen === 'InfoCreateLoan' ? (
          <TouchableOpacity
            style={[styles.btn, isLoading && {opacity: 0.7}]}
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
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

export default FormCreateLoanPlan;
