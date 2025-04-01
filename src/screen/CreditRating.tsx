import {SafeAreaView, ScrollView, StyleSheet, View} from 'react-native';
import React from 'react';
import Header from '../components/Header/Header';
import FormCreditRating from '../components/FormCreditRating/FormCreditRating';
import {useTheme} from '../context/ThemeContext';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../navigators/RootNavigator';
import {RouteProp} from '@react-navigation/native';

type CreditRatingNavigationProp = StackNavigationProp<
  RootStackParamList,
  'CreditRating'
>;

type CreditRatingRouteProp = RouteProp<RootStackParamList, 'CreditRating'>;

interface CreditRatingProps {
  navigation: CreditRatingNavigationProp;
  route: CreditRatingRouteProp;
}

const CreditRating: React.FC<CreditRatingProps> = ({navigation, route}) => {
  const {theme} = useTheme();
  const {appId} = route.params;
  //   const appId = '1234';

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
      paddingHorizontal: 20,
    },
  });

  return (
    <SafeAreaView style={[styles.view, {backgroundColor: theme.background}]}>
      <View style={styles.container}>
        <Header Navbar="CreditRating" navigation={navigation} />
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          nestedScrollEnabled={true}
          showsVerticalScrollIndicator={false}>
          <View style={styles.body}>
            <FormCreditRating
              theme={theme}
              appId={appId}
              navigation={navigation}
            />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default CreditRating;
