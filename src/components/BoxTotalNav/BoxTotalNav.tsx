import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useTheme} from '../../context/ThemeContext';
import {AppIcons} from '../../icons';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../navigators/RootNavigator';

type TotalAssetsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Home'
>;

interface BoxTotalNav {
  navigation: TotalAssetsScreenNavigationProp;
}
interface Theme {
  backgroundBox: string;
  text: string;
  iconColor: string;
  profit: string;
}

interface ThemeContextType {
  theme: Theme;
}

const BoxTotalNav: React.FC<BoxTotalNav> = ({navigation}) => {
  const [hide, setHide] = useState<boolean>(true);
  const {t} = useTranslation();
  const {theme} = useTheme() as ThemeContextType;

  const styles = StyleSheet.create({
    boxShow: {
      paddingHorizontal: 16,
      paddingVertical: 20,
      backgroundColor: '#f4f4f4',
      borderRadius: 20,

      shadowColor: '#171717',
      shadowOffset: {width: 0, height: 3},
      shadowOpacity: 0.2,
      shadowRadius: 3,
      elevation: 6,
    },
    wrapTitle: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    icon: {
      width: 15,
      height: 15,
      resizeMode: 'stretch',
    },
    iconClose: {
      width: 15,
      height: 15,
      resizeMode: 'stretch',
    },
    wrapOption: {
      display: 'flex',
      flexDirection: 'row',
      gap: 4,
      alignItems: 'center',
      justifyContent: 'flex-end',
      minWidth: 50,
      paddingVertical: 4,
      paddingHorizontal: 8,
    },
    wrapMoney: {
      marginTop: 12,
    },
    handleMoney: {
      display: 'flex',
      flexDirection: 'row',
      gap: 6,
      alignItems: 'center',
      marginBottom: 8,
    },
    money: {
      fontSize: 16,
      fontWeight: 'bold',
      // alignItems: "center"
    },
    borderArrowHandle: {
      width: 24,
      height: 24,
      // backgroundColor: 'white',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 9999,
      padding: 0,
    },
    profit: {
      color: '#76FA39',
    },
    hide: {
      color: '#1e1e2d',
    },
    iconStyle: {
      tintColor: theme.iconColor,
      width: 24,
      height: 24,
      padding: 8,
      paddingLeft: 0,
    },
  });

  return (
    <View style={[styles.boxShow, {backgroundColor: theme.backgroundBox}]}>
      <View style={styles.wrapTitle}>
        <Text style={{color: theme.text}}>{t('home.boxTitle')}</Text>

        <TouchableOpacity
          style={styles.wrapOption}
          onPress={() => setHide(!hide)}>
          {hide ? (
            <>
              <Image
                style={[styles.icon, {tintColor: theme.iconColor}]}
                source={AppIcons.eyesOpen}
              />
              <Text style={{color: theme.text}}>{t('home.showButton')}</Text>
            </>
          ) : (
            <>
              <Image
                style={[styles.iconClose, {tintColor: theme.iconColor}]}
                source={AppIcons.eyesClose}
              />
              <Text style={{color: theme.text}}>{t('home.hideButton')}</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.wrapMoney}>
        <View style={styles.handleMoney}>
          <View>
            {/* <Text style={styles.money}>100.100,000 đ</Text> */}
            {hide ? (
              <Text style={[styles.money, {color: theme.text}]}>
                *** *** ***
              </Text>
            ) : (
              <Text style={[styles.money, {color: theme.text}]}>
                601,000,000 đ
              </Text>
            )}
          </View>
          <TouchableOpacity
            style={styles.borderArrowHandle}
            onPress={() => navigation.navigate('TotalAssets')}>
            <Image style={styles.iconStyle} source={AppIcons.next} />
          </TouchableOpacity>
        </View>
        {/* <Text style={styles.profit}>+100,000 đ</Text> */}
        {hide ? (
          <Text style={[styles.hide, {color: theme.text}]}>*** ***</Text>
        ) : (
          <Text style={{color: theme.profit}}>+100,000 đ</Text>
        )}
      </View>
    </View>
  );
};

export default BoxTotalNav;
