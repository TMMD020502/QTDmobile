/* eslint-disable react-native/no-inline-styles */
import {
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
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
  uploadLoanRequest,
} from '../../api/services/loan';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../navigators/RootNavigator';
import CustomMultiSelect from '../CustomMultiSelect/CustomMultiSelect';
import {LoanRequest} from '../../api/types/loanworkflowtypes';

//import LoanRequestService from './../../api/services/update-loan-request';
//import axios from 'axios';
//import AsyncStorage from '@react-native-async-storage/async-storage';
//import {WorkflowResult} from '../../api/types/loanInit';
//import KeyboardWrapper from '../KeyboardWrapper/KeyboardWrapper';

interface FormCreateLoanRequestProps {
  theme: Theme;
  appId: string;
  fromScreen?: string;
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

interface FormErrors {
  amount?: string;
  purpose?: string;
  note?: string;
  loanCollateralTypes?: string;
}

const FormCreateLoanRequest: React.FC<FormCreateLoanRequestProps> = ({
  theme,
  appId,
  fromScreen,
  navigation,
}) => {
  const currentLanguage = i18n.language;
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

  const [formData, setFormData] = useState<FormData>({
    purpose: '',
    amount: 0,
    borrowerType: 'INDIVIDUAL',
    loanSecurityType: 'UNSECURED',
    loanCollateralTypes: [],
    note: '',
    metadata: {
      key1: '',
      key2: '',
    },
  });
  const [isLoadingapi, setIsLoadingapi] = useState(true);
  //const [workflowData, setWorkflowData] = useState<LoanApplication | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getworkflowbyapplicationid(appId);

        if (data.result) {
          console.log(
            '⚠️ API trả về dữ liệu ' +
              data.result.steps[0].metadata.histories.at(-1)?.response
                .approvalProcessResponse?.metadata.purpose,
          );
        }
        // setWorkflowData(data); // Cập nhật workflowData từ API

        setFormData(prev => ({
          ...prev,
          purpose:
            data.result.steps[0].metadata.histories.at(-1)?.response
              .approvalProcessResponse?.metadata.purpose || '',
          amount:
            data.result.steps[0].metadata.histories.at(-1)?.response
              .approvalProcessResponse?.metadata.amount || 0,
          borrowerType:
            (data.result.steps[0].metadata.histories.at(-1)?.response
              .approvalProcessResponse?.metadata
              .borrowerType as BorrowerType) || ('' as BorrowerType),
          loanSecurityType:
            (data.result.steps[0].metadata.histories.at(-1)?.response
              .approvalProcessResponse?.metadata
              .loanSecurityType as LoanSecurityType) ||
            ('' as LoanSecurityType),
          loanCollateralTypes:
            (data.result.steps[0].metadata.histories.at(-1)?.response
              .approvalProcessResponse?.metadata
              .loanCollateralTypes as LoanCollateralType[]) ||
            ('' as LoanCollateralType),
          note:
            data.result.steps[0].metadata.histories.at(-1)?.response
              .approvalProcessResponse?.metadata.note || '',
          metadata: {
            key1: 'key1',
            key2: 'key 2',
          },
        }));
      } catch (error) {
        console.error('Error fetching workflow:', error);
      } finally {
        setIsLoadingapi(false);
      }
    };

    fetchData();
  }, [appId]);

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isOpen, setIsOpen] = useState(false);
  const multiSelectRef = useRef<View>(null);

  console.log('Form data:', formData);
  const handleOnchange = (field: keyof FormData, value: any): void => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    if (!formData.amount || formData.amount <= 999999) {
      newErrors.amount =
        currentLanguage === 'vi'
          ? 'Vui lòng nhập số tiền lớn hơn 1,000,000 đ'
          : 'Please enter a valid amount';
      isValid = false;
    }

    if (!formData.purpose.trim()) {
      newErrors.purpose =
        currentLanguage === 'vi'
          ? 'Vui lòng nhập mục đích vay'
          : 'Please enter loan purpose';
      isValid = false;
    }

    if (!formData.note.trim()) {
      newErrors.note =
        currentLanguage === 'vi'
          ? 'Vui lòng nhập ghi chú'
          : 'Please enter a note';
      isValid = false;
    }

    if (
      !formData.loanCollateralTypes ||
      formData.loanCollateralTypes.length === 0
    ) {
      newErrors.loanCollateralTypes =
        currentLanguage === 'vi'
          ? 'Vui lòng chọn ít nhất một loại tài sản'
          : 'Please select at least one collateral type';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (_actionType: 'next' | 'update') => {
    console.log('Form data:', formData);
    if (!validateForm()) {
      return;
    }
    console.log(fromScreen);
    try {
      setIsLoading(true);

      const loanData = {
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
      console.log('Loan data:', loanData, appId);

      if (_actionType === 'next') {
        const response = await loanRequest(appId, loanData);
        console.log('Create loan request ngoài' + response.result.id);
        console.log('Loan request response:', response);
        if (response) {
          navigation.replace('CreateLoanPlan', {appId});
        }
      } else {
        const response = await uploadLoanRequest(appId, loanData);
        console.log('Loan request response:', response);
        if (response) {
          //navigation.replace('InfoCreateLoan', {appId});
          navigation.goBack();
        }
      }
    } catch (error: any) {
      console.log('Error creating loan request:', error.response);
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
        {errors.amount && <Text style={styles.errorText}>{errors.amount}</Text>}
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
          {currentLanguage === 'vi' ? 'Loại người vay' : 'Borrower Type'}
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
        />
        {errors.loanCollateralTypes && (
          <Text style={styles.errorText}>{errors.loanCollateralTypes}</Text>
        )}
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
          onChange={(value: TargetItem) =>
            handleOnchange('loanSecurityType', value.value as LoanSecurityType)
          }
        />
      </View>

      <View style={styles.boxInput}>
        <Text style={styles.headingTitle}>
          {currentLanguage === 'vi' ? 'Ghi chú' : 'Note'}
        </Text>
        <InputBackground
          placeholder={currentLanguage === 'vi' ? 'Nhập ghi chú' : 'Enter note'}
          onChangeText={(value: string) => handleOnchange('note', value)}
          value={formData.note}
        />
        {errors.note && <Text style={styles.errorText}>{errors.note}</Text>}
      </View>

      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        {fromScreen === 'InfoCreateLoan' ? (
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
  );
};

export default FormCreateLoanRequest;
