/* eslint-disable curly */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-shadow */
import React, {useState, useMemo, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Header from '../components/Header/Header';
import InputBorder from '../components/InputBorder/InputBorder';
import {useTranslation} from 'react-i18next';
import {useTheme} from '../context/ThemeContext';
import {AppIcons} from '../icons';
import {useAuth} from '../context/AuthContext';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {
  launchImageLibrary,
  ImageLibraryOptions,
  MediaType,
} from 'react-native-image-picker';
import UploadImage from '../components/UploadImage/UploadImage';
import {uploadImage} from '../api/services/uploadImage';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {RootStackParamList, FormDataAddress} from '../navigators/RootNavigator';
import {Asset} from 'react-native-image-picker';
import CustomDatePicker from '../components/CustomDatePicker/CustomDatePicker';

interface ImageResponse extends Asset {
  uri: string;
}

type ResultQRNavigationProp = StackNavigationProp<
  RootStackParamList,
  'ResultQR'
>;

type ResultQRRouteProp = RouteProp<RootStackParamList, 'ResultQR'>;

interface ResultQRProps {
  navigation: ResultQRNavigationProp;
  route: ResultQRRouteProp;
}

interface FormValues {
  [key: string]: any; // Add index signature
  firstName: string;
  lastName: string;
  identifyId: string;
  fullName: string;
  dateOfBirth: string;
  gender: string;
  permanentAddress: string;
  issueDate: string;
  expirationDate: string;
  issuingAuthority: string;
  placeOfBirth: string;
  religion: string;
  ethnicity: string;
  nationality: string;
  signatureImage: string;
  frontImage: string;
  backImage: string;
  legalDocType: string;
  email: string;
  phone: string;
  password: string;
  address: FormDataAddress;
}

// Remove InitialFormValues interface and use FormValues directly
const ResultQR: React.FC<ResultQRProps> = ({navigation, route}) => {
  const {theme} = useTheme();
  const {t} = useTranslation(); // Add i18n from useTranslation
  const {formDataAddress, formDataUser, qrData} = route.params;
  const {register} = useAuth();
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [selectedField, setSelectedField] = useState<string>('');
  const [signatureImage, setSignatureImage] = useState<ImageResponse | null>(
    null,
  );
  const [frontImage, setFrontImage] = useState<ImageResponse | null>(null);
  const [backImage, setBackImage] = useState<ImageResponse | null>(null);
  const [tempDate, setTempDate] = useState<Date | null>(null);

  const showDatePicker = useCallback((fieldName: string) => {
    setSelectedField(fieldName);
    setDatePickerVisible(true);
    setTempDate(new Date());
  }, []);

  const formatDate = (date: string | Date | null) => {
    if (!date) return '';
    const d = new Date(date);
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1)
      .toString()
      .padStart(2, '0')}/${d.getFullYear()}`;
  };

  // Fixed input fields translations
  const inputFields = useMemo(
    () => [
      {
        name: 'identifyId',
        label: t('register.resultScreen.identityNumber'),
        notChange: true,
      },
      {
        name: 'fullName',
        label: t('register.resultScreen.name'),
        notChange: true,
      },
      {
        name: 'dateOfBirth',
        label: t('register.resultScreen.dateOfBirth'),
        notChange: true,
      },
      {
        name: 'gender',
        label: t('register.resultScreen.gender'),
        notChange: true,
      },
      {
        name: 'permanentAddress',
        label: t('register.resultScreen.identityHome'),
        notChange: true,
      },
      {
        name: 'issueDate',
        label: t('register.resultScreen.identitySupplyDay'),
        notChange: true,
      },
      {
        name: 'expirationDate',
        label: t('register.resultScreen.identityDueDay'),
        isDate: true,
        iconSource: AppIcons.email,
        onPress: () => showDatePicker('expirationDate'),
        pointerEvents: 'none' as const, // Add type assertion here
      },
      {
        name: 'issuingAuthority',
        label: t('register.resultScreen.identityAddress'),
      },
      {
        name: 'placeOfBirth',
        label: t('register.resultScreen.placeOfBirth'),
      },
      {
        name: 'religion',
        label: t('register.resultScreen.religion'),
      },
      {
        name: 'ethnicity',
        label: t('register.resultScreen.ethnicity'),
      },
      {
        name: 'nationality',
        label: t('register.resultScreen.nationality'),
      },
    ],
    [t, showDatePicker],
  );

  const validationSchema = useMemo(
    () =>
      Yup.object().shape({
        placeOfBirth: Yup.string().required(
          t('register.resultScreen.validationErrors.placeOfBirth'),
        ),
        expirationDate: Yup.string().required(
          t('register.resultScreen.validationErrors.expirationDate'),
        ),
        issuingAuthority: Yup.string().required(
          t('register.resultScreen.validationErrors.issuingAuthority'),
        ),
        religion: Yup.string().required(
          t('register.resultScreen.validationErrors.religion'),
        ),
        ethnicity: Yup.string().required(
          t('register.resultScreen.validationErrors.ethnicity'),
        ),
        nationality: Yup.string().required(
          t('register.resultScreen.validationErrors.nationality'),
        ),
        // signatureImage: Yup.string().required(
        //   t('register.resultScreen.validationErrors.signatureImage'),
        // ),
        // frontImage: Yup.string().required(
        //   t('register.resultScreen.validationErrors.frontImage'),
        // ),
        // backImage: Yup.string().required(
        //   t('register.resultScreen.validationErrors.backImage'),
        // ),
      }),
    [t],
  );

  const splitName = useCallback((fullName: string) => {
    if (!fullName) return {lastName: '', firstName: ''};
    const parts = fullName.trim().split(' ');
    const lastName = parts[0];
    const firstName = parts.slice(1).join(' ');
    return {lastName, firstName};
  }, []);

  const initialValues: FormValues = useMemo(() => {
    const {lastName, firstName} = splitName(qrData[2]);
    return {
      address: formDataAddress, // This will now be properly typed
      ...formDataUser,
      firstName,
      lastName,

      // identifyId: '12345999999',
      // fullName: 'Phạm Văn A',
      // dateOfBirth: '01/01/1990',
      // gender: 'Nam',
      // permanentAddress: 'Hà Nội',
      // issueDate: '01/01/2021',
      identifyId: qrData[0] || '',
      fullName: qrData[2] || '',
      dateOfBirth: qrData[3] || '',
      gender: qrData[4],
      permanentAddress: qrData[5] || '',
      issueDate: qrData[6] || '',
      ethnicity: 'Kinh',
      religion: 'Không',
      nationality: 'Việt Nam',
      placeOfBirth: '',
      expirationDate: '',
      issuingAuthority: '',
      legalDocType: 'CCCD',
      signatureImage: 'https://via.placeholder.com/150',
      frontImage: 'https://via.placeholder.com/150',
      backImage: 'https://via.placeholder.com/150',
    };
    }, [qrData, formDataUser, formDataAddress, splitName]);
  // }, []);

  // Update Alert messages to use translations
  const handleSubmit = useCallback(
    async (
      values: FormValues,
      {setSubmitting}: {setSubmitting: (isSubmitting: boolean) => void},
    ) => {
      try {
        console.log('Registering with data:', values); // Debug log
        const userData = {
          ...values,
          phone: formDataUser.phone,
          password: formDataUser.password,
          email: formDataUser.email,
          address: JSON.stringify(formDataAddress), // Convert address to string
        };
        const result = await register(userData);
        console.log('Register result:', result); // Debug log
        if (result) {
          navigation.reset({
            index: 0,
            routes: [{name: 'Login'}],
          });
        }
      } catch (error) {
        Alert.alert(t('register.resultScreen.title'), (error as Error).message);
      } finally {
        setSubmitting(false);
      }
    },
    [register, navigation, t],
  );

  const styles = StyleSheet.create({
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

    inputContainer: {
      marginBottom: 16,
    },
    label: {
      fontSize: 16,
      marginBottom: 8,
      color: '#333',
    },
    input: {
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      backgroundColor: '#f5f5f5',
    },
    backButton: {
      padding: 10,
      marginBottom: 20,
    },
    backText: {
      fontSize: 16,
      color: '#007AFF',
    },
    button: {
      backgroundColor: theme.buttonSubmit,
      padding: 20,
      borderRadius: 16,
      alignItems: 'center',
      marginHorizontal: 20,
      marginBottom: 12,
      marginTop: 12,
    },
    buttonText: {
      color: '#fff',
      fontSize: 14,
      fontWeight: 'bold',
    },
    errorText: {
      color: 'red',
      marginBottom: 10,
      textAlign: 'center',
    },
    buttonDisabled: {
      opacity: 0.7,
    },
    imagePickerContainer: {
      marginBottom: 20,
    },
    imagePickerLabel: {
      fontSize: 14,
      marginBottom: 8,
      color: theme.noteText,
    },
    imagePickerButton: {
      borderWidth: 1,
      borderColor: theme.noteText,
      borderRadius: 8,
      padding: 12,
      alignItems: 'center',
    },
    selectedImage: {
      width: '100%',
      height: 200,
      marginTop: 8,
      borderRadius: 8,
    },
  });

  return (
    <SafeAreaView style={styles.view}>
      <View style={styles.container}>
        <Header Navbar="ConfirmInfo" navigation={navigation} />
        <Formik<FormValues>
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}>
          {({
            handleSubmit,
            values,
            setFieldValue,
            errors,
            touched,
            isSubmitting,
          }) => {
            // Map fields with showDatePicker
            const fieldConfigs = inputFields.map(field => ({
              ...field,
              getValue: (values: FormValues) =>
                field.name === 'expirationDate'
                  ? formatDate(values[field.name])
                  : values[field.name as keyof FormValues],
            }));

            // Update image picker error handling
            const selectImage = async (
              type: 'signature' | 'front' | 'back',
            ) => {
              const options: ImageLibraryOptions = {
                mediaType: 'photo' as MediaType,
                quality: 0.8,
                selectionLimit: 1,
              };

              try {
                const response = await launchImageLibrary(options);
                console.log('Image picker response:', response); // Debug log

                if (response.didCancel) {
                  console.log('User cancelled image picker');
                  return;
                }

                if (response.errorCode) {
                  console.log('ImagePicker Error:', response.errorMessage);
                  Alert.alert(
                    t('register.resultScreen.title'),
                    t('register.resultScreen.imageError'),
                  );
                  return;
                }

                if (
                  response.assets &&
                  response.assets[0] &&
                  response.assets[0].uri
                ) {
                  const image = response.assets[0];
                  try {
                    // Upload image to server
                    const uploadResult = await uploadImage({
                      uri: image.uri,
                      type: image.type || '',
                      fileName: image.fileName || '',
                    });
                    const imageUrl = uploadResult.url; // Adjust based on your API response

                    console.log('Uploaded image URL:', imageUrl); // Debug log
                    // Update state and form values with server URL
                    switch (type) {
                      case 'signature':
                        setSignatureImage({...image, uri: imageUrl});
                        setFieldValue('signatureImage', imageUrl);
                        break;
                      case 'front':
                        setFrontImage({...image, uri: imageUrl});
                        setFieldValue('frontImage', imageUrl);
                        break;
                      case 'back':
                        setBackImage({...image, uri: imageUrl});
                        setFieldValue('backImage', imageUrl);
                        break;
                    }
                  } catch (uploadError) {
                    // console.error(
                    //   'Error uploading image:',
                    //   uploadError.message || uploadError,
                    // );
                    Alert.alert(
                      t('register.resultScreen.title'),
                      t('register.resultScreen.imageError'),
                    );
                  }
                }
              } catch (error) {
                console.error('Error in image picker:', error);
                Alert.alert(
                  t('register.resultScreen.title'),
                  t('register.resultScreen.imageError'),
                );
              }
            };

            // Update validation error alerts
            const onSubmitPress = (
              values: FormValues,
              handleSubmit: () => void,
            ) => {
              validationSchema
                .validate(values, {abortEarly: false})
                .catch(error => {
                  if (error.inner && error.inner.length > 0) {
                    Alert.alert(
                      t('register.resultScreen.title'),
                      error.inner[0].message,
                    );
                  }
                });
              handleSubmit();
            };

            // Handler for date confirmation
            const handleDateConfirm = (date: Date) => {
              if (selectedField) {
                const formattedDate = date.toISOString().split('T')[0];
                setFieldValue(selectedField, formattedDate);
              }
            };

            return (
              <>
                <ScrollView style={styles.body}>
                  {fieldConfigs.map((field, index) => (
                    <InputBorder
                      key={index}
                      name={field.label}
                      iconSource={AppIcons.email}
                      value={field.getValue(values)}
                      onSetValue={value => {
                        if (!field.notChange) {
                          setFieldValue(field.name, value);
                        }
                      }}
                      error={
                        touched[field.name] && errors[field.name]
                          ? String(errors[field.name])
                          : undefined
                      }
                      theme={theme}
                      onPress={field.onPress}
                      pointerEvents={field.pointerEvents}
                      notChange={field.notChange}
                      placeholder={''}
                    />
                  ))}
                  <UploadImage
                    title={t('register.resultScreen.signatureImage')}
                    theme={theme}
                    typeImage={signatureImage}
                    onSelectImage={() => selectImage('signature')}
                    touched={touched?.signatureImage}
                    errors={errors?.signatureImage}
                  />

                  <UploadImage
                    title={t('register.resultScreen.frontImage')}
                    theme={theme}
                    typeImage={frontImage}
                    onSelectImage={() => selectImage('front')}
                    touched={touched?.frontImage}
                    errors={errors?.frontImage}
                  />

                  <UploadImage
                    title={t('register.resultScreen.backImage')}
                    theme={theme}
                    typeImage={backImage}
                    onSelectImage={() => selectImage('back')}
                    touched={touched?.backImage}
                    errors={errors?.backImage}
                  />
                </ScrollView>

                {/* Replace the old DatePicker implementation with the new CustomDatePicker */}
                <CustomDatePicker
                  isVisible={isDatePickerVisible}
                  onClose={() => setDatePickerVisible(false)}
                  onConfirm={handleDateConfirm}
                  selectedDate={tempDate}
                  minimumDate={new Date()}
                  theme={theme}
                />

                <TouchableOpacity
                  style={[styles.button, isSubmitting && styles.buttonDisabled]}
                  disabled={isSubmitting}
                  onPress={() => onSubmitPress(values, handleSubmit)}>
                  <Text style={styles.buttonText}>
                    {isSubmitting
                      ? t('register.resultScreen.processing')
                      : t('register.resultScreen.submit')}
                  </Text>
                </TouchableOpacity>
              </>
            );
          }}
        </Formik>
      </View>
    </SafeAreaView>
  );
};

export default ResultQR;
