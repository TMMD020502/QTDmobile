/* eslint-disable no-sparse-arrays */
/* eslint-disable react-native/no-inline-styles */
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useMemo} from 'react';
import Header from '../components/Header/Header';
import {useTranslation} from 'react-i18next';
import {useTheme} from '../context/ThemeContext';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../navigators/RootNavigator';
import {RouteProp} from '@react-navigation/native';
type InfoSaveNavigationProp = StackNavigationProp<
  RootStackParamList,
  'InfoSave'
>;

type InfoSaveScreenRouteProp = RouteProp<RootStackParamList, 'InfoSave'>;

interface InfoSaveProps {
  navigation: InfoSaveNavigationProp;
  route: InfoSaveScreenRouteProp;
}

interface SaveDataItem {
  key: string;
  value: string;
}
interface SaveData {
  boxData: SaveDataItem[];
}

const InfoSave: React.FC<InfoSaveProps> = ({navigation, route}) => {
  const data = useMemo<SaveData>(
    () => ({boxData: [], ...route.params}),
    [route.params],
  );
  const {t} = useTranslation();
  const {theme} = useTheme();

  const styles = StyleSheet.create({
    view: {
      flex: 1,
      backgroundColor: theme.background,
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
      alignItems: 'center', // Changed from 'center' to 'flex-start'
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
      backgroundColor: theme.tableChildBackground,
      borderBottomWidth: 1,
    },

    textKeyRow: {
      fontWeight: 'bold',
      color: theme.text,
      width: '48%', // Added fixed width
      flexWrap: 'wrap', // Added to allow text wrapping
    },
    textRow: {
      fontWeight: 'regular',
      color: theme.text,
      width: '48%', // Added fixed width
      flexWrap: 'wrap', // Added to allow text wrapping
    },

    btn: {
      width: '100%',
      backgroundColor: '#007BFF',
      padding: 12,
      borderRadius: 12,
      marginTop: 12,
    },

    hidden: {
      opacity: 0,
      pointerEvents: 'none',
    },
  });

  return (
    <SafeAreaView style={styles.view}>
      <View style={styles.container}>
        {/* Heading */}

        <Header Navbar="InfoSave" navigation={navigation} />

        {/* Body */}

        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          showsVerticalScrollIndicator={false}>
          <View style={styles.body}>
            <View>
              <View style={styles.boxList}>
                {data.boxData.map((box: SaveDataItem, idx: number) => (
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
                        ,
                        {textAlign: 'left'},
                      ]}
                      numberOfLines={undefined}>
                      {box.key}
                    </Text>
                    <Text
                      style={[
                        idx === 0 && styles.textKeyRow,
                        idx > 0 && idx < data.boxData.length && styles.textRow,
                        ,
                        {textAlign: 'right'},
                      ]}
                      numberOfLines={undefined}>
                      {box.value}
                    </Text>
                  </View>
                ))}
              </View>
              <TouchableOpacity
                style={styles.btn}
                onPress={() => Alert.alert('Thông báo', 'Tất toán thành công')}>
                <Text
                  style={[
                    styles.textWhite,
                    {fontWeight: 'bold', textAlign: 'center'},
                  ]}>
                  {t('infoSave.submit')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default InfoSave;
