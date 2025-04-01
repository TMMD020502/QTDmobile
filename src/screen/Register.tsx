/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable react-native/no-inline-styles */
import React, { useState, useCallback, useMemo } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Alert,
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { AppIcons } from '../icons';
import { useTheme } from '../context/ThemeContext';
import InputBorder from '../components/InputBorder/InputBorder';
import { useTranslation } from 'react-i18next';

interface RegisterFormValues {
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface InputFieldConfig {
  name: keyof RegisterFormValues;
  iconSource: any;
  placeholder: string;
  secureVisible?: boolean;
  onPressIcon?: () => void;
  touchEyes?: boolean;
  keyboardType?: 'default' | 'numeric' | 'email-address';
}

interface RegisterProps {
  navigation: {
    navigate: (screen: string, params?: any) => void;
    goBack: () => void;
  };
}

const { height: windowHeight } = Dimensions.get('window');

const Register: React.FC<RegisterProps> = ({ navigation }) => {
  const [invisible, setInvisible] = useState<boolean>(true);
  const [invisibleConfirm, setInvisibleConfirm] = useState<boolean>(true);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const { theme } = useTheme();
  const { t } = useTranslation();

  // Validation Schema
  const validationSchema = useMemo(
    () =>
      Yup.object().shape({
        phone: Yup.string()
          .matches(/^\d{10}$/, t('register.errors.invalidPhone'))
          .required(t('register.errors.missingFields')),
        email: Yup.string()
          .email(t('register.errors.invalidEmail'))
          .required(t('register.errors.missingFields')),
        password: Yup.string()
          .min(6, t('register.errors.passwordLength'))
          .required(t('register.errors.missingFields')),
        confirmPassword: Yup.string()
          .oneOf([Yup.ref('password')], t('register.errors.passwordMismatch'))
          .required(t('register.errors.missingFields')),
      }),
    [t]
  );

  // Handle Form Submission
  const handleSubmit = useCallback(
    (values: RegisterFormValues) => {
      navigation.navigate('RegisterAddress', { formDataUser: values });
    },
    [navigation]
  );

  // Input Fields Configuration
  const inputFields: InputFieldConfig[] = useMemo(
    () => [
      {
        name: 'phone',
        iconSource: AppIcons.phone,
        placeholder: t('register.phone'),
        keyboardType: 'numeric',
      },
      {
        name: 'email',
        iconSource: AppIcons.email,
        placeholder: t('register.email'),
        keyboardType: 'email-address',
      },
      {
        name: 'password',
        iconSource: AppIcons.password,
        placeholder: t('register.password'),
        secureVisible: invisible,
        onPressIcon: () => setInvisible((prev) => !prev),
        touchEyes: true,
      },
      {
        name: 'confirmPassword',
        iconSource: AppIcons.password,
        placeholder: t('register.confirmPassword'),
        secureVisible: invisibleConfirm,
        onPressIcon: () => setInvisibleConfirm((prev) => !prev),
        touchEyes: true,
      },
    ],
    [t, invisible, invisibleConfirm]
  );

  // Styles
  const styles = useMemo(
    () =>
      StyleSheet.create({
        view: { flex: 1, backgroundColor: theme.background },
        container: { width: '100%', height: '100%' },
        button: {
          backgroundColor: '#0066ff',
          padding: 20,
          alignItems: 'center',
          borderRadius: 16,
          marginTop: 20,
        },
        title: { color: theme.text, fontSize: 32, lineHeight: 32, marginBottom: 38 },
        textButton: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
        optionsNew: {
          marginTop: 28,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        },
      }),
    [theme]
  );

  return (
    <SafeAreaView style={styles.view}>
      <Formik
        initialValues={{
          phone: '0123456789',
          email: 'demo@gmail.com',
          password: '123456',
          confirmPassword: '123456',
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ handleChange, handleSubmit, values, errors, touched, setTouched }) => (
          <View style={styles.container}>
            <View
              style={{
                width: '100%',
                paddingHorizontal: 20,
                marginTop: 0.1 * windowHeight,
              }}
            >
              <Text style={styles.title}>{t('register.title')}</Text>

              {inputFields.map((field, index) => (
                <InputBorder
                  key={index}
                  name={field.placeholder}
                  iconSource={field.iconSource}
                  placeholder={field.placeholder}
                  onSetValue={(value) => {
                    setIsSubmitted(false);
                    handleChange(field.name)(value);
                  }}
                  value={values[field.name]}
                  theme={theme}
                  secureVisible={field.secureVisible}
                  onPressIcon={field.onPressIcon}
                  touchEyes={field.touchEyes}
                  keyboardType={field.keyboardType}
                  error={isSubmitted && touched[field.name] && errors[field.name]}
                  textContentType="none"
                />
              ))}

              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  setIsSubmitted(true);
                  // Set all fields as touched
                  const touchedFields = {
                    phone: true,
                    email: true,
                    password: true,
                    confirmPassword: true,
                  };
                  setTouched(touchedFields);

                  validationSchema
                    .validate(values, { abortEarly: false })
                    .then(() => {
                      handleSubmit();
                    })
                    .catch((error) => {
                      if (error.inner && error.inner.length > 0) {
                        Alert.alert(t('Thông báo'), error.inner[0].message);
                      }
                    });
                }}
              >
                <Text style={styles.textButton}>{t('register.submit')}</Text>
              </TouchableOpacity>

              <View style={styles.optionsNew}>
                <Text style={{ color: theme.noteText, fontSize: 14 }}>
                  {t('register.haveAccount')}{' '}
                </Text>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <Text style={{ color: theme.textActive, fontWeight: 'bold', fontSize: 14 }}>
                    {t('register.login')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </Formik>
    </SafeAreaView>
  );
};

export default Register;
