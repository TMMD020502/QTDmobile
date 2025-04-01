import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
  TextInput,
  Alert,
  Modal,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';

import React, {useState, useRef, useEffect} from 'react';
import Header from '../components/Header/Header';
import {useTranslation} from 'react-i18next';
import {useTheme} from '../context/ThemeContext';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../navigators/RootNavigator';
import {AppIcons} from '../icons';
import {formatCurrency} from '../utils/formatCurrency';

type MobileTopUpNavigationProp = StackNavigationProp<
  RootStackParamList,
  'MobileTopUp'
>;

interface MobileTopUpProps {
  navigation: MobileTopUpNavigationProp;
}

interface NetworkProvider {
  id: string;
  name: string;
  icon: any;
}

interface TopUpAmount {
  id: string;
  amount: number;
  displayAmount: string;
}

interface PhoneHistoryItem {
  number: string;
  timestamp: string;
}

const MobileTopUp: React.FC<MobileTopUpProps> = ({navigation}) => {
  const {t} = useTranslation();
  const {theme} = useTheme();

  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [selectedProviderName, setSelectedProviderName] = useState<string>('');
  const [selectedAmount, setSelectedAmount] = useState<string | null>(null);
  const [providerModalVisible, setProviderModalVisible] =
    useState<boolean>(false);
  const [phoneModalVisible, setPhoneModalVisible] = useState<boolean>(false);

  const providerSlideAnim = useRef(new Animated.Value(0)).current;
  const phoneSlideAnim = useRef(new Animated.Value(0)).current;
  const screenHeight = Dimensions.get('window').height;

  useEffect(() => {
    if (providerModalVisible) {
      Animated.timing(providerSlideAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(providerSlideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [providerModalVisible, providerSlideAnim]);

  useEffect(() => {
    if (phoneModalVisible) {
      Animated.timing(phoneSlideAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(phoneSlideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [phoneModalVisible, phoneSlideAnim]);

  // Example history of phone numbers
  const phoneHistory: PhoneHistoryItem[] = [
    {number: '0987654321', timestamp: '02/07/2023'},
    {number: '0912345678', timestamp: '25/06/2023'},
    {number: '0978123456', timestamp: '18/06/2023'},
    {number: '0965432198', timestamp: '10/06/2023'},
    {number: '0909123456', timestamp: '05/06/2023'},
  ];

  // Custom Button Component
  const CustomButton: React.FC<{
    text: string;
    onPress: () => void;
    disabled?: boolean;
  }> = ({text, onPress, disabled = false}) => (
    <TouchableOpacity
      style={[
        styles.customButton,
        {
          backgroundColor: disabled ? theme.noteText : theme.buttonSubmit,
          opacity: disabled ? 0.6 : 1,
        },
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}>
      <Text style={styles.customButtonText}>{text}</Text>
    </TouchableOpacity>
  );

  // Example network providers
  const networkProviders: NetworkProvider[] = [
    {
      id: 'viettel',
      name: 'Viettel',
      icon: AppIcons.viettelIcon,
    },
    {
      id: 'mobifone',
      name: 'Mobifone',
      icon: AppIcons.mobifoneIcon,
    },
    {
      id: 'vinaphone',
      name: 'Vinaphone',
      icon: AppIcons.vinaphoneIcon,
    },
    {
      id: 'vietnamobile',
      name: 'Vietnamobile',
      icon: AppIcons.vietnamobileIcon,
    },
  ];

  // Predefined top-up amounts - removed the custom amount option
  const topUpAmounts: TopUpAmount[] = [
    {id: '1', amount: 10000, displayAmount: '10.000đ'},
    {id: '2', amount: 20000, displayAmount: '20.000đ'},
    {id: '3', amount: 50000, displayAmount: '50.000đ'},
    {id: '4', amount: 100000, displayAmount: '100.000đ'},
    {id: '5', amount: 200000, displayAmount: '200.000đ'},
    {id: '6', amount: 500000, displayAmount: '500.000đ'},
  ];

  const handleProviderSelect = (providerId: string) => {
    const provider = networkProviders.find(p => p.id === providerId);
    if (provider) {
      setSelectedProvider(providerId);
      setSelectedProviderName(provider.name);
      setProviderModalVisible(false);
    }
  };

  const handlePhoneSelect = (number: string) => {
    setPhoneNumber(number);
    setPhoneModalVisible(false);
  };

  const handleAmountSelect = (amountId: string) => {
    setSelectedAmount(amountId);
  };

  const handleTopUp = () => {
    if (!phoneNumber) {
      Alert.alert(t('mobileTopUp.error'), t('mobileTopUp.enterPhoneNumber'));
      return;
    }

    if (!selectedProvider) {
      Alert.alert(t('mobileTopUp.error'), t('mobileTopUp.selectProvider'));
      return;
    }

    if (!selectedAmount) {
      Alert.alert(t('mobileTopUp.error'), t('mobileTopUp.selectAmount'));
      return;
    }

    // Get the amount to be topped up - simplified as there's no custom amount anymore
    const amount =
      topUpAmounts.find(item => item.id === selectedAmount)?.amount || 0;

    // Navigate to confirmation screen or process payment
    Alert.alert(
      t('mobileTopUp.confirmTitle'),
      `${t('mobileTopUp.confirmTopUp')} ${formatCurrency(amount)} ${t(
        'mobileTopUp.toNumber',
      )} ${phoneNumber}?`,
      [
        {
          text: t('mobileTopUp.cancel'),
          style: 'cancel',
        },
        {
          text: t('mobileTopUp.confirm'),
          onPress: () => {
            // Process payment
            // For demo purposes, show success message
            Alert.alert(
              t('mobileTopUp.success'),
              `${t('mobileTopUp.successTopUp')} ${formatCurrency(amount)} ${t(
                'mobileTopUp.toNumber',
              )} ${phoneNumber}`,
              [
                {
                  text: 'OK',
                  onPress: () => navigation.navigate('Home'),
                },
              ],
            );
          },
        },
      ],
    );
  };

  const styles = StyleSheet.create({
    view: {
      flex: 1,
      backgroundColor: theme.background,
    },
    container: {
      width: '100%',
      height: '100%',
    },
    body: {
      flex: 1,
      paddingHorizontal: 20,
      marginTop: 12,
      paddingTop: 12,
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.text,
      marginBottom: 12,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.tableBorderColor,
      borderRadius: 8,
      backgroundColor: theme.backgroundBox,
      paddingHorizontal: 12,
      height: 50,
    },
    inputIcon: {
      width: 50,
      height: 50,
      marginRight: 8,
    },
    inputIconPhone: {
      width: 20,
      height: 20,
      marginRight: 8,
      tintColor: theme.iconColor,
    },
    input: {
      flex: 1,
      color: theme.text,
      fontSize: 16,
      padding: 0,
    },
    phoneSelectContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.tableBorderColor,
      borderRadius: 8,
      backgroundColor: theme.backgroundBox,
      paddingHorizontal: 12,
      height: 50,
    },
    phoneSelectText: {
      flex: 1,
      color: theme.text,
      fontSize: 16,
    },
    phoneSelectPlaceholder: {
      color: theme.noteText,
    },
    providerSelectContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.tableBorderColor,
      borderRadius: 8,
      backgroundColor: theme.backgroundBox,
      paddingHorizontal: 12,
      height: 50,
    },
    providerSelectText: {
      flex: 1,
      color: theme.text,
      fontSize: 16,
      marginLeft: selectedProvider ? 0 : 8, // Add left margin when no icon
    },
    providerSelectPlaceholder: {
      color: theme.noteText,
    },
    dropdownIcon: {
      width: 20,
      height: 20,
      tintColor: theme.noteText,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
    },
    modalContent: {
      backgroundColor: theme.background,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      padding: 20,
      paddingTop: 24,
      paddingBottom: 28,
      maxHeight: screenHeight * 0.7,
    },
    modalHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 16,
      paddingHorizontal: 4,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.text,
    },
    closeButton: {
      padding: 4,
    },
    closeIcon: {
      width: 24,
      height: 24,
      tintColor: theme.text,
    },
    providerItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 8,
      borderBottomWidth: 1,
      borderBottomColor: theme.tableBorderColor,
    },
    providerIcon: {
      width: 50,
      height: 50,
      marginRight: 12,
    },
    providerName: {
      fontSize: 16,
      color: theme.text,
    },
    phoneItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.tableBorderColor,
    },
    phoneItemLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    phoneNumber: {
      fontSize: 16,
      color: theme.text,
      fontWeight: '500',
    },
    phoneDate: {
      fontSize: 12,
      color: theme.noteText,
      marginTop: 4,
    },
    phoneIcon: {
      width: 20,
      height: 20,
      marginRight: 12,
      tintColor: theme.iconColor,
    },
    providersGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    providerItem2: {
      width: '48%',
      borderWidth: 1,
      borderRadius: 8,
      padding: 12,
      marginBottom: 12,
      alignItems: 'center',
      flexDirection: 'row',
    },
    selectedProvider: {
      borderColor: theme.buttonSubmit,
      backgroundColor: theme.buttonSubmit + '10',
    },
    unselectedProvider: {
      borderColor: theme.tableBorderColor,
      backgroundColor: theme.backgroundBox,
    },
    amountsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    amountItem: {
      width: '31%',
      borderWidth: 1,
      borderRadius: 8,
      padding: 12,
      marginBottom: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },
    selectedAmount: {
      borderColor: theme.buttonSubmit,
      backgroundColor: theme.buttonSubmit + '10',
    },
    unselectedAmount: {
      borderColor: theme.tableBorderColor,
      backgroundColor: theme.backgroundBox,
    },
    amountText: {
      fontSize: 14,
      fontWeight: '500',
      color: theme.text,
      textAlign: 'center',
    },
    bottomContainer: {
      padding: 20,
      borderTopWidth: 1,
      borderTopColor: theme.tableBorderColor,
    },
    totalSection: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
      paddingTop: 16,
      borderTopWidth: 1,
      borderTopColor: theme.tableBorderColor,
    },
    totalLabel: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.text,
    },
    totalAmount: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.buttonSubmit,
    },
    customButton: {
      borderRadius: 8,
      paddingVertical: 14,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: theme.text,
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    customButtonText: {
      color: theme.textButtonSubmit,
      fontSize: 16,
      fontWeight: '600',
      letterSpacing: 0.5,
    },
    error: {
      color: theme.error,
      fontSize: 12,
      marginTop: 4,
    },
    recentNumber: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.tableBorderColor,
      borderRadius: 8,
      backgroundColor: theme.backgroundBox,
      paddingHorizontal: 12,
      paddingVertical: 10,
      marginTop: 8,
    },
    recentNumberText: {
      fontSize: 14,
      color: theme.text,
      flex: 1,
    },
    recentNumberIcon: {
      width: 16,
      height: 16,
      tintColor: theme.iconColor,
    },
    phoneSearchContainer: {
      borderWidth: 1,
      borderColor: theme.tableBorderColor,
      borderRadius: 8,
      backgroundColor: theme.backgroundBox,
      paddingHorizontal: 12,
      height: 50,
      marginBottom: 16,
      flexDirection: 'row',
      alignItems: 'center',
    },
    phoneSearchIcon: {
      width: 20,
      height: 20,
      tintColor: theme.noteText,
      marginRight: 8,
    },
    phoneSearchInput: {
      flex: 1,
      color: theme.text,
      fontSize: 16,
      padding: 0,
    },
  });

  const getDisplayAmount = () => {
    if (selectedAmount) {
      const selectedOption = topUpAmounts.find(
        item => item.id === selectedAmount,
      );
      return selectedOption?.displayAmount || '0đ';
    }
    return '0đ';
  };

  // Button disabled state - update to remove custom amount check
  const isTopUpButtonDisabled =
    !phoneNumber || !selectedProvider || !selectedAmount;

  // Modal slide-up animations
  const providerTranslateY = providerSlideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [screenHeight, 0],
  });

  const phoneTranslateY = phoneSlideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [screenHeight, 0],
  });

  return (
    <SafeAreaView style={styles.view}>
      <View style={styles.container}>
        {/* Heading */}
        <Header Navbar="MobileTopUp" navigation={navigation} />

        {/* Body */}
        <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
          {/* Phone Number Input - Modified to use touchable component */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('mobileTopUp.phoneNumber')}
            </Text>
            <TouchableOpacity
              style={styles.phoneSelectContainer}
              onPress={() => setPhoneModalVisible(true)}>
              {/* Only show phone icon when a number is selected */}
              {phoneNumber ? (
                <Image source={AppIcons.phone} style={styles.inputIconPhone} />
              ) : null}
              <Text
                style={[
                  styles.phoneSelectText,
                  !phoneNumber && styles.phoneSelectPlaceholder,
                  !phoneNumber && {marginLeft: 8}, // Add left margin when no icon
                ]}>
                {phoneNumber || t('mobileTopUp.enterPhoneNumber')}
              </Text>
              <Image
                source={AppIcons.arrowDownIcon || AppIcons.downIcon}
                style={styles.dropdownIcon}
              />
            </TouchableOpacity>
          </View>

          {/* Network Provider Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('mobileTopUp.selectProvider')}
            </Text>
            <TouchableOpacity
              style={styles.providerSelectContainer}
              onPress={() => setProviderModalVisible(true)}>
              {/* Only show provider icon when one is selected */}
              {selectedProvider ? (
                <Image
                  source={
                    networkProviders.find(p => p.id === selectedProvider)?.icon
                  }
                  style={styles.inputIcon}
                />
              ) : null}
              <Text
                style={[
                  styles.providerSelectText,
                  !selectedProvider && styles.providerSelectPlaceholder,
                ]}>
                {selectedProviderName || t('mobileTopUp.tapToSelectProvider')}
              </Text>
              <Image
                source={AppIcons.arrowDownIcon || AppIcons.downIcon}
                style={styles.dropdownIcon}
              />
            </TouchableOpacity>
          </View>

          {/* Top-up Amount Selection - simplified with no custom amount */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('mobileTopUp.selectAmount')}
            </Text>
            <View style={styles.amountsGrid}>
              {topUpAmounts.map(amount => (
                <TouchableOpacity
                  key={amount.id}
                  style={[
                    styles.amountItem,
                    selectedAmount === amount.id
                      ? styles.selectedAmount
                      : styles.unselectedAmount,
                  ]}
                  onPress={() => handleAmountSelect(amount.id)}>
                  <Text style={styles.amountText}>{amount.displayAmount}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Remove the custom amount input */}
          </View>

          {/* Total Section */}
          <View style={styles.totalSection}>
            <Text style={styles.totalLabel}>{t('mobileTopUp.total')}</Text>
            <Text style={styles.totalAmount}>{getDisplayAmount()}</Text>
          </View>
        </ScrollView>

        {/* Bottom Button */}
        <View style={styles.bottomContainer}>
          <CustomButton
            text={t('mobileTopUp.topUp')}
            onPress={handleTopUp}
            disabled={isTopUpButtonDisabled}
          />
        </View>

        {/* Provider Selection Modal */}
        <Modal
          animationType="none"
          transparent={true}
          visible={providerModalVisible}
          onRequestClose={() => setProviderModalVisible(false)}>
          <TouchableWithoutFeedback
            onPress={() => setProviderModalVisible(false)}>
            <View style={styles.modalOverlay}>
              <TouchableWithoutFeedback>
                <Animated.View
                  style={[
                    styles.modalContent,
                    {transform: [{translateY: providerTranslateY}]},
                  ]}>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>
                      {t('mobileTopUp.selectProvider')}
                    </Text>
                    <TouchableOpacity
                      style={styles.closeButton}
                      onPress={() => setProviderModalVisible(false)}>
                      <Image
                        source={AppIcons.closeIcon || AppIcons.crossIcon}
                        style={styles.closeIcon}
                      />
                    </TouchableOpacity>
                  </View>
                  <ScrollView>
                    {networkProviders.map(provider => (
                      <TouchableOpacity
                        key={provider.id}
                        style={[
                          styles.providerItem,
                          selectedProvider === provider.id &&
                            styles.selectedProvider,
                        ]}
                        onPress={() => handleProviderSelect(provider.id)}>
                        <Image
                          source={provider.icon}
                          style={styles.providerIcon}
                        />
                        <Text style={styles.providerName}>{provider.name}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </Animated.View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        {/* Phone Number History Modal */}
        <Modal
          animationType="none"
          transparent={true}
          visible={phoneModalVisible}
          onRequestClose={() => setPhoneModalVisible(false)}>
          <TouchableWithoutFeedback onPress={() => setPhoneModalVisible(false)}>
            <View style={styles.modalOverlay}>
              <TouchableWithoutFeedback>
                <Animated.View
                  style={[
                    styles.modalContent,
                    {transform: [{translateY: phoneTranslateY}]},
                  ]}>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>
                      {t('mobileTopUp.recentPhoneNumbers')}
                    </Text>
                    <TouchableOpacity
                      style={styles.closeButton}
                      onPress={() => setPhoneModalVisible(false)}>
                      <Image
                        source={AppIcons.closeIcon || AppIcons.crossIcon}
                        style={styles.closeIcon}
                      />
                    </TouchableOpacity>
                  </View>

                  {/* Search bar in phone history modal */}
                  <View style={styles.phoneSearchContainer}>
                    <Image
                      source={AppIcons.searchIcon}
                      style={styles.phoneSearchIcon}
                    />
                    <TextInput
                      style={styles.phoneSearchInput}
                      placeholder={t('mobileTopUp.searchPhoneNumbers')}
                      placeholderTextColor={theme.noteText}
                      onChangeText={text => setPhoneNumber(text)}
                      keyboardType="phone-pad"
                    />
                  </View>

                  <ScrollView>
                    {phoneHistory.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.phoneItem}
                        onPress={() => handlePhoneSelect(item.number)}>
                        <View style={styles.phoneItemLeft}>
                          <Image
                            source={AppIcons.phone}
                            style={styles.phoneIcon}
                          />
                          <View>
                            <Text style={styles.phoneNumber}>
                              {item.number}
                            </Text>
                            <Text style={styles.phoneDate}>
                              {item.timestamp}
                            </Text>
                          </View>
                        </View>
                        {phoneNumber === item.number && (
                          <Image
                            source={AppIcons.checkIcon || AppIcons.tickIcon}
                            style={{
                              width: 20,
                              height: 20,
                              tintColor: theme.buttonSubmit,
                            }}
                          />
                        )}
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </Animated.View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

export default MobileTopUp;
