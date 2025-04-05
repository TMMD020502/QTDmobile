import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import React from 'react';
import Header from '../components/Header/Header';
import FormCreateLoanPlan from '../components/FormCreateLoanPlan/FormCreateLoanPlan';
import {useTheme} from '../context/ThemeContext';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../navigators/RootNavigator';
import {RouteProp} from '@react-navigation/native';
import i18n from '../../i18n';

type CreateLoanPlanNavigationProp = StackNavigationProp<
  RootStackParamList,
  'CreateLoanPlan'
>;

type CreateLoanPlanRouteProp = RouteProp<RootStackParamList, 'CreateLoanPlan'>;

interface CreateLoanPlanProps {
  navigation: CreateLoanPlanNavigationProp;
  route: CreateLoanPlanRouteProp;
}

const CreateLoanPlan: React.FC<CreateLoanPlanProps> = ({navigation, route}) => {
  type RouteParams = {
    appId: string;
    fromScreen?: string; // Thêm thuộc tính này
  };
  const {theme} = useTheme();
  const {appId, fromScreen} = route.params as RouteParams;
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
        <Header Navbar="CreateLoanPlan" navigation={navigation} />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
          style={{flex: 1}}>
          <View style={styles.body}>
            <FormCreateLoanPlan
              theme={theme}
              navigation={navigation}
              appId={appId}
            />
          </View>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
};

export default CreateLoanPlan;
