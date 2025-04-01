import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
  Modal,
  Alert,
} from 'react-native';

import React from 'react';
import Header from '../components/Header/Header';
import {useTranslation} from 'react-i18next';
import {useTheme} from '../context/ThemeContext';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../navigators/RootNavigator';
import {AppIcons} from '../icons';

type ServicesNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Services'
>;

interface ServicesProps {
  navigation: ServicesNavigationProp;
}

interface ServiceOption {
  id: string;
  title: string;
  icon: any;
  backgroundColor: string;
  screen: keyof RootStackParamList | string;
}

const Services: React.FC<ServicesProps> = ({navigation}) => {
  const {t, i18n} = useTranslation();
  const {theme} = useTheme();

  // Get current language for conditional rendering
  const currentLanguage = i18n.language;
  const isEnglish = currentLanguage.startsWith('en');

  // Mock promotions count - this would normally come from an API or context
  const [promotionsCount, setPromotionsCount] = React.useState<number>(3);
  const [showDevMessage, setShowDevMessage] = React.useState<boolean>(false);
  const [devMessageTitle, setDevMessageTitle] = React.useState<string>('');

  // Define service options with theme-aware colors
  const serviceOptions: ServiceOption[] = [
    {
      id: '1',
      title: t('services.mobileTopUp'),
      icon: AppIcons.phone,
      backgroundColor: theme.buttonSubmit,
      screen: 'MobileTopUp',
    },
    {
      id: '2',
      title: t('services.waterBill'),
      icon: AppIcons.waterIcon,
      backgroundColor: theme.tabBarActive,
      screen: 'WaterBill',
    },
    {
      id: '3',
      title: t('services.electricityBill'),
      icon: AppIcons.electricityIcon,
      backgroundColor: theme.interest,
      screen: 'ElectricityBill',
    },
    {
      id: '4',
      title: t('services.internetBill'),
      icon: AppIcons.internetIcon,
      backgroundColor: theme.textActive,
      screen: 'InternetBill',
    },
    {
      id: '5',
      title: t('services.insurance'),
      icon: AppIcons.insuranceIcon,
      backgroundColor: theme.profit,
      screen: 'Insurance',
    },
    {
      id: '6',
      title: t('services.tuitionFee'),
      icon: AppIcons.educationIcon,
      backgroundColor: theme.error,
      screen: 'TuitionFee',
    },
  ];

  const handleServicePress = (service: ServiceOption) => {
    // Check if the service is under development
    if (service.screen === 'Insurance' || service.screen === 'TuitionFee') {
      setDevMessageTitle(service.title);
      setShowDevMessage(true);
    } else {
      // Navigate to the appropriate screen
      navigation.navigate(service.screen as keyof RootStackParamList);
    }
  };

  const handleOpenPromotions = () => {
    navigation.navigate('Promotions' as keyof RootStackParamList);
  };

  // Development message texts
  const developmentMessage = isEnglish
    ? 'This feature is under development and will be available soon.'
    : 'Tính năng này đang được phát triển và sẽ sớm ra mắt.';

  const closeButtonText = isEnglish ? 'Close' : 'Đóng';

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
      paddingHorizontal: 16,
      paddingTop: 16,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 16,
    },
    servicesGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    serviceItem: {
      width: '31%',
      aspectRatio: 0.9,
      borderRadius: 12,
      marginBottom: 14,
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 1,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 3,
      shadowOffset: {
        width: 0,
        height: 1,
      },
    },
    iconContainer: {
      width: 50,
      height: 50,
      borderRadius: 25,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 8,
    },
    serviceIcon: {
      width: 28,
      height: 28,
      resizeMode: 'contain',
    },
    serviceTitle: {
      fontSize: 12,
      fontWeight: '500',
      textAlign: 'center',
      paddingHorizontal: 4,
    },
    promotionBanner: {
      backgroundColor: theme.backgroundBox,
      borderRadius: 12,
      marginBottom: 24,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: theme.tableBorderColor,
    },
    promotionContent: {
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    promotionInfo: {
      flex: 1,
      marginRight: 12,
    },
    promotionTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 4,
    },
    promotionText: {
      fontSize: 13,
      color: theme.noteText,
      marginBottom: 12,
    },
    promotionBadge: {
      backgroundColor: theme.buttonSubmit,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 4,
      alignSelf: 'flex-start',
      flexDirection: 'row',
      alignItems: 'center',
    },
    promotionBadgeText: {
      color: theme.textButtonSubmit, // Use theme's button text color
      fontSize: 12,
      fontWeight: '500',
    },
    promotionIconBox: {
      width: 50,
      height: 50,
      borderRadius: 10,
      backgroundColor: theme.buttonSubmit + '20', // Using opacity with theme color
      justifyContent: 'center',
      alignItems: 'center',
    },
    promotionIconImage: {
      width: 28,
      height: 28,
      resizeMode: 'contain',
      tintColor: theme.buttonSubmit, // Use theme color instead of hardcoded
    },
    developmentModal: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    developmentBox: {
      width: '80%',
      backgroundColor: theme.backgroundBox,
      borderRadius: 12,
      padding: 20,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    developmentTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 12,
    },
    developmentText: {
      fontSize: 14,
      color: theme.noteText,
      textAlign: 'center',
      marginBottom: 16,
    },
    closeButton: {
      backgroundColor: theme.buttonSubmit,
      paddingHorizontal: 24,
      paddingVertical: 10,
      borderRadius: 8,
    },
    closeButtonText: {
      color: theme.textButtonSubmit,
      fontSize: 14,
      fontWeight: '500',
    },
  });

  return (
    <SafeAreaView style={styles.view}>
      <View style={styles.container}>
        {/* Heading */}
        <Header Navbar="Services" navigation={navigation} />

        {/* Body */}
        <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
          {/* Simplified Promotion Banner */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleOpenPromotions}
            style={styles.promotionBanner}>
            <View style={styles.promotionContent}>
              <View style={styles.promotionInfo}>
                <Text style={styles.promotionTitle}>
                  {t('services.specialOffers')}
                </Text>
                <Text style={styles.promotionText}>
                  {t('services.checkPromotions')}
                </Text>
                <View style={styles.promotionBadge}>
                  <Text style={styles.promotionBadgeText}>
                    {promotionsCount} {t('services.available')}
                  </Text>
                </View>
              </View>
              <View style={styles.promotionIconBox}>
                <Image
                  source={AppIcons.promotionsIcon}
                  style={styles.promotionIconImage}
                />
              </View>
            </View>
          </TouchableOpacity>

          {/* Services Section */}
          <Text style={styles.sectionTitle}>{t('services.title')}</Text>

          <View style={styles.servicesGrid}>
            {serviceOptions.map(service => (
              <TouchableOpacity
                key={service.id}
                style={[
                  styles.serviceItem,
                  {backgroundColor: theme.backgroundBox},
                ]}
                onPress={() => handleServicePress(service)}>
                <View
                  style={[
                    styles.iconContainer,
                    {backgroundColor: service.backgroundColor + '20'},
                  ]}>
                  <Image
                    source={service.icon}
                    style={[
                      styles.serviceIcon,
                      {tintColor: service.backgroundColor},
                    ]}
                  />
                </View>
                <Text style={[styles.serviceTitle, {color: theme.text}]}>
                  {service.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Development Modal */}
        <Modal
          visible={showDevMessage}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowDevMessage(false)}>
          <View style={styles.developmentModal}>
            <View style={styles.developmentBox}>
              <Text style={styles.developmentTitle}>{devMessageTitle}</Text>
              <Text style={styles.developmentText}>{developmentMessage}</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowDevMessage(false)}>
                <Text style={styles.closeButtonText}>{closeButtonText}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

export default Services;
