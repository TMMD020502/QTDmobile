import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
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
  status?: string;
}

const AssetCollateral: React.FC<AssetCollateralProps> = ({
  navigation,
  route,
}) => {
  const {theme} = useTheme();
  const {appId, status} = route.params as {
    appId: string;
    status?: string;
  };

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
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          nestedScrollEnabled={true}
          showsVerticalScrollIndicator={false}>
          <View style={styles.body}>
            <FormAssetCollateral
              theme={theme}
              appId={appId}
              navigation={navigation}
              status={status}
            />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default AssetCollateral;
