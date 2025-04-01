import {SafeAreaView, ScrollView, StyleSheet, View} from 'react-native';
import React from 'react';
import Header from '../components/Header/Header';
import FormDeposit from '../components/FormDeposit/FormDeposit';
import {useTheme} from '../context/ThemeContext';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../navigators/RootNavigator';

type DepositNavigationProp = StackNavigationProp<RootStackParamList, 'Deposit'>;

interface DepositProps {
  navigation: DepositNavigationProp;
}

const Deposit: React.FC<DepositProps> = ({navigation}) => {
  const {theme} = useTheme();

  return (
    <SafeAreaView style={[styles.view, {backgroundColor: theme.background}]}>
      <View style={styles.container}>
        <Header Navbar="Deposit" navigation={navigation} />
        <View style={styles.body}>
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={false}>
            <FormDeposit theme={theme} />
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Deposit;

const styles = StyleSheet.create({
  view: {
    flex: 1,
  },
  container: {
    width: '100%',
    height: '100%',
  },

  body: {
    marginTop: 16,
    flexDirection: 'column',
    justifyContent: 'space-between',
    flex: 1,
  },
});
