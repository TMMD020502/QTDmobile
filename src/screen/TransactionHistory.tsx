import React, {useState, useMemo, useRef} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  FlatList,
  Image,
  Dimensions,
  Animated,
  TouchableWithoutFeedback,
} from 'react-native';
import Header from '../components/Header/Header';
// import {useTranslation} from 'react-i18next';
import {useTheme} from '../context/ThemeContext';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../navigators/RootNavigator';
import {AppIcons} from '../icons';
import {useTranslation} from 'react-i18next';

type TransactionHistoryNavigationProp = StackNavigationProp<
  RootStackParamList,
  'TransactionHistory'
>;

interface TransactionHistoryProps {
  navigation: TransactionHistoryNavigationProp;
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  navigation,
}) => {
  // const {t} = useTranslation();
  const {theme} = useTheme();
  const [activeFilter, setActiveFilter] = useState('all');
  const [isMonthPickerVisible, setMonthPickerVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const screenHeight = Dimensions.get('window').height;
  const {t} = useTranslation();

  const transactionData = useMemo(
    () => [
      {
        id: '1',
        title: 'deposit',
        money: '+ 1,000,000 đ',
        date: '12/12/2024',
        status: 'success',
        code: 'TRX123456789',
        source: 'amount',
      },
      {
        id: '2',
        title: 'withdraw',
        money: '- 500,000 đ',
        date: '11/12/2024',
        status: 'success',
        code: 'TRX987654321',
        source: 'bank',
      },
      {
        id: '3',
        title: 'deposit',
        money: '+ 100,000,000 đ',
        date: '11/1/2025',
        status: 'success',
        code: 'TRX987654321',
        source: 'bank',
      },
      {
        id: '4',
        title: 'withdraw',
        money: '- 100,000,000 đ',
        date: '11/1/2025',
        status: 'success',
        code: 'TRX987654321',
        source: 'bank',
      },
      {
        id: '5',
        title: 'withdraw',
        money: '- 500,000,000 đ',
        date: '13/1/2025',
        status: 'success',
        code: 'TRX987654321',
        source: 'bank',
      },
      {
        id: '6',
        title: 'withdraw',
        money: '- 500,000,000 đ',
        date: '12/1/2025',
        status: 'failed',
        code: 'TRX987654321',
        source: 'bank',
      },
      {
        id: '7',
        title: 'withdraw',
        money: '- 500,000,000 đ',
        date: '11/1/2025',
        status: 'failed',
        code: 'TRX987654321',
        source: 'bank',
      },
      {
        id: '8',
        title: 'deposit',
        money: '+ 500,000,000 đ',
        date: '16/1/2025',
        status: 'success',
        code: 'TRX987654321',
        source: 'bank',
      },
      {
        id: '9',
        title: 'withdraw',
        money: '- 500,000,000 đ',
        date: '11/1/2025',
        status: 'success',
        code: 'TRX987654321',
        source: 'bank',
      },
      {
        id: '10',
        title: 'withdraw',
        money: '- 500,000,000 đ',
        date: '21/1/2025',
        status: 'success',
        code: 'TRX987654321',
        source: 'bank',
      },
      {
        id: '11',
        title: 'deposit',
        money: '+ 300,000,000 đ',
        date: '11/1/2025',
        status: 'success',
        code: 'TRX987654321',
        source: 'bank',
      },
      {
        id: '12',
        title: 'withdraw',
        money: '- 500,000,000 đ',
        date: '11/1/2025',
        status: 'success',
        code: 'TRX987654321',
        source: 'bank',
      },

      // Add more transaction items as needed
    ],
    [],
  );

  const filters = [
    {id: 'all', label: 'Tất cả'},
    {id: 'deposit', label: 'Nạp tiền'},
    {id: 'withdraw', label: 'Rút tiền'},
  ];

  // Add new date formatting helper
  function formatDateToMonthYear(date: Date): string {
    return `${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}/${date.getFullYear()}`;
  }

  function parseDateString(dateStr: string): Date {
    const [day, month, year] = dateStr.split('/').map(num => parseInt(num));
    return new Date(year, month - 1, day);
  }

  // Thay thế mảng months cứng bằng hàm tạo months động
  const generateMonths = () => {
    const months = [];
    const now = new Date();
    const currentMonth = now.getMonth(); // 0-11
    const currentYear = now.getFullYear();

    // Tính toán ngày đầu tiên của 12 tháng trước
    const startDate = new Date(currentYear, currentMonth - 11, 1);

    // Tạo mảng các tháng từ startDate đến hiện tại
    for (
      let date = startDate;
      date <= now;
      date.setMonth(date.getMonth() + 1)
    ) {
      const monthStr = (date.getMonth() + 1).toString().padStart(2, '0');
      const yearStr = date.getFullYear().toString();

      months.push({
        label: `${monthStr}/${yearStr}`,
        value: `${monthStr}/${yearStr}`,
      });
    }

    // Sắp xếp mảng theo thứ tự giảm dần (mới nhất lên đầu)
    return months.reverse();
  };

  // Thay thế useMemo groupedMonths
  const groupedMonths = useMemo(() => {
    const years: Record<string, Array<{label: string; value: string}>> = {};
    const months = generateMonths();

    months.forEach(month => {
      const year = month.value.split('/')[1];
      if (!years[year]) {
        years[year] = [];
      }
      years[year].push(month);
    });
    return years;
  }, []); // Empty dependency array vì chỉ cần tính toán 1 lần

  // Cập nhật giá trị mặc định của selectedMonth là tháng hiện tại
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const year = now.getFullYear();
    return `${month}/${year}`;
  });

  const filteredTransactions = useMemo(() => {
    let filtered = transactionData;

    if (activeFilter !== 'all') {
      filtered = filtered.filter(item => {
        if (activeFilter === 'deposit') return item.title === 'deposit';
        if (activeFilter === 'withdraw') return item.title === 'withdraw';
        return true;
      });
    }

    if (selectedMonth) {
      filtered = filtered.filter(item => {
        const transactionDate = parseDateString(item.date);
        return formatDateToMonthYear(transactionDate) === selectedMonth;
      });
      // Sắp xếp theo ngày giảm dần (mới nhất lên đầu)
      filtered.sort((a, b) => {
        const dateA = parseDateString(a.date);
        const dateB = parseDateString(b.date);
        return dateB.getTime() - dateA.getTime();
      });
    }

    return filtered;
  }, [transactionData, activeFilter, selectedMonth]);

  const renderFilterButtons = () => (
    <View style={styles.filterContainer}>
      {filters.map(filter => (
        <TouchableOpacity
          key={filter.id}
          style={[
            styles.filterButton,
            activeFilter === filter.id && styles.filterButtonActive,
          ]}
          onPress={() => setActiveFilter(filter.id)}>
          <Text
            style={[
              styles.filterText,
              activeFilter === filter.id && styles.filterTextActive,
            ]}>
            {filter.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderTransactionItem = ({
    item,
  }: {
    item: (typeof transactionData)[0];
  }) => (
    <TouchableOpacity
      style={styles.transactionItem}
      onPress={() =>
        navigation.navigate('DetailTransaction', {
          dataTransaction: item,
        })
      }>
      <View style={styles.itemLeft}>
        <View style={styles.itemInfo}>
          <Text style={styles.title}>
            {t(`totalAssets.transaction.types.${item.title}`)}
          </Text>
          <Text style={styles.date}>{item.date}</Text>
        </View>
      </View>
      <View style={styles.itemRight}>
        <Text style={[styles.money]}>{item.money}</Text>
        <Text
          style={[
            styles.status,
            item.status === 'success' ? styles.success : styles.failed,
          ]}>
          {t(`totalAssets.transaction.statuses.${item.status}`)}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const showMonthPicker = () => {
    setMonthPickerVisible(true);
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const hideMonthPicker = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setMonthPickerVisible(false);
    });
  };

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [screenHeight, 0],
  });

  const renderMonthPicker = () =>
    isMonthPickerVisible && (
      <View style={styles.modalOverlay}>
        <TouchableWithoutFeedback onPress={hideMonthPicker}>
          <Animated.View style={[styles.overlay, {opacity: fadeAnim}]} />
        </TouchableWithoutFeedback>

        <Animated.View
          style={[
            styles.monthPickerContainer,
            {
              transform: [{translateY}],
            },
          ]}>
          <View style={styles.bottomSheet}>
            <View style={styles.monthPickerContent}>
              {Object.entries(groupedMonths)
                .sort(([yearA], [yearB]) => Number(yearB) - Number(yearA))
                .map(([year, yearMonths]) => (
                  <View key={year} style={styles.yearSection}>
                    <Text style={styles.yearTitle}>{year}</Text>
                    <View style={styles.monthGrid}>
                      {yearMonths.map(month => {
                        const monthNumber = month.value.split('/')[0];
                        return (
                          <TouchableOpacity
                            key={month.value}
                            style={[styles.monthGridItem]}
                            onPress={() => {
                              setSelectedMonth(month.value);
                              hideMonthPicker();
                            }}>
                            <Text
                              style={[
                                styles.monthItemText,
                                selectedMonth === month.value &&
                                  styles.selectedItemText,
                              ]}>
                              Tháng {monthNumber}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>
                ))}
            </View>
          </View>
        </Animated.View>
      </View>
    );

  const renderFilterSection = () => (
    <View style={styles.filterSection}>
      {renderFilterButtons()}
      <TouchableOpacity
        style={styles.monthFilterButton}
        onPress={showMonthPicker}>
        <Text style={styles.monthFilterText}>{selectedMonth}</Text>
        <Image source={AppIcons.calendar} style={styles.calendarIcon} />
      </TouchableOpacity>
    </View>
  );

  const styles = StyleSheet.create({
    view: {
      flex: 1,
      backgroundColor: theme.background,
    },
    container: {
      flex: 1,
    },
    optionsContainer: {
      flex: 1, // Thêm flex: 1 để container có thể scroll
      paddingHorizontal: 20,
      marginTop: 20,
    },
    listContainer: {
      flexGrow: 1, // Thêm flexGrow để list có thể scroll hết nội dung
    },
    transactionItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 12,
      paddingVertical: 12,
      backgroundColor: theme.backgroundBox,
      marginBottom: 16,
      borderRadius: 8,
    },
    itemLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    itemRight: {
      alignItems: 'flex-end',
    },
    transactionIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: '#fff',
      padding: 8,
    },
    itemInfo: {
      gap: 4,
    },
    title: {
      fontSize: 14,
      fontWeight: '500',
      color: theme.text,
    },
    date: {
      fontSize: 12,
      color: theme.noteText,
    },
    money: {
      fontSize: 14,
      fontWeight: '500',
      marginBottom: 4,
      color: theme.text,
    },
    deposit: {
      color: theme.profit,
    },
    withdraw: {
      color: theme.error,
    },
    status: {
      fontSize: 14,
    },
    success: {
      color: theme.profit,
    },
    failed: {
      color: theme.error,
    },
    filterContainer: {
      flexDirection: 'row',
      gap: 12,
      // marginBottom: 16,
    },
    filterButton: {
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 20,
      backgroundColor: theme.background,
      borderWidth: 1,
      borderColor: theme.borderInputBackground,
    },
    filterButtonActive: {
      backgroundColor: theme.buttonSubmit,
      borderColor: theme.textButtonSubmit,
    },
    filterText: {
      color: theme.text,
      fontSize: 14,
    },
    filterTextActive: {
      color: theme.textButtonSubmit,
    },
    filterSection: {
      gap: 16,
      marginBottom: 16,
    },
    monthFilterButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 12,
      backgroundColor: theme.background,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.borderInputBackground,
    },
    monthFilterText: {
      color: theme.text,
      fontSize: 14,
    },
    calendarIcon: {
      width: 20,
      height: 20,
      tintColor: theme.text,
    },
    modalOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 1000,
    },
    overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    monthPickerContainer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: theme.background,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      height: 400, // Fixed height instead of percentage
    },
    bottomSheet: {
      flex: 1,
      padding: 20,
    },
    monthPickerContent: {
      flex: 1,
    },
    yearSection: {
      marginBottom: 20,
    },
    yearTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 16,
    },
    monthGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
    },
    monthGridItem: {
      width: '30%', // Slightly adjusted for gap
    },
    monthItemText: {
      fontSize: 14,
      color: theme.text,
      textAlign: 'center',
      padding: 12,
      backgroundColor: theme.background,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.borderInputBackground,
    },
    selectedItemText: {
      color: theme.textButtonSubmit,
      backgroundColor: theme.buttonSubmit,
      borderColor: theme.tableBorderColor,
    },
  });

  return (
    <SafeAreaView style={styles.view}>
      <View style={styles.container}>
        <Header Navbar="TransactionHistory" navigation={navigation} />
        <View style={styles.optionsContainer}>
          {renderFilterSection()}
          <FlatList
            data={filteredTransactions}
            renderItem={renderTransactionItem}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
            bounces={true} // Thêm để tránh scroll quá đà
          />
        </View>
        {renderMonthPicker()}
      </View>
    </SafeAreaView>
  );
};

export default TransactionHistory;
