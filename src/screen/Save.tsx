import {SafeAreaView, ScrollView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Header from '../components/Header/Header';
import Table from '../components/Table/Table';
import BoxAdd from '../components/BoxAdd/BoxAdd';
import {useTranslation} from 'react-i18next';
import {useTheme} from '../context/ThemeContext';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../navigators/RootNavigator';
import i18n from '../../i18n';

type SaveScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Save'>;

interface SaveProps {
  navigation: SaveScreenNavigationProp;
}

interface Theme {
  background: string;
  text: string;
}

export interface SaveBoxData {
  id: number;
  boxes: Array<{
    key: string;
    value: string;
  }>;
}

const Save: React.FC<SaveProps> = ({navigation}) => {
  const {theme} = useTheme() as {theme: Theme};
  const {t} = useTranslation();
  const currentLanguage = i18n.language;

  const value =
    currentLanguage === 'vi'
      ? {
          method: 'Trả lãi cuối kỳ',
          receive: 'Lãi nhập gốc',
          month: 'tháng',
          year: 'năm',
        }
      : {
          method: 'Pay interest at the end of the period',
          receive: 'Interest entered principal',
          month: 'months',
          year: 'years',
        };

  const data: SaveBoxData[] = [
    {
      id: 1,
      boxes: [
        {key: t('save.fields.originalAmount'), value: '100,000,000 đ'},
        {key: t('save.fields.accountNumber'), value: '123-456-789'},
        {key: t('save.fields.expectedInterest'), value: '3.000,000 đ'},
        {key: t('save.fields.term'), value: `3 ${value.month}`},
        {key: t('save.fields.rate'), value: `3.6%/${value.year}`},
        {key: t('save.fields.interestPaymentMethod'), value: value.method},
        {key: t('save.fields.interestReceivingMethod'), value: value.receive},
        {key: t('save.fields.openDate'), value: '22/04/2024'},
        {key: t('save.fields.dueDate'), value: '22/07/2024'},
      ],
    },
    {
      id: 2,
      boxes: [
        {key: t('save.fields.originalAmount'), value: '200,000,000 đ'},
        {key: t('save.fields.accountNumber'), value: '987-654-321'},
        {key: t('save.fields.expectedInterest'), value: '3.000,000 đ'},
        {key: t('save.fields.term'), value: `3 ${value.month}`},
        {key: t('save.fields.rate'), value: `3.6%/${value.year}`},
        {key: t('save.fields.interestPaymentMethod'), value: value.method},
        {key: t('save.fields.interestReceivingMethod'), value: value.receive},
        {key: t('save.fields.openDate'), value: '22/04/2024'},
        {key: t('save.fields.dueDate'), value: '15/08/2024'},
      ],
    },
    {
      id: 3,
      boxes: [
        {key: t('save.fields.originalAmount'), value: '300,000,000 đ'},
        {key: t('save.fields.accountNumber'), value: '987-654-321'},
        {key: t('save.fields.expectedInterest'), value: '3.000,000 đ'},
        {key: t('save.fields.term'), value: `3 ${value.month}`},
        {key: t('save.fields.rate'), value: `3.6%/${value.year}`},
        {key: t('save.fields.interestPaymentMethod'), value: value.method},
        {key: t('save.fields.interestReceivingMethod'), value: value.receive},
        {key: t('save.fields.openDate'), value: '22/04/2024'},
        {key: t('save.fields.dueDate'), value: '15/08/2024'},
      ],
    },
  ];

  return (
    <SafeAreaView style={[styles.view, {backgroundColor: theme.background}]}>
      <View style={styles.container}>
        <Header Navbar="Save" navigation={navigation} />
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          showsVerticalScrollIndicator={false}>
          <View style={styles.body}>
            <BoxAdd
              title={t('save.totalAssets')}
              number="100,000,000 đ"
              navigation={navigation}
              add="SentSave"
              addText={t('save.add')}
            />

            <View style={styles.listSaves}>
              <Text style={[styles.headingList, {color: theme.text}]}>
                {t('save.savingsList')}
              </Text>

              <Table
                name="save"
                data={data}
                navigation={navigation}
                detail="InfoSave" // TypeScript will ensure this is correct
              />
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Save;

const styles = StyleSheet.create({
  view: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    width: '100%',
    height: '100%',
  },

  body: {
    marginTop: 32,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },

  listSaves: {
    marginTop: 18,
  },
  headingList: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
