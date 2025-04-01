import React, {useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useTheme} from '../context/ThemeContext';
import Header from '../components/Header/Header';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../navigators/RootNavigator';
import {AppIcons} from '../icons';

type ElectricityBillNavigationProp = StackNavigationProp<
  RootStackParamList,
  'ElectricityBill'
>;

interface ElectricityBillProps {
  navigation: ElectricityBillNavigationProp;
}

// Fixed electricity provider
const FIXED_PROVIDER = {
  id: '1',
  name: 'Tập đoàn điện lực Việt Nam',
  icon: AppIcons.evn,
};

const ElectricityBill: React.FC<ElectricityBillProps> = ({navigation}) => {
  const {t} = useTranslation();
  const {theme} = useTheme();

  // Form state
  const [customerCode, setCustomerCode] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>('');
  const [billPeriod, setBillPeriod] = useState<string>('');
  const [customerAddress, setCustomerAddress] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [customerFound, setCustomerFound] = useState<boolean>(false);

  // Handle look up customer information
  const handleLookupCustomer = () => {
    // Validate fields before lookup
    if (!customerCode || customerCode.length < 5) {
      setErrors({
        ...errors,
        customerCode: t('electricityBill.invalidCustomerCode'),
      });
      return;
    }

    // Reset previous errors
    setErrors({});

    // Show loading state
    setIsLoading(true);
    setCustomerFound(false);

    // Simulate API response with mock data
    setTimeout(() => {
      setIsLoading(false);

      // Simulate customer found
      setCustomerName('Nguyen Van A');
      setBillPeriod('05/2023');
      setAmount('450000');
      setCustomerAddress('123 Le Loi St., District 1, Ho Chi Minh City');
      setCustomerFound(true);
    }, 1000);
  };

  // Reset form
  const resetForm = () => {
    setCustomerCode('');
    setCustomerName('');
    setBillPeriod('');
    setAmount('');
    setCustomerAddress('');
    setErrors({});
    setCustomerFound(false);
  };

  // Validate and proceed to payment
  const handlePayment = () => {
    const newErrors: Record<string, string> = {};

    if (!customerCode)
      newErrors.customerCode = t('electricityBill.requiredField');
    if (!amount) newErrors.amount = t('electricityBill.requiredField');

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Navigate to payment confirmation or processing screen
    Alert.alert(
      t('electricityBill.confirmPayment'),
      t('electricityBill.confirmPaymentMessage', {
        amount: formatCurrency(amount),
      }),
      [
        {
          text: t('electricityBill.cancel'),
          style: 'cancel',
        },
        {
          text: t('electricityBill.confirm'),
          onPress: () => {
            // Show loading state
            setIsLoading(true);

            // Simulate payment processing
            setTimeout(() => {
              setIsLoading(false);
              Alert.alert(
                t('electricityBill.paymentSuccess'),
                t('electricityBill.paymentProcessed'),
              );
              resetForm();
            }, 1500);
          },
        },
      ],
    );
  };

  const formatCurrency = (value: string) => {
    // Remove non-numeric characters
    const numericValue = value.replace(/[^0-9]/g, '');

    // Format with commas as thousand separators
    if (numericValue) {
      return Number(numericValue).toLocaleString('en-US');
    }
    return '';
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    content: {
      flex: 1,
      padding: 20,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 16,
      marginTop: 16,
    },
    formGroup: {
      marginBottom: 16,
    },
    inputRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    label: {
      fontSize: 14,
      color: theme.noteText,
      marginBottom: 6,
    },
    input: {
      height: 48,
      borderWidth: 1,
      borderColor: theme.tableBorderColor,
      borderRadius: 8,
      paddingHorizontal: 12,
      backgroundColor: theme.backgroundBox,
      color: theme.text,
      flex: 1,
    },
    inputDisabled: {
      backgroundColor: theme.backgroundBox,
      opacity: 0.7,
    },
    lookupButton: {
      height: 48,
      backgroundColor: theme.buttonSubmit,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 16,
      marginLeft: 8,
    },
    lookupButtonText: {
      color: theme.textButtonSubmit,
      fontWeight: '500',
    },
    errorText: {
      color: theme.error,
      fontSize: 12,
      marginTop: 4,
    },
    paymentSection: {
      backgroundColor: theme.backgroundBox,
      borderRadius: 12,
      padding: 16,
      marginBottom: 24,
    },
    amountRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 8,
      alignItems: 'center',
    },
    amountLabel: {
      fontSize: 16,
      color: theme.text,
    },
    amount: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.text,
    },
    feeRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 16,
      alignItems: 'center',
    },
    feeLabel: {
      fontSize: 14,
      color: theme.noteText,
    },
    fee: {
      fontSize: 14,
      color: theme.noteText,
    },
    divider: {
      height: 1,
      backgroundColor: theme.tableBorderColor,
      marginVertical: 12,
    },
    totalRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    totalLabel: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.text,
    },
    totalAmount: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.profit,
    },
    payButton: {
      height: 56,
      backgroundColor: theme.buttonSubmit,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 24,
    },
    payButtonText: {
      color: theme.textButtonSubmit,
      fontSize: 16,
      fontWeight: 'bold',
    },
    disabledButton: {
      opacity: 0.6,
    },
    providerDisplay: {
      height: 48,
      borderWidth: 1,
      borderColor: theme.tableBorderColor,
      borderRadius: 8,
      paddingHorizontal: 12,
      backgroundColor: theme.backgroundBox,
      color: theme.text,
      flexDirection: 'row',
      alignItems: 'center',
    },
    providerIcon: {
      width: 30,
      height: 30,
      marginRight: 8,
    },
    providerText: {
      color: theme.text,
      flex: 1,
    },
    loaderContainer: {
      backgroundColor: theme.background,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 16,
      borderRadius: 8,
      marginVertical: 8,
    },
    customerInfoSection: {
      backgroundColor: theme.backgroundBox,
      padding: 16,
      borderRadius: 12,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: theme.tableBorderColor,
    },
    customerInfoRow: {
      flexDirection: 'row',
      marginBottom: 8,
    },
    customerInfoLabel: {
      width: 120,
      color: theme.noteText,
      fontSize: 14,
    },
    customerInfoValue: {
      flex: 1,
      color: theme.text,
      fontSize: 14,
      fontWeight: '500',
    },
  });

  // Calculate service fee and total amount
  const serviceFee = 3000; // Fixed service fee
  const numericAmount = parseInt(amount.replace(/[^0-9]/g, '') || '0', 10);
  const total = numericAmount + serviceFee;
  const isFormValid = customerFound && customerCode && amount;

  return (
    <SafeAreaView style={styles.container}>
      <Header Navbar="ElectricityBill" navigation={navigation} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1}}>
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionTitle}>
            {t('electricityBill.customerInfo')}
          </Text>

          {/* Fixed Electricity Provider Display */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>
              {t('electricityBill.electricityProvider')}
            </Text>
            <View style={styles.providerDisplay}>
              <Image
                source={FIXED_PROVIDER.icon}
                style={styles.providerIcon}
                resizeMode="contain"
              />
              <Text style={styles.providerText}>{FIXED_PROVIDER.name}</Text>
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>
              {t('electricityBill.customerCode')}
            </Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                value={customerCode}
                onChangeText={setCustomerCode}
                placeholder={t('electricityBill.enterCustomerCode')}
                placeholderTextColor={theme.noteText}
                keyboardType="numeric"
              />
              <TouchableOpacity
                style={[
                  styles.lookupButton,
                  isLoading && styles.disabledButton,
                ]}
                onPress={handleLookupCustomer}
                disabled={isLoading}>
                <Text style={styles.lookupButtonText}>
                  {t('electricityBill.lookup')}
                </Text>
              </TouchableOpacity>
            </View>
            {errors.customerCode ? (
              <Text style={styles.errorText}>{errors.customerCode}</Text>
            ) : null}
          </View>

          {/* Loading indicator */}
          {isLoading && (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color={theme.buttonSubmit} />
            </View>
          )}

          {/* Customer information section - only show when customer is found */}
          {customerFound && (
            <>
              {/* Customer details section */}
              <View style={styles.customerInfoSection}>
                <View style={styles.customerInfoRow}>
                  <Text style={styles.customerInfoLabel}>
                    {t('electricityBill.customerName')}:
                  </Text>
                  <Text style={styles.customerInfoValue}>{customerName}</Text>
                </View>

                <View style={styles.customerInfoRow}>
                  <Text style={styles.customerInfoLabel}>
                    {t('electricityBill.address')}:
                  </Text>
                  <Text style={styles.customerInfoValue}>
                    {customerAddress}
                  </Text>
                </View>

                <View style={styles.customerInfoRow}>
                  <Text style={styles.customerInfoLabel}>
                    {t('electricityBill.period')}:
                  </Text>
                  <Text style={styles.customerInfoValue}>{billPeriod}</Text>
                </View>
              </View>

              {/* Payment details section */}
              <Text style={styles.sectionTitle}>
                {t('electricityBill.paymentDetails')}
              </Text>

              <View style={styles.paymentSection}>
                <View style={styles.amountRow}>
                  <Text style={styles.amountLabel}>
                    {t('electricityBill.billAmount')}
                  </Text>
                  <Text style={styles.amount}>
                    {formatCurrency(amount)} VND
                  </Text>
                </View>

                <View style={styles.feeRow}>
                  <Text style={styles.feeLabel}>
                    {t('electricityBill.serviceFee')}
                  </Text>
                  <Text style={styles.fee}>
                    {serviceFee.toLocaleString()} VND
                  </Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>
                    {t('electricityBill.totalAmount')}
                  </Text>
                  <Text style={styles.totalAmount}>
                    {total.toLocaleString()} VND
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={[
                  styles.payButton,
                  (!isFormValid || isLoading) && styles.disabledButton,
                ]}
                onPress={handlePayment}
                disabled={!isFormValid || isLoading}>
                <Text style={styles.payButtonText}>
                  {t('electricityBill.pay')}
                </Text>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ElectricityBill;
