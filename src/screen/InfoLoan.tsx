/* eslint-disable react-native/no-inline-styles */
import {SafeAreaView, ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useMemo} from 'react';
import Header from '../components/Header/Header';
import {useTheme} from '../context/ThemeContext';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../navigators/RootNavigator';
import {RouteProp} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';

type InfoLoanScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'InfoLoan'
>;
type InfoLoanScreenRouteProp = RouteProp<RootStackParamList, 'InfoLoan'>;

interface InfoLoanProps {
  navigation: InfoLoanScreenNavigationProp;
  route: InfoLoanScreenRouteProp;
}

interface Theme {
  background: string;
  headerShadow: string;
  tableChildBackground: string;
  tableHeaderBackground: string;
  tableBorderColor: string;
  text: string;
}

interface LoanDataItem {
  key: string;
  value: string;
}

interface LoanData {
  boxData: LoanDataItem[];
}
const InfoLoan: React.FC<InfoLoanProps> = ({navigation, route}) => {
  const data = useMemo<LoanData>(
    () => ({boxData: [], ...route.params}),
    [route.params],
  );
  const {theme} = useTheme() as {theme: Theme};
  const {t} = useTranslation();

  console.log('InfoLoan: ', data);

  const styles = StyleSheet.create({
    view: {
      flex: 1,
    },
    container: {
      width: '100%',
      height: '100%',
    },
    containHeading: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      alignItems: 'center',
    },
    heading: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#1e1e2d',
    },
    borderArrow: {
      width: 42,
      height: 42,
      alignItems: 'flex-start',
      justifyContent: 'center',
    },

    body: {
      marginTop: 16,
      paddingHorizontal: 20,
    },

    textWhite: {
      color: 'white',
    },
    textPrimary: {
      color: '#007BFF',
    },
    iconPrimary: {
      tintColor: '#007BFF',
    },

    boxList: {
      marginVertical: 12,
      backgroundColor: theme.tableChildBackground,
      borderRadius: 12,

      // Shadow for iOS
      shadowColor: theme.headerShadow, // Màu bóng
      shadowOffset: {width: 0, height: 2}, // Độ lệch bóng
      shadowOpacity: 0.2, // Độ trong suốt
      shadowRadius: 5, // Bán kính làm mờ bóng
      // Shadow for Android
      elevation: 5, // Mức độ nổi
      display: 'flex',
      flexDirection: 'column',
      height: 'auto',
    },

    boxWrap: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 12,
      gap: 8,
    },

    firstChild: {
      backgroundColor: theme.tableHeaderBackground,
      borderTopLeftRadius: 12,
      borderTopRightRadius: 12,
    },
    middleChild: {
      borderBottomColor: theme.tableBorderColor,
      borderBottomWidth: 1,
    },

    textKeyRow: {
      fontWeight: 'bold',
      color: theme.text,
      width: '48%', // Added fixed width
      flexWrap: 'wrap',
    },
    textRow: {
      fontWeight: 'regular',
      color: theme.text,
      flexShrink: 1, // Allow text to shrink
      textAlign: 'right',
    },

    hidden: {
      opacity: 0,
      pointerEvents: 'none',
    },
    status: {
      backgroundColor: '#e7c631',
      color: '#fff',
      paddingVertical: 4,
      paddingHorizontal: 10,
      borderRadius: 8,
      fontWeight: 'bold',
      alignSelf: 'flex-start', // Change to flex-start
      maxWidth: '100%', // Ensure it doesn't overflow
    },
  });

  return (
    <SafeAreaView style={[styles.view, {backgroundColor: theme.background}]}>
      <View style={styles.container}>
        {/* Heading */}

        <Header Navbar="InfoLoan" navigation={navigation} />

        {/* Body */}

        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          showsVerticalScrollIndicator={false}>
          <View style={styles.body}>
            <View>
              <View style={styles.boxList}>
                {data.boxData.map((box, idx) => (
                  <View
                    key={idx}
                    style={[
                      styles.boxWrap,
                      idx === 0 && styles.firstChild, // Áp dụng kiểu cho phần tử đầu tiên
                      idx > 0 &&
                        idx < data.boxData.length - 1 &&
                        styles.middleChild, // Phần tử giữa
                    ]}>
                    <Text
                      style={[
                        idx === 0 && styles.textKeyRow,
                        idx > 0 && idx < data.boxData.length && styles.textRow,
                        {
                          flex: 1, // Take remaining space
                          textAlign: 'left',
                        },
                      ]}
                      numberOfLines={undefined}>
                      {box.key}
                    </Text>
                    <Text
                      style={[
                        idx === 0 && styles.textKeyRow,
                        idx > 0 && idx < data.boxData.length && styles.textRow,
                        box.key === t('loan.fields.status') &&
                          box.value === t('loan.fields.spending') &&
                          styles.status,
                        {textAlign: 'right'},
                      ]}
                      numberOfLines={undefined}>
                      {box.value}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default InfoLoan;
