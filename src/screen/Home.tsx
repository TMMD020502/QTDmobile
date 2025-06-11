/* eslint-disable react-hooks/exhaustive-deps */
import {SafeAreaView, StyleSheet, View, ScrollView, Alert} from 'react-native';
import React, {useCallback} from 'react';
import Header from '../components/Header/Header';
import ButtonShortCut from '../components/ButtonShortCut/ButtonShortCut';
import WrapProductHome from '../components/WrapProductHome/WrapProductHome';
import WrapQuestionHome from '../components/WrapQuestionHome/WrapQuestionHome';
import BoxTotalNav from '../components/BoxTotalNav/BoxTotalNav';
import {useTranslation} from 'react-i18next';
import {AppIcons} from '../icons';
import {useTheme} from '../context/ThemeContext';
import {getUserData} from '../api/services/userService';
import {useAuth} from '../context/AuthContext';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../navigators/RootNavigator';
import {useAppSelector, useAppDispatch} from '../store/hooks';
import {setUserData, setLoading, setError} from '../store/slices/userSlice';
import {getAccessToken, isTokenExpired} from '../../tokenStorage';
import {useFocusEffect} from '@react-navigation/native';
import { Theme } from '../theme/colors';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface HomeProps {
  navigation: HomeScreenNavigationProp;
}



const Home: React.FC<HomeProps> = ({navigation}) => {
  const {theme} = useTheme() as {theme: Theme};
  const {t} = useTranslation();
  const {isAuthenticated, refreshToken} = useAuth();
  const dispatch = useAppDispatch();
  const {userData} = useAppSelector(state => state.user);

  useFocusEffect(
    useCallback(() => {
      const checkTokenAndLoadData = async () => {
        try {
          if (!isAuthenticated) {
            navigation.replace('Login');
            return;
          }

          const token = await getAccessToken();

          if (token && isTokenExpired(token)) {
            const refreshed = await refreshToken();
            if (!refreshed) {
              Alert.alert(
                'Session Expired',
                'Your session has expired. Please login again.',
                [
                  {
                    text: 'OK',
                    onPress: () => navigation.replace('Login'),
                  },
                ],
              );
              return;
            }
          }
          await loadData();
        } catch (error) {
          console.error('Error in checkTokenAndLoadData:', error);
          navigation.replace('Login');
        }
      };

      checkTokenAndLoadData();
    }, [isAuthenticated, navigation, refreshToken]),
  );

  const loadData = async (): Promise<void> => {
    try {
      dispatch(setLoading(true));
      const result = await getUserData();
      if (result) {
        dispatch(setUserData(result));
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An unknown error occurred';
      dispatch(setError(errorMessage));
      Alert.alert('Error', errorMessage);
    }
  };

  return (
    <SafeAreaView style={[styles.view, {backgroundColor: theme.background}]}>
      <View style={styles.container}>
        {/* Heading */}
        <Header
          Navbar="Home"
          navigation={navigation}
          name={userData?.identityInfo?.fullName}
        />
        {/* Body */}
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          showsVerticalScrollIndicator={false}>
          <View style={styles.body}>
            <BoxTotalNav navigation={navigation} />

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
                name={t('home.linkBank')}
                urlIcon={AppIcons.linkingBankIcon}
                onPress={() => navigation.navigate('LinkingBank')}
                theme={theme}
              />
              <ButtonShortCut
                name={t('home.services')}
                urlIcon={AppIcons.servicesIcon}
                onPress={() => navigation.navigate('Services')}
                theme={theme}
              />
            </View>

            {/* Product Home */}
            <WrapProductHome name={t('home.loanProduct')} theme={theme} />

            {/* Question Home */}
            <WrapQuestionHome name={t('home.help')} theme={theme} />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Home;

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
    marginTop: 24,
    paddingHorizontal: 20,
    paddingBottom: 20,
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
