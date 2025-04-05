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
import FormCreateFinancialInfo from '../components/FormCreateFinancialInfo/FormCreateFinancialInfo';
import {useTheme} from '../context/ThemeContext';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../navigators/RootNavigator';
import {RouteProp} from '@react-navigation/native';

type CreateFinancialInfoNavigationProp = StackNavigationProp<
  RootStackParamList,
  'CreateFinancialInfo'
>;

type CreateFinancialInfoRouteProp = RouteProp<
  RootStackParamList,
  'CreateFinancialInfo'
>;
interface CreateFinancialInfoProps {
  navigation: CreateFinancialInfoNavigationProp;
  route: CreateFinancialInfoRouteProp;
}

const CreateFinancialInfo: React.FC<CreateFinancialInfoProps> = ({
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
        <Header Navbar="CreateFinancialInfo" navigation={navigation} />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
          style={{flex: 1}}>
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={false}>
            <View style={styles.body}>
              <FormCreateFinancialInfo
                theme={theme}
                navigation={navigation}
                appId={appId}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
};

export default CreateFinancialInfo;
