import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import React from 'react';
import Header from '../components/Header/Header';
import FormAssetCollateral from '../components/FormAssetCollateral/FormAssetCollateral';
import {useTheme} from '../context/ThemeContext';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../navigators/RootNavigator';
import {RouteProp} from '@react-navigation/native';

type AssetCollateralNavigationProp = StackNavigationProp<
  RootStackParamList,
  'AssetCollateral'
>;

type AssetCollateralRouteProp = RouteProp<
  RootStackParamList,
  'AssetCollateral'
>;

interface AssetCollateralProps {
  navigation: AssetCollateralNavigationProp;
  route: AssetCollateralRouteProp;
}

const AssetCollateral: React.FC<AssetCollateralProps> = ({
  navigation,
  route,
}) => {
  const {theme} = useTheme();
  const {appId} = route.params;

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
        <Header Navbar="AssetCollateral" navigation={navigation} />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
          style={{flex: 1}}>
          <View style={styles.body}>
            <FormAssetCollateral
              theme={theme}
              appId={appId}
              navigation={navigation}
            />
          </View>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
};

export default AssetCollateral;
