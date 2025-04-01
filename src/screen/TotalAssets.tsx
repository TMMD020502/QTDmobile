import React, {useState} from 'react';
import {SafeAreaView, StyleSheet, View, ScrollView} from 'react-native';
import Header from '../components/Header/Header';
import {useTheme} from '../context/ThemeContext';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../navigators/RootNavigator';
import BoxTotalAssets from '../components/BoxTotalAssets/BoxTotalAssets';
import ButtonShortCut from '../components/ButtonShortCut/ButtonShortCut';
import {AppIcons} from '../icons';
import {useTranslation} from 'react-i18next';
import AllocateAssets from '../components/AllocateAssets/AllocateAssets';
import RecentPayment from '../components/RecentPayment/RecentPayment';

type TotalAssetsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'TotalAssets'
>;

interface TotalAssetsProps {
  navigation: TotalAssetsScreenNavigationProp;
}

const TotalAssets: React.FC<TotalAssetsProps> = ({navigation}) => {
  const {t} = useTranslation();
  const [hide, setHide] = useState<boolean>(true);

  const {theme} = useTheme();

  const toggleHide: () => void = () => {
    setHide(!hide);
  };

  const data = [
    {
      title: 'Tổng tiền tiết kiệm',
      money: '600,000,000 đ',
      interest: '30,000,000 đ',
    },
    {
      title: 'Tổng tiền khoản vay',
      money: '1,000,000,000 đ',
      interest: '50,000,000 đ',
    },
  ];

  const styles = StyleSheet.create({
    view: {
      flex: 1,
      backgroundColor: theme.background,
    },
    container: {
      flex: 1,
    },
    totalContainer: {
      padding: 20,
    },
    wrapFunction: {
      marginTop: 30,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      flexShrink: 1,
      height: 'auto',
      flexWrap: 'wrap',
      gap: 8,
    },
  });

  return (
    <SafeAreaView style={styles.view}>
      <View style={styles.container}>
        <Header Navbar="TotalAssets" navigation={navigation} />

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.totalContainer}>
            <BoxTotalAssets hide={hide} onSetHide={toggleHide} />

            <View style={styles.wrapFunction}>
              <ButtonShortCut
                name={t('home.deposit')}
                urlIcon={AppIcons.sent}
                styleCustom={{transform: [{rotate: '0deg'}]}}
                onPress={() => navigation.navigate('Deposit')}
                theme={theme}
              />
              <ButtonShortCut
                name={t('home.transfer')}
                urlIcon={AppIcons.sent}
                styleCustom={{transform: [{rotate: '180deg'}]}}
                onPress={() => navigation.navigate('Transfer')}
                theme={theme}
              />
              <ButtonShortCut
                name={t('home.makeADeposit')}
                urlIcon={AppIcons.saveSent}
                onPress={() =>
                  navigation.navigate('HomeTabs', {screen: 'Save'})
                }
                theme={theme}
              />
              <ButtonShortCut
                name={t('home.createLoan')}
                urlIcon={AppIcons.loan}
                onPress={() =>
                  navigation.navigate('HomeTabs', {screen: 'Loan'})
                }
                theme={theme}
              />
            </View>

            <AllocateAssets data={data} theme={theme} hide={hide} />

            <RecentPayment theme={theme} navigation={navigation} />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default TotalAssets;
