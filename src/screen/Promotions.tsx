import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
  FlatList,
} from 'react-native';

import React, {useState} from 'react';
import Header from '../components/Header/Header';
import {useTranslation} from 'react-i18next';
import {useTheme} from '../context/ThemeContext';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../navigators/RootNavigator';
import {AppIcons} from '../icons';

type PromotionsNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Promotions'
>;

interface PromotionsProps {
  navigation: PromotionsNavigationProp;
}

interface PromotionItem {
  id: string;
  title: string;
  description: string;
  validUntil: string;
  icon: any;
  color: string;
  isNew?: boolean;
}

const Promotions: React.FC<PromotionsProps> = ({navigation}) => {
  const {t} = useTranslation();
  const {theme} = useTheme();

  // Filter state
  const [activeFilter, setActiveFilter] = useState<string>('all');

  // Mock promotions data with theme-aware colors
  const promotions: PromotionItem[] = React.useMemo(() => [
    {
      id: '1',
      title: t('50% Cashback on First Bill Payment'),
      description: t(
        'Get 50% cashback (up to $10) on your first bill payment using our app',
      ),
      validUntil: '2023-12-31',
      icon: AppIcons.cashbackIcon || AppIcons.promotionsIcon,
      color: theme.buttonSubmit, // Use theme color instead of hardcoded
      isNew: true,
    },
    {
      id: '2',
      title: t('Free Mobile Top-up Fee'),
      description: t(
        'No service fee on all mobile top-up transactions this month',
      ),
      validUntil: '2023-11-30',
      icon: AppIcons.phone || AppIcons.promotionsIcon,
      color: theme.tabBarActive, // Use theme color instead of hardcoded
    },
    {
      id: '3',
      title: t('10% Off on Insurance Payments'),
      description: t('Pay your insurance through our app and get 10% discount'),
      validUntil: '2023-12-15',
      icon: AppIcons.insuranceIcon || AppIcons.promotionsIcon,
      color: theme.profit, // Use theme color instead of hardcoded
      isNew: true,
    },
  ], [t, theme]);

  // Filter tabs data - aligned with service categories in the app
  const filterTabs = [
    {id: 'all', label: t('services.promotions.filters.all')},
    {id: 'new', label: t('services.promotions.filters.new')},
    {id: 'mobile', label: t('services.mobileTopUp')}, // Aligned with service
    {id: 'bills', label: t('services.promotions.filters.bills')}, // Category for bill payments
    {id: 'insurance', label: t('services.insurance')}, // Aligned with service
  ];

  // Filter promotions based on active filter and service categories
  const filteredPromotions = React.useMemo(() => {
    switch (activeFilter) {
      case 'all':
        return promotions;
      case 'new':
        return promotions.filter(promo => promo.isNew);
      case 'mobile':
        // Filter promotions related to mobile services
        return promotions.filter(
          promo =>
            promo.title.toLowerCase().includes('mobile') || promo.id === '2', // Example: specifically include the mobile top-up promotion
        );
      case 'bills':
        // Filter promotions related to bill payments
        return promotions.filter(
          promo =>
            promo.title.toLowerCase().includes('bill') || promo.id === '1', // Example: specifically include the bill payment promotion
        );
      case 'insurance':
        // Filter promotions related to insurance
        return promotions.filter(
          promo =>
            promo.title.toLowerCase().includes('insurance') || promo.id === '3', // Example: specifically include the insurance promotion
        );
      default:
        return promotions;
    }
  }, [activeFilter, promotions]);

  // Handle promotion item press
  const handlePromotionPress = (promotion: PromotionItem) => {
    // Navigate to promotion details or apply promotion
    // navigation.navigate('PromotionDetails', { id: promotion.id });
    console.log('Promotion pressed:', promotion.id);
  };

  // Render a promotion item
  const renderPromotionItem = ({item}: {item: PromotionItem}) => {
    // Calculate days remaining
    const today = new Date();
    const validUntil = new Date(item.validUntil);
    const daysRemaining = Math.ceil(
      (validUntil.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
    );

    return (
      <TouchableOpacity
        style={[styles.promotionCard, {borderColor: item.color + '30'}]}
        activeOpacity={0.7}
        onPress={() => handlePromotionPress(item)}>
        <View style={styles.cardHeader}>
          <View
            style={[
              styles.promotionIconBox,
              {backgroundColor: item.color + '15'}, // Keep opacity but using theme color from item
            ]}>
            <Image
              source={item.icon}
              style={[styles.promotionIconImage, {tintColor: item.color}]}
            />
          </View>

          {item.isNew && (
            <View style={[styles.newBadge, {backgroundColor: theme.error}]}>
              <Text style={styles.newBadgeText}>{t('NEW')}</Text>
            </View>
          )}
        </View>

        <Text style={styles.promotionCardTitle}>{item.title}</Text>
        <Text style={styles.promotionCardDescription}>{item.description}</Text>

        <View style={styles.cardFooter}>
          <Text style={styles.validText}>
            {daysRemaining > 0
              ? t('services.promotions.daysLeft', {days: daysRemaining})
              : t('services.promotions.expiresDay')}
          </Text>

          <TouchableOpacity style={styles.applyButton}>
            <Text style={styles.applyButtonText}>
              {t('services.promotions.apply')}
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
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
      paddingTop: 8, // Add padding at the top of the body
    },
    contentContainer: {
      flex: 1,
    },
    header: {
      paddingHorizontal: 16,
      paddingTop: 8, // Add padding at top
      paddingBottom: 20, // Increase bottom padding
    },
    title: {
      fontSize: 22, // Reduced from 24 for better harmony
      fontWeight: '700', // Slightly reduced weight
      color: theme.text,
      marginBottom: 8,
      letterSpacing: -0.5, // Add slight letter spacing for cleaner look
    },
    subtitle: {
      fontSize: 14,
      color: theme.noteText,
      lineHeight: 20, // Add line height for better readability
    },
    filterScrollView: {
      flexGrow: 0, // Prevent ScrollView from expanding
      flexShrink: 0, // Prevent scrollView from shrinking
      marginBottom: 8, // Add margin to separate from content below
    },
    filterContainer: {
      paddingHorizontal: 16,
      paddingBottom: 12, // Reduced padding
    },
    filterTab: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      marginRight: 8,
      elevation: 1, // Add subtle elevation
      shadowColor: theme.text, // Use theme color instead of hardcoded
      shadowOpacity: 0.1,
      shadowRadius: 2,
      shadowOffset: {
        width: 0,
        height: 1,
      },
    },
    activeFilterTab: {
      backgroundColor: theme.buttonSubmit,
    },
    inactiveFilterTab: {
      backgroundColor: theme.backgroundBox,
    },
    filterTabText: {
      fontSize: 14,
      fontWeight: '500',
    },
    activeFilterText: {
      color: theme.textButtonSubmit, // Use theme's button text color
    },
    inactiveFilterText: {
      color: theme.text,
    },
    listContainer: {
      flex: 1, // Make sure the list container takes remaining space
    },
    promotionsList: {
      paddingHorizontal: 16,
      paddingBottom: 16,
    },
    promotionCard: {
      backgroundColor: theme.backgroundBox,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: theme.tableBorderColor,
      shadowColor: theme.text,
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.05,
      shadowRadius: 3,
      elevation: 2,
    },
    cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    promotionIconBox: {
      width: 50,
      height: 50,
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
    },
    promotionIconImage: {
      width: 28,
      height: 28,
      resizeMode: 'contain',
    },
    newBadge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 4,
    },
    newBadgeText: {
      color: theme.textButtonSubmit, // Use theme's button text color
      fontSize: 10,
      fontWeight: 'bold',
    },
    promotionCardTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 8,
    },
    promotionCardDescription: {
      fontSize: 13,
      color: theme.noteText,
      marginBottom: 16,
      lineHeight: 18,
    },
    cardFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    validText: {
      fontSize: 12,
      color: theme.noteText,
    },
    applyButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 6,
      backgroundColor: theme.buttonSubmit, // Use fixed theme color
    },
    applyButtonText: {
      color: theme.textButtonSubmit, // Use theme's button text color
      fontSize: 14,
      fontWeight: '500',
    },
    emptyStateContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingBottom: 24, // Add padding at the bottom
    },
    emptyStateIcon: {
      width: 70,
      height: 70,
      tintColor: theme.noteText,
      marginBottom: 16,
      opacity: 0.5, // Make it slightly transparent for better appearance
    },
    emptyStateTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 8,
      textAlign: 'center',
    },
    emptyStateText: {
      fontSize: 14,
      color: theme.noteText,
      textAlign: 'center',
      marginBottom: 24,
    },
  });

  return (
    <SafeAreaView style={styles.view}>
      <View style={styles.container}>
        {/* Heading */}
        <Header
          Navbar="Promotions"
          navigation={navigation}
        />

        {/* Body */}
        <View style={styles.body}>
          {/* Header section with improved spacing */}
          <View style={styles.header}>
            <Text style={styles.subtitle}>
              {t('services.promotions.subtitle')}
            </Text>
          </View>

          {/* Content that scrolls */}
          <View style={styles.contentContainer}>
            {/* Filter tabs */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.filterScrollView}
              contentContainerStyle={styles.filterContainer}>
              {filterTabs.map(tab => (
                <TouchableOpacity
                  key={tab.id}
                  style={[
                    styles.filterTab,
                    activeFilter === tab.id
                      ? styles.activeFilterTab
                      : styles.inactiveFilterTab,
                  ]}
                  onPress={() => setActiveFilter(tab.id)}>
                  <Text
                    style={[
                      styles.filterTabText,
                      activeFilter === tab.id
                        ? styles.activeFilterText
                        : styles.inactiveFilterText,
                    ]}>
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* List container */}
            <View style={styles.listContainer}>
              {/* Promotions List or Empty State */}
              {filteredPromotions.length > 0 ? (
                <FlatList
                  data={filteredPromotions}
                  renderItem={renderPromotionItem}
                  keyExtractor={item => item.id}
                  contentContainerStyle={styles.promotionsList}
                  showsVerticalScrollIndicator={false}
                />
              ) : (
                <View style={styles.emptyStateContainer}>
                  <Image
                    source={AppIcons.emptyState || AppIcons.promotionsIcon}
                    style={styles.emptyStateIcon}
                  />
                  <Text style={styles.emptyStateTitle}>
                    {t('services.promotions.noPromotions')}
                  </Text>
                  <Text style={styles.emptyStateText}>
                    {t('services.promotions.checkLater')}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Promotions;
