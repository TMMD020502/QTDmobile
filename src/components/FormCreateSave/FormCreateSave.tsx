/* eslint-disable react-native/no-inline-styles */
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {GestureResponderEvent} from 'react-native';
import DropdownComponent from '../DropdownComponent/DropdownComponent';
import InputBackground from '../InputBackground/InputBackground';
import {useTranslation} from 'react-i18next';
import i18n from '../../../i18n';
import {useTheme} from '../../context/ThemeContext';
// import {useQuery} from '@tanstack/react-query';
// import {getUser, getUsers} from '../../api/User';

interface RateItem {
  value: string;
  label: string;
  rate: string;
}

interface MethodItem {
  value: string;
  label: string;
}

interface FormData {
  value: string | undefined;
  selectedRate: RateItem | undefined;
  methodExtend: MethodItem | undefined;
  method: MethodItem | undefined; // Changed from string to MethodItem
}

const FormCreateSave: React.FC = () => {
  const {theme} = useTheme();
  const currentLanguage = i18n.language;
  const {t} = useTranslation();

  const rates: RateItem[] = [
    {
      value: '5',
      label: `5 ${t('formCreateSave.month')}`,
      rate: '4%',
    },
    {
      value: '8',
      label: `8 ${t('formCreateSave.month')}`,
      rate: '5%',
    },

    {
      value: '12',
      label: `12 ${t('formCreateSave.month')}`,
      rate: '5.5%',
    },
  ];

  const method_extend: MethodItem[] = [
    {
      value: '1',
      label: t('formCreateSave.renewalMethods.includeInterest'),
    },
    {
      value: '2',
      label: t('formCreateSave.renewalMethods.principalOnly'),
    },
    {
      value: '3',
      label: t('formCreateSave.renewalMethods.monthlyInterest'),
    },
  ];

  const method_pay: MethodItem[] = [
    {
      value: '1',
      label: t('formCreateSave.paymentMethods.online'),
    },
    {
      value: '2',
      label: t('formCreateSave.paymentMethods.counter'),
    },
  ];

  const [formData, setFormData] = useState<FormData>({
    value: undefined,
    selectedRate: undefined,
    methodExtend: undefined,
    method: undefined,
  });

  const handleOnchange = (field: keyof FormData, value: any): void => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };
  // console.log('Form data:', formData);

  // react query call api

  // const userId = 1;
  // const {data, status, error, isLoading} = useQuery({
  //   queryKey: ['users'],
  //   queryFn: () => getUsers(),
  //   onSuccess: data => {
  //     console.log('Successfully fetched users:', data);
  //   },
  //   onError: error => {
  //     Alert.alert('Error', 'Failed to fetch data. Please try again later.', [
  //       {text: 'OK'},
  //     ]);
  //   },
  //   retry: 2,
  //   staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
  // });

  // console.log('Data:', data);

  const submit = (e: GestureResponderEvent) => {
    e.preventDefault();
    console.log('Form data:', formData);
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

    rateText: {
      marginTop: 12,
      fontSize: 14,
      color: '#007BFF',
    },

    boxRate: {
      flexDirection: 'column',
      gap: 4,
    },

    textWhite: {
      color: 'white',
    },
    loadingContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(255,255,255,0.7)',
    },
  });

  return (
    <View>
      <View style={styles.boxInput}>
        <Text style={styles.headingTitle}>
          {t('formCreateSave.depositAmount')}
        </Text>
        <InputBackground
          value={formData.value ?? undefined}
          onChangeText={(value: string) => handleOnchange('value', value)}
          placeholder={t('formCreateSave.depositRange')}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.boxInput}>
        <Text style={styles.headingTitle}>{t('formCreateSave.termRate')}</Text>
        <DropdownComponent
          data={rates}
          placeholder={t('formCreateSave.selectTermRate')}
          value={formData.selectedRate?.value || undefined} // Add null fallback
          onChange={(value: RateItem) => handleOnchange('selectedRate', value)}
        />

        {formData.selectedRate ? (
          <View style={styles.boxRate}>
            <Text style={styles.rateText}>
              {currentLanguage === 'vi'
                ? `Lãi suất của kỳ hạn ${formData.selectedRate.label} là ${formData.selectedRate.rate}`
                : `Interest rate for ${formData.selectedRate.label} is ${formData.selectedRate.rate}`}
            </Text>
            <Text style={styles.rateText}>
              {`Tiền lời dự kiến kỳ hạn ${
                formData.selectedRate.label
              } là ${Math.round(
                ((Number(formData.value) *
                  parseFloat(formData.selectedRate.rate)) /
                  100 /
                  12) *
                  Number(formData.selectedRate.value),
              )}đ`}
            </Text>
          </View>
        ) : (
          <></>
        )}
      </View>

      <View style={styles.boxInput}>
        <Text style={styles.headingTitle}>
          {t('formCreateSave.renewalMethod')}
        </Text>

        <DropdownComponent
          data={method_extend}
          placeholder={t('formCreateSave.renewalOptions')}
          value={formData.methodExtend?.value}
          onChange={(value: MethodItem) =>
            handleOnchange('methodExtend', value)
          }
        />
      </View>

      <View style={styles.boxInput}>
        <Text style={styles.headingTitle}>
          {t('formCreateSave.paymentMethod')}
        </Text>
        <DropdownComponent
          data={method_pay}
          placeholder={t('formCreateSave.selectPaymentMethod')}
          value={formData.method?.value || undefined}
          onChange={(value: MethodItem) => handleOnchange('method', value)}
        />
      </View>
      <TouchableOpacity style={styles.btn} onPress={submit}>
        <Text
          style={[styles.textWhite, {fontWeight: 'bold', textAlign: 'center'}]}>
          {t('formCreateSave.submit')}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default FormCreateSave;
