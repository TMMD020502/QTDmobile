/* eslint-disable react-native/no-inline-styles */
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  ScrollView,
} from 'react-native';
import React, {useMemo, useCallback} from 'react';
import {Formik, FormikProps} from 'formik';
import * as Yup from 'yup';
import {AppIcons} from '../icons';
import {useTheme} from '../context/ThemeContext';
import InputBorder from '../components/InputBorder/InputBorder';
import {useTranslation} from 'react-i18next';
import Header from '../components/Header/Header';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigators/RootNavigator';

type RegisterAddressNavigationProp = StackNavigationProp<
  RootStackParamList,
  'RegisterAddress'
>;

type RegisterAddressRouteProp = RouteProp<
  RootStackParamList,
  'RegisterAddress'
>;

interface FormValues {
  country: string;
  cityProvince: string;
  district: string;
  wardOrCommune: string;
  streetAddress: string;
}

interface RegisterAddressProps {
  navigation: RegisterAddressNavigationProp;
  route: RegisterAddressRouteProp;
}

interface InputFieldConfig {
  name: keyof FormValues;
  label: string;
  placeholder: string;
}


const RegisterAddress: React.FC<RegisterAddressProps> = ({navigation, route}) => {
  const {theme} = useTheme();
  const {t} = useTranslation();
  const previousFormData = useMemo(() => route.params?.formDataUser || {}, [route.params]);

  // Validation Schema
  const validationSchema: Yup.ObjectSchema<FormValues> = useMemo(
    () =>
      Yup.object().shape({
        country: Yup.string()
          .trim()
          .required(t('register.address.errors.country')),
        cityProvince: Yup.string()
          .trim()
          .required(t('register.address.errors.cityProvince')),
        district: Yup.string()
          .trim()
          .required(t('register.address.errors.district')),
        wardOrCommune: Yup.string()
          .trim()
          .required(t('register.address.errors.wardOrCommune')),
        streetAddress: Yup.string()
          .trim()
          .required(t('register.address.errors.streetAddress')),
      }),
    [t],
  );

  // Handle Form Submission
  const handleSubmit = useCallback(
    (values: FormValues) => {
      navigation.navigate('NotificationScan', {
        formDataAddress: values,
        formDataUser: previousFormData,
      } as const);
    },
    [navigation, previousFormData],
  );

  // Input Fields Configuration
  const inputFields: InputFieldConfig[] = useMemo(
    () => [
      {
        name: 'country',
        label: t('register.address.country'),
        placeholder: t('register.address.countryPlaceholder'),
      },
      {
        name: 'cityProvince',
        label: t('register.address.cityProvince'),
        placeholder: t('register.address.cityProvincePlaceholder'),
      },
      {
        name: 'district',
        label: t('register.address.district'),
        placeholder: t('register.address.districtPlaceholder'),
      },
      {
        name: 'wardOrCommune',
        label: t('register.address.wardOrCommune'),
        placeholder: t('register.address.wardOrCommunePlaceholder'),
      },
      {
        name: 'streetAddress',
        label: t('register.address.streetAddress'),
        placeholder: t('register.address.streetAddressPlaceholder'),
      },
    ],
    [t],
  );

  // Styles
  const styles = useMemo(
    () =>
      StyleSheet.create({
        view: {
          flex: 1,
          backgroundColor: theme.background,
        },
        container: {
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        },
        body: {
          paddingTop: 8,
          marginTop: 12,
          paddingHorizontal: 20,
          paddingBottom: 8,
        },
        button: {
          backgroundColor: theme.buttonSubmit,
          padding: 20,
          alignItems: 'center',
          borderRadius: 16,
          marginHorizontal: 20,
          marginBottom: 16,
        },
        title: {
          color: theme.text,
          fontSize: 32,
          lineHeight: 32,
          marginBottom: 38,
        },

        textButton: {
          color: '#fff',
          fontSize: 14,
          fontWeight: 'bold',
        },
      }),
    [theme],
  );

  return (
    <SafeAreaView style={styles.view}>
      <View style={styles.container}>
        <Header Navbar="ConfirmAddress" navigation={navigation} />

        <Formik<FormValues>
          initialValues={{
            country: 'Vietnam',
            cityProvince: 'Saigon',
            district: 'Quan 1',
            wardOrCommune: 'Phuong 1',
            streetAddress: 'Hoang Sa',
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}>
          {({
            // eslint-disable-next-line @typescript-eslint/no-shadow
            handleSubmit,
            values,
            setFieldValue,
            errors,
            touched,
            setTouched,
            isSubmitting,
            resetForm,
          }: FormikProps<FormValues>) => (
            <>
              <ScrollView style={styles.body}>
                <View>
                  {inputFields.map((field, index) => (
                    <InputBorder
                      key={index}
                      name={field.label}
                      iconSource={AppIcons.location}
                      placeholder={field.placeholder}
                      onSetValue={value => {
                        setFieldValue(field.name, value);
                        setTouched({...touched, [field.name]: true});
                      }}
                      value={values[field.name]}
                      theme={theme}
                      error={errors[field.name]}
                      textContentType="none"
                    />
                  ))}
                </View>
              </ScrollView>

              <View>
                <TouchableOpacity
                  style={[styles.button, isSubmitting && {opacity: 0.7}]}
                  disabled={isSubmitting}
                  onPress={() => {
                    validationSchema
                      .validate(values, {abortEarly: false})
                      .catch(error => {
                        if (error.inner && error.inner.length > 0) {
                          Alert.alert(t('Thông báo'), error.inner[0].message);
                        }
                      });
                    handleSubmit();
                    resetForm({ values }); // Add this line to reset the submission state
                  }}>
                  <Text style={styles.textButton}>
                    {isSubmitting
                      ? t('register.address.submitting')
                      : t('register.address.submit')}
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </Formik>
      </View>
    </SafeAreaView>
  );
};

export default RegisterAddress;
