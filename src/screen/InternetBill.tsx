import React, {useState, useRef, useEffect} from 'react';
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
  Modal,
  FlatList,
  ActivityIndicator,
  Image,
  Animated,
  Easing,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useTheme} from '../context/ThemeContext';
import Header from '../components/Header/Header';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../navigators/RootNavigator';
import {AppIcons} from '../icons';

type InternetBillNavigationProp = StackNavigationProp<
  RootStackParamList,
  'InternetBill'
>;

interface InternetBillProps {
  navigation: InternetBillNavigationProp;
}

interface InternetProvider {
  id: string;
  name: string;
  icon: any; // Icon property
}

const InternetBill: React.FC<InternetBillProps> = ({navigation}) => {
  const {t} = useTranslation();
  const {theme} = useTheme();
  const modalRef = useRef<Animated.Value>(
    new Animated.Value(Dimensions.get('window').height),
  );

  // Form state
  const [customerCode, setCustomerCode] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>('');
  const [billPeriod, setBillPeriod] = useState<string>('');
  const [customerAddress, setCustomerAddress] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedProvider, setSelectedProvider] =
    useState<InternetProvider | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [customerFound, setCustomerFound] = useState<boolean>(false);

  // Internet providers with icons
  const internetProviders: InternetProvider[] = [
    {
      id: '1',
      name: 'VNPT',
      icon: AppIcons.vnpt,
    },
    {
      id: '2',
      name: 'Viettel Telecom',
      icon: AppIcons.viettelTele,
    },
    {
      id: '3',
      name: 'FPT Telecom',
      icon: AppIcons.fpt,
    },

  ];

  // Handle look up customer information
  const handleLookupCustomer = () => {
    // Validate fields before lookup
    if (!customerCode || customerCode.length < 5) {
      setErrors({
        ...errors,
        customerCode: t('internetBill.invalidCustomerCode'),
      });
      return;
    }

    if (!selectedProvider) {
      setErrors({
        ...errors,
        provider: t('internetBill.selectProviderRequired'),
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
      setAmount('399000');
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
    setSelectedProvider(null);
    setErrors({});
    setCustomerFound(false);
  };

  // Validate and proceed to payment
  const handlePayment = () => {
    const newErrors: Record<string, string> = {};

    if (!customerCode) newErrors.customerCode = t('internetBill.requiredField');
    if (!selectedProvider)
      newErrors.provider = t('internetBill.selectProviderRequired');
    if (!amount) newErrors.amount = t('internetBill.requiredField');

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Navigate to payment confirmation or processing screen
    Alert.alert(
      t('internetBill.confirmPayment'),
      t('internetBill.confirmPaymentMessage', {
        amount: formatCurrency(amount),
      }),
      [
        {
          text: t('internetBill.cancel'),
          style: 'cancel',
        },
        {
          text: t('internetBill.confirm'),
          onPress: () => {
            // Show loading state
            setIsLoading(true);

            // Simulate payment processing
            setTimeout(() => {
              setIsLoading(false);
              Alert.alert(
                t('internetBill.paymentSuccess'),
                t('internetBill.paymentProcessed'),
              );
              resetForm();
            }, 1500);
          },
        },
      ],
    );
  };

  // Modal animation
  const showModal = () => {
    setModalVisible(true);
    Animated.timing(modalRef.current, {
      toValue: 0,
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  const hideModal = () => {
    Animated.timing(modalRef.current, {
      toValue: Dimensions.get('window').height,
      duration: 300,
      easing: Easing.in(Easing.ease),
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false);
    });
  };

  // Update animation value when screen dimensions change
  useEffect(() => {
    const updateLayout = () => {
      if (!modalVisible) {
        modalRef.current.setValue(Dimensions.get('window').height);
      }
    };

    Dimensions.addEventListener('change', updateLayout);
    // return () => {
    //   // Cleanup for newer React Native versions
    //   if (Dimensions.removeEventListener) {
    //     Dimensions.removeEventListener('change', updateLayout);
    //   }
    // };
  }, [modalVisible]);

  const selectProvider = (provider: InternetProvider) => {
    setSelectedProvider(provider);
    hideModal();
    setErrors({...errors, provider: ''});
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
    providerSelector: {
      height: 48,
      borderWidth: 1,
      borderColor: theme.tableBorderColor,
      borderRadius: 8,
      paddingHorizontal: 12,
      backgroundColor: theme.backgroundBox,
      color: theme.text,
      justifyContent: 'center',
      flexDirection: 'row',
      alignItems: 'center',
    },
    providerIcon: {
      width: 24,
      height: 24,
      marginRight: 8,
    },
    providerSelectorText: {
      color: theme.text,
      flex: 1,
    },
    providerPlaceholderText: {
      color: theme.noteText,
      flex: 1,
    },
    modalContainer: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
      margin: 0,
    },
    modalContent: {
      backgroundColor: theme.backgroundBox,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      padding: 16,
      paddingTop: 20,
      maxHeight: '70%',
      position: 'relative',
    },
    modalTitleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 16,
      position: 'relative',
      height: 40,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.text,
      textAlign: 'center',
    },
    closeIconContainer: {
      position: 'absolute',
      right: 0,
      top: 0,
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 10,
    },
    closeIcon: {
      width: 20,
      height: 20,
      tintColor: theme.text,
    },
    providerItem: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.tableBorderColor,
      flexDirection: 'row',
      alignItems: 'center',
    },
    providerItemIcon: {
      width: 32,
      height: 32,
      marginRight: 12,
    },
    providerItemText: {
      color: theme.text,
      fontSize: 16,
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
  const isFormValid =
    customerFound && customerCode && selectedProvider && amount;

  return (
    <SafeAreaView style={styles.container}>
      <Header Navbar="InternetBill" navigation={navigation} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1}}>
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionTitle}>
            {t('internetBill.customerInfo')}
          </Text>

          {/* Internet Provider Selection */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>
              {t('internetBill.internetProvider')}
            </Text>
            <TouchableOpacity
              style={styles.providerSelector}
              onPress={showModal}>
              {selectedProvider ? (
                <>
                  <Image
                    source={selectedProvider.icon}
                    style={styles.providerIcon}
                    resizeMode="contain"
                  />
                  <Text style={styles.providerSelectorText}>
                    {selectedProvider.name}
                  </Text>
                </>
              ) : (
                <Text style={styles.providerPlaceholderText}>
                  {t('internetBill.selectProvider')}
                </Text>
              )}
            </TouchableOpacity>
            {errors.provider ? (
              <Text style={styles.errorText}>{errors.provider}</Text>
            ) : null}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>{t('internetBill.customerCode')}</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                value={customerCode}
                onChangeText={setCustomerCode}
                placeholder={t('internetBill.enterCustomerCode')}
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
                  {t('internetBill.lookup')}
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
                    {t('internetBill.customerName')}:
                  </Text>
                  <Text style={styles.customerInfoValue}>{customerName}</Text>
                </View>

                <View style={styles.customerInfoRow}>
                  <Text style={styles.customerInfoLabel}>
                    {t('internetBill.address')}:
                  </Text>
                  <Text style={styles.customerInfoValue}>
                    {customerAddress}
                  </Text>
                </View>

                <View style={styles.customerInfoRow}>
                  <Text style={styles.customerInfoLabel}>
                    {t('internetBill.period')}:
                  </Text>
                  <Text style={styles.customerInfoValue}>{billPeriod}</Text>
                </View>
              </View>

              {/* Payment details section */}
              <Text style={styles.sectionTitle}>
                {t('internetBill.paymentDetails')}
              </Text>

              <View style={styles.paymentSection}>
                <View style={styles.amountRow}>
                  <Text style={styles.amountLabel}>
                    {t('internetBill.billAmount')}
                  </Text>
                  <Text style={styles.amount}>
                    {formatCurrency(amount)} VND
                  </Text>
                </View>

                <View style={styles.feeRow}>
                  <Text style={styles.feeLabel}>
                    {t('internetBill.serviceFee')}
                  </Text>
                  <Text style={styles.fee}>
                    {serviceFee.toLocaleString()} VND
                  </Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>
                    {t('internetBill.totalAmount')}
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
                  {t('internetBill.pay')}
                </Text>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Internet Provider Selection Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="none"
        statusBarTranslucent={true}
        onRequestClose={hideModal}>
        <TouchableWithoutFeedback onPress={hideModal}>
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback onPress={e => e.stopPropagation()}>
              <Animated.View
                style={[
                  styles.modalContent,
                  {transform: [{translateY: modalRef.current}]},
                ]}>
                {/* Header with centered title and close button */}
                <View style={styles.modalTitleContainer}>
                  <Text style={styles.modalTitle}>
                    {t('internetBill.selectInternetProvider')}
                  </Text>

                  <TouchableOpacity
                    style={styles.closeIconContainer}
                    onPress={hideModal}
                    hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
                    <Image
                      source={AppIcons.closeIcon}
                      style={styles.closeIcon}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                </View>

                <FlatList
                  data={internetProviders}
                  keyExtractor={item => item.id}
                  renderItem={({item}) => (
                    <TouchableOpacity
                      style={styles.providerItem}
                      onPress={() => selectProvider(item)}>
                      <Image
                        source={item.icon}
                        style={styles.providerItemIcon}
                        resizeMode="contain"
                      />
                      <Text style={styles.providerItemText}>{item.name}</Text>
                    </TouchableOpacity>
                  )}
                  showsVerticalScrollIndicator={false}
                />
              </Animated.View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
};

export default InternetBill;
