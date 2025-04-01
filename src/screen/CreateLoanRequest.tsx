import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import React from 'react';
import Header from '../components/Header/Header';
import FormCreateLoanRequest from '../components/FormCreateLoanRequest/FormCreateLoanRequest';
import {useTheme} from '../context/ThemeContext';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../navigators/RootNavigator';
import {RouteProp} from '@react-navigation/native';

type CreateLoanRequestNavigationProp = StackNavigationProp<
  RootStackParamList,
  'CreateLoanRequest'
>;

type CreateLoanRequestRouteProp = RouteProp<
  RootStackParamList,
  'CreateLoanRequest'
>;

interface CreateLoanRequestProps {
  navigation: CreateLoanRequestNavigationProp;
  route: CreateLoanRequestRouteProp;
}

const CreateLoanRequest: React.FC<CreateLoanRequestProps> = ({
  navigation,
  route,
}) => {
  const {theme} = useTheme();
  const {appId, fromScreen} = route.params;

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
        <Header Navbar="CreateLoanRequest" navigation={navigation} />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
          style={{flex: 1}}>
          <View style={styles.body}>
            <FormCreateLoanRequest
              theme={theme}
              appId={appId}
              fromScreen={fromScreen}
              navigation={navigation}
            />
          </View>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
};

export default CreateLoanRequest;
