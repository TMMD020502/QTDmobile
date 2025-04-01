import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {useTheme} from '../../context/ThemeContext';
import {AppIcons} from '../../icons';
import {Theme} from '../../theme/colors';

interface ThemeContextType {
  theme: Theme;
}

interface BoxTotalAssetsProps {
  hide: boolean;
  onSetHide: () => void;
}

const BoxTotalAssets: React.FC<BoxTotalAssetsProps> = ({hide, onSetHide}) => {
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
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 12,
    },
    titleText: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    icon: {
      width: 24,
      height: 24,
      resizeMode: 'stretch',
      padding: 4,
    },
    iconClose: {
      width: 24,
      height: 24,
      resizeMode: 'stretch',
      padding: 4,
    },
    wrapOption: {
      //   display: 'flex',
      //   flexDirection: 'row',
      //   alignItems: 'center',
    },
    wrapMoney: {
      marginTop: 12,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      justifyContent: 'space-between',
    },
    handleMoney: {
      display: 'flex',
      flexDirection: 'row',
      gap: 8,
      alignItems: 'center',
      marginBottom: 20,
    },
    money: {
      fontSize: 16,
      fontWeight: 'bold',
      // alignItems: "center"
    },
    borderArrowHandle: {
      width: 16,
      height: 16,
      // backgroundColor: 'white',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 9999,
    },
    profit: {
      color: '#76FA39',
    },
    hide: {
      color: '#1e1e2d',
      //   lineHeight: 22,
      transform: [{translateY: 2}],
    },
    titleNote: {
      fontSize: 14,
      color: theme.text,
    },
    iconStyle: {
      tintColor: theme.iconColor,
      width: 16,
      height: 16,
    },
    separate: {
      height: 1,
      backgroundColor: theme.tableBorderColor,
      marginVertical: 12,
    },
    interest: {
      color: theme.interest,
    },
  });

  return (
    <View style={[styles.boxShow, {backgroundColor: theme.backgroundBox}]}>
      <View style={styles.wrapTitle}>
        <Text style={[styles.titleText, {color: theme.text}]}>
          {t('totalAssets.title')}
        </Text>

        <View style={styles.handleMoney}>
          <View>
            {/* <Text style={styles.money}>100.100,000 đ</Text> */}
            {hide ? (
              <Text style={[styles.money, styles.hide, {color: theme.text}]}>
                *** *** ***
              </Text>
            ) : (
              <Text style={[styles.money, {color: theme.text}]}>
                601,000,000 đ
              </Text>
            )}
          </View>

          <TouchableOpacity style={styles.wrapOption} onPress={onSetHide}>
            {hide ? (
              <>
                <Image
                  style={[styles.icon, {tintColor: theme.iconColor}]}
                  source={AppIcons.eyesOpen}
                />
              </>
            ) : (
              <>
                <Image
                  style={[styles.iconClose, {tintColor: theme.iconColor}]}
                  source={AppIcons.eyesClose}
                />
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.separate} />

      <View style={styles.wrapMoney}>
        <Text style={styles.titleNote}>{t('totalAssets.totalBalance')}</Text>
        {hide ? (
          <Text style={[styles.hide, {color: theme.text}]}>*** ***</Text>
        ) : (
          <Text style={{color: theme.text}}>1,000,000 đ</Text>
        )}
      </View>
      <View style={styles.wrapMoney}>
        <Text style={styles.titleNote}>{t('totalAssets.totalSavingInterest')}</Text>
        {hide ? (
          <Text style={[styles.hide, {color: theme.text}]}>*** ***</Text>
        ) : (
          <Text style={{color: theme.profit}}>30,000,000 đ</Text>
        )}
      </View>
      <View style={styles.wrapMoney}>
        <Text style={styles.titleNote}>{t('totalAssets.totalLoanInterest')}</Text>
        {hide ? (
          <Text style={[styles.hide, {color: theme.text}]}>*** ***</Text>
        ) : (
          <Text style={styles.interest}>50,000,000 đ</Text>
        )}
      </View>
    </View>
  );
};

export default BoxTotalAssets;
