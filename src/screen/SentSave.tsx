import {SafeAreaView, ScrollView, StyleSheet, View} from 'react-native';
import React from 'react';
import Header from '../components/Header/Header';
import FormCreateSave from '../components/FormCreateSave/FormCreateSave';
import {useTheme} from '../context/ThemeContext';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../navigators/RootNavigator';

type SentSaveNavigationProp = StackNavigationProp<RootStackParamList, 'SentSave'>;

interface SentSaveProps {
  navigation: SentSaveNavigationProp;
}

const SentSave: React.FC<SentSaveProps> = ({navigation}) => {
  const {theme} = useTheme();

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
        <Header Navbar="SentSave" navigation={navigation} />
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          nestedScrollEnabled={true}
          showsVerticalScrollIndicator={false}>
          <View style={styles.body}>
            <FormCreateSave />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default SentSave;
