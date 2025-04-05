import {
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  Switch,
  ScrollView,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import InputBackground from '../InputBackground/InputBackground';
import CurrencyInput from '../CurrencyInput/CurrencyInput';
import {useTranslation} from 'react-i18next';
import {Theme} from '../../theme/colors';
import {
  financialInfo,
  getDocuments,
  getworkflowbyapplicationid,
  updateFinancialInfo,
} from '../../api/services/loan';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../navigators/RootNavigator';
import DocumentPicker, {
  DocumentPickerResponse,
} from 'react-native-document-picker';
import {AppIcons} from '../../icons';
import {Formik, FormikProps} from 'formik';
import * as Yup from 'yup';
import i18n from '../../../i18n';
import {uploadImage} from '../../api/services/uploadImage';
import {useRoute} from '@react-navigation/native';
import {LoanResponse} from '../../api/types/loanworkflowtypes';
import {getDocumentIds, saveDocumentIds} from '../../../tokenStorage';
interface FormCreateFinancialInfoProps {
  theme: Theme;
  navigation: StackNavigationProp<RootStackParamList, 'CreateFinancialInfo'>;
  appId: string;
  fromScreen?: string;
}

interface FileData {
  uri: string;
  type: string;
}

interface FormData {
  jobTitle: string;
  companyName: string;
  companyAddress: string;
  hasMarried: boolean;
  totalIncome: number;
  monthlyExpense: number;
  monthlySaving: number;
  monthlyDebt: number;
  monthlyLoanPayment: number;
  files: string[];
  actionType: string;
}

const FormCreateFinancialInfo: React.FC<FormCreateFinancialInfoProps> = ({
  theme,
  navigation,
}) => {
  const route = useRoute();
  const {appId, fromScreen} = route.params as {
    appId: string;
    fromScreen?: string;
  };
  const {t} = useTranslation();
  const formikRef = useRef<FormikProps<FormData>>(null); // Create a ref for Formik
  const currentLanguage = i18n.language;
  const [formData, setFormData] = useState<FormData>({
    jobTitle: '',
    companyName: '',
    companyAddress: '',
    hasMarried: false,
    totalIncome: 0,
    monthlyExpense: 0,
    monthlySaving: 0,
    monthlyDebt: 0,
    monthlyLoanPayment: 0,
    files: [],
    actionType: '',
  });
  // const [formDataFile, setFormDataFile] = useState<FileData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<DocumentPickerResponse[]>(
    [],
  );

  console.log('selectedFiles:', formData);
  // const [savedFile, setSavedFile] = useState(null);

  const handleDocumentPick = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles], // Chọn loại tệp bạn muốn cho phép
      });
      const File = res[0];

      const file = {
        uri: res[0].uri,
        type: res[0].type || 'application/octet-stream',
        fileName: res[0].name || '',
      };
      const uploadResponse = await uploadImage(file);
      if (uploadResponse) {
        // 🎯 Hiển thị đầy đủ thông tin phản hồi
        console.log('✅ Response:', uploadResponse);
        console.log('📌 Id:', uploadResponse.id);

        setSelectedFiles(prev => [...prev, File]);
        await saveDocumentIds([uploadResponse.id ?? '']);
        formikRef.current?.setFieldValue('files', [
          ...(formikRef.current?.values.files || []),
          uploadResponse.id,
        ]);
      }
    } catch (err: any) {
      if (DocumentPicker.isCancel(err)) {
        // Xử lý hủy chọn tệp

        console.log('User cancelled document picker');
      } else {
        // Xử lý lỗi khác
        if (err.response.status === 413) {
          Alert.alert(
            currentLanguage === 'vi'
              ? '🔴 File có dung lượng quá lớn.'
              : '🔴 The file is too large.',
          );
        }
        if (err.response) {
          console.error('🔴 Lỗi từ server:', err.response.data);
          console.error('📌 Status:', err.response.status);
          console.error('📌 Headers:', err.response.headers);
        } else {
          console.error('❌ Không có phản hồi từ server hoặc lỗi mạng.');
        }
      }
    }
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    formikRef.current?.setFieldValue(
      'files',
      formikRef.current?.values.files.filter((_, i) => i !== index),
    );
  };

  const handleSubmit = async (values: FormData, actionType: string) => {
    try {
      setIsLoading(true);
      const {actionType: _, ...filteredValues} = values;
      if (actionType === 'next') {
        if ((formikRef.current?.values.files || []).length === 0) {
          Alert.alert('Lỗi', 'Vui lòng chọn ít nhất một file.');
          return;
        }

        console.log('Files before API call:', formikRef.current?.values);
        console.log('Filtered JSON:', JSON.stringify(filteredValues, null, 2));
        const response = await financialInfo(appId, filteredValues);
        if (response.code === 200) {
          navigation.replace('LoadingWorkflowLoan', {appId});
        }
      } else if (actionType === 'update') {
        const response = await updateFinancialInfo(appId, filteredValues);
        if (response.code === 200) {
          navigation.goBack();
        }
      }
    } catch (error) {
      console.log('Error submitting financial info:', error);
      Alert.alert(
        t('notification.title'),
        t('formCreateLoan.financialInfo.submitError'),
      );
    } finally {
      setIsLoading(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    boxInput: {
      marginBottom: 12,
    },
    headingTitle: {
      fontWeight: 'bold',
      marginBottom: 8,
      color: theme.text,
    },
    switchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    btn: {
      width: '100%',
      backgroundColor: '#007BFF',
      padding: 12,
      borderRadius: 12,
      marginTop: 8,
    },
    textWhite: {
      color: 'white',
      textAlign: 'center',
      fontWeight: 'bold',
    },
    uploadSection: {
      // backgroundColor: theme.buttonSubmit,
      borderRadius: 12,
      paddingVertical: 12,
    },
    uploadButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      // backgroundColor: theme.buttonSubmit,
      padding: 12,
      borderRadius: 8,
      borderWidth: 1,
      borderStyle: 'dashed',
      borderColor: theme.borderInputBackground,
    },
    uploadIcon: {
      marginRight: 8,
      width: 24,
      height: 24,
      tintColor: theme.borderInputBackground,
    },
    uploadText: {
      color: theme.borderInputBackground,
      fontSize: 14,
      fontWeight: '600',
    },
    filesList: {
      marginTop: 8,
    },
    fileItemContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.backgroundBox || '#f5f5f5',
      padding: 12,
      borderRadius: 8,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: 'rgba(0,0,0,0.1)',
    },
    fileContent: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
    },
    fileIcon: {
      marginRight: 4,
      width: 16,
      height: 16,
      tintColor: theme.noteText || '#666',
    },
    fileName: {
      flex: 1,
      color: theme.text,
      fontSize: 14,
    },
    fileSize: {
      color: theme.noteText || '#666',
      fontSize: 12,
      marginLeft: 8,
    },
    uploadInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    uploadInfoText: {
      color: theme.noteText || '#666',
      fontSize: 12,
      marginLeft: 4,
    },
    removeButton: {
      padding: 2,
      borderRadius: 12,
      backgroundColor: theme.error || '#ff4444',
      marginLeft: 8,
    },
    removeIcon: {
      width: 16,
      height: 16,
      tintColor: 'white',
    },
    errorText: {
      color: 'red',
      fontSize: 12,
      marginTop: 8,
    },
  });

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  const validationSchema = Yup.object().shape({
    jobTitle: Yup.string().required(t('formCreateLoan.errors.missingFields')),
    companyName: Yup.string().required(
      t('formCreateLoan.errors.missingFields'),
    ),
    companyAddress: Yup.string().required(
      t('formCreateLoan.errors.missingFields'),
    ),
    totalIncome: Yup.number()
      .min(1000000, t('formCreateLoan.errors.invalidAmount'))
      .required(t('formCreateLoan.errors.missingFields')),
    monthlyExpense: Yup.number()
      .min(0, t('formCreateLoan.errors.invalidAmount'))
      .required(t('formCreateLoan.errors.missingFields')),
    monthlySaving: Yup.number()
      .min(1000000, t('formCreateLoan.errors.invalidAmount'))
      .required(t('formCreateLoan.errors.missingFields')),
    monthlyDebt: Yup.number()
      .min(0, t('formCreateLoan.errors.invalidAmount'))
      .required(t('formCreateLoan.errors.missingFields')),
    monthlyLoanPayment: Yup.number()
      .min(1000000, t('formCreateLoan.errors.invalidAmount'))
      .required(t('formCreateLoan.errors.missingFields')),
    files: Yup.array()
      .of(Yup.string())
      .min(1, t('formCreateLoan.errors.missingFiles')) // hoặc t('Vui lòng tải lên ít nhất 1 tài liệu')
      .required(t('formCreateLoan.errors.missingFiles')),
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getworkflowbyapplicationid(appId);
        if (data.result) {
          const createLoanStep = data.result.steps.find(
            step => step.name === 'create-financial-info',
          );
          const lastValidHistory = createLoanStep?.metadata?.histories
            ?.filter(histories => !histories?.error)
            .at(-1);
          if (lastValidHistory) {
            const financialData =
              lastValidHistory?.response.approvalProcessResponse?.metadata;

            if (financialData) {
              const mapLoanToFormData = (loan: LoanResponse): FormData => ({
                jobTitle: financialData?.jobTitle || '',
                companyName: financialData?.companyName || '',
                companyAddress: financialData?.companyAddress || '',
                hasMarried: financialData?.hasMarried || false,
                totalIncome: financialData?.totalIncome || 0,
                monthlyExpense: financialData?.monthlyExpense || 0,
                monthlySaving: financialData?.monthlySaving || 0,
                monthlyDebt: financialData?.monthlyDebt || 0,
                monthlyLoanPayment: financialData?.monthlyLoanPayment || 0,
                files: [],
                actionType: '',
              });

              const converted = mapLoanToFormData(financialData);
              setFormData(prev => ({
                ...prev,
                ...converted,
              }));

              // Use Formik's setValues if available
              if (formikRef.current) {
                formikRef.current.setValues(converted);
              }
            }
          }
        }
      } catch (error) {
        console.error('Error fetching workflow:', error);
      }
    };

    fetchData();
  }, [appId]);

  return (
    <Formik
      initialValues={{...formData, actionType: ''}}
      validationSchema={validationSchema}
      onSubmit={values => {
        console.log('Formik onSubmit called with values:', values);
        handleSubmit(values, values.actionType);
      }}
      innerRef={formikRef}>
      {({
        handleChange,
        handleSubmit: formikHandleSubmit,
        values,
        errors,
        touched,
        setFieldValue,
      }) => {
        console.log('Formik errors:', errors);
        return (
          <TouchableWithoutFeedback
            onPress={Keyboard.dismiss}
            accessible={false}>
            <ScrollView style={styles.container}>
              <View>
                <View style={styles.boxInput}>
                  <Text style={styles.headingTitle}>
                    {t('formCreateLoan.financialInfo.jobTitle')}
                  </Text>
                  <InputBackground
                    placeholder={t(
                      'formCreateLoan.financialInfo.jobTitlePlaceholder',
                    )}
                    onChangeText={handleChange('jobTitle')}
                    value={values.jobTitle}
                  />
                  {touched.jobTitle && errors.jobTitle && (
                    <Text style={styles.errorText}>{errors.jobTitle}</Text>
                  )}
                </View>
                <View style={styles.boxInput}>
                  <Text style={styles.headingTitle}>
                    {t('formCreateLoan.financialInfo.companyName')}
                  </Text>
                  <InputBackground
                    placeholder={t(
                      'formCreateLoan.financialInfo.companyNamePlaceholder',
                    )}
                    onChangeText={handleChange('companyName')}
                    value={values.companyName}
                  />
                  {touched.companyName && errors.companyName && (
                    <Text style={styles.errorText}>{errors.companyName}</Text>
                  )}
                </View>

                <View style={styles.boxInput}>
                  <Text style={styles.headingTitle}>
                    {t('formCreateLoan.financialInfo.companyAddress')}
                  </Text>
                  <InputBackground
                    placeholder={t(
                      'formCreateLoan.financialInfo.companyAddressPlaceholder',
                    )}
                    onChangeText={handleChange('companyAddress')}
                    value={values.companyAddress}
                  />
                  {touched.companyAddress && errors.companyAddress && (
                    <Text style={styles.errorText}>
                      {errors.companyAddress}
                    </Text>
                  )}
                </View>

                <View style={styles.switchContainer}>
                  <Text style={styles.headingTitle}>
                    {t('formCreateLoan.financialInfo.hasMarried')}
                  </Text>
                  <Switch
                    value={values.hasMarried}
                    onValueChange={(value: boolean) => {
                      setFieldValue('hasMarried', value);
                    }}
                  />
                </View>

                <View style={styles.boxInput}>
                  <Text style={styles.headingTitle}>
                    {t('formCreateLoan.financialInfo.totalIncome')}
                  </Text>
                  <CurrencyInput
                    placeholder={t(
                      'formCreateLoan.financialInfo.totalIncomePlaceholder',
                    )}
                    value={values.totalIncome}
                    onChangeText={(value: number) =>
                      setFieldValue('totalIncome', value)
                    }
                  />
                  {touched.totalIncome && errors.totalIncome && (
                    <Text style={styles.errorText}>{errors.totalIncome}</Text>
                  )}
                </View>

                <View style={styles.boxInput}>
                  <Text style={styles.headingTitle}>
                    {t('formCreateLoan.financialInfo.monthlyExpense')}
                  </Text>
                  <CurrencyInput
                    placeholder={t(
                      'formCreateLoan.financialInfo.monthlyExpensePlaceholder',
                    )}
                    value={values.monthlyExpense}
                    onChangeText={(value: number) =>
                      setFieldValue('monthlyExpense', value)
                    }
                  />
                  {touched.monthlyExpense && errors.monthlyExpense && (
                    <Text style={styles.errorText}>
                      {errors.monthlyExpense}
                    </Text>
                  )}
                </View>

                <View style={styles.boxInput}>
                  <Text style={styles.headingTitle}>
                    {t('formCreateLoan.financialInfo.monthlySaving')}
                  </Text>
                  <CurrencyInput
                    placeholder={t(
                      'formCreateLoan.financialInfo.monthlySavingPlaceholder',
                    )}
                    value={values.monthlySaving}
                    onChangeText={(value: number) =>
                      setFieldValue('monthlySaving', value)
                    }
                  />
                  {touched.monthlySaving && errors.monthlySaving && (
                    <Text style={styles.errorText}>{errors.monthlySaving}</Text>
                  )}
                </View>

                <View style={styles.boxInput}>
                  <Text style={styles.headingTitle}>
                    {t('formCreateLoan.financialInfo.monthlyDebt')}
                  </Text>
                  <CurrencyInput
                    placeholder={t(
                      'formCreateLoan.financialInfo.monthlyDebtPlaceholder',
                    )}
                    value={values.monthlyDebt}
                    onChangeText={(value: number) =>
                      setFieldValue('monthlyDebt', value)
                    }
                  />
                  {touched.monthlyDebt && errors.monthlyDebt && (
                    <Text style={styles.errorText}>{errors.monthlyDebt}</Text>
                  )}
                </View>

                <View style={styles.boxInput}>
                  <Text style={styles.headingTitle}>
                    {t('formCreateLoan.financialInfo.monthlyLoanPayment')}
                  </Text>
                  <CurrencyInput
                    placeholder={t(
                      'formCreateLoan.financialInfo.monthlyLoanPaymentPlaceholder',
                    )}
                    value={values.monthlyLoanPayment}
                    onChangeText={(value: number) =>
                      setFieldValue('monthlyLoanPayment', value)
                    }
                  />
                  {touched.monthlyLoanPayment && errors.monthlyLoanPayment && (
                    <Text style={styles.errorText}>
                      {errors.monthlyLoanPayment}
                    </Text>
                  )}
                </View>

                <View style={styles.boxInput}>
                  <Text style={styles.headingTitle}>
                    {t('formCreateLoan.financialInfo.documents')}
                  </Text>

                  <View style={styles.uploadSection}>
                    <View style={styles.uploadInfo}>
                      <Image
                        source={AppIcons.infoIcon}
                        style={styles.fileIcon}
                      />
                      <Text style={styles.uploadInfoText}>
                        Hỗ trợ PDF, DOCX, JPG, PNG (Max: 5MB)
                      </Text>
                    </View>

                    <TouchableOpacity
                      style={styles.uploadButton}
                      onPress={handleDocumentPick}>
                      <Image
                        source={AppIcons.upLoad}
                        style={styles.uploadIcon}
                      />
                      <Text style={styles.uploadText}>
                        {t('formCreateLoan.financialInfo.uploadDocument')}
                      </Text>
                    </TouchableOpacity>

                    <View style={styles.filesList}>
                      {selectedFiles.map((file, index) => (
                        <View key={index} style={styles.fileItemContainer}>
                          <View style={styles.fileContent}>
                            <Image
                              source={AppIcons.infoIcon}
                              style={styles.fileIcon}
                            />
                            <Text style={styles.fileName} numberOfLines={1}>
                              {file.name}
                            </Text>
                            <Text style={styles.fileSize}>
                              {formatFileSize(file.size || 0)}
                            </Text>
                          </View>
                          <TouchableOpacity
                            style={styles.removeButton}
                            onPress={() => handleRemoveFile(index)}>
                            <Image
                              source={AppIcons.closeIcon}
                              style={styles.removeIcon}
                            />
                          </TouchableOpacity>
                        </View>
                      ))}
                    </View>
                  </View>
                </View>
                {fromScreen === 'InfoCreateLoan' ? (
                  <TouchableOpacity
                    style={[styles.btn, isLoading && {opacity: 0.7}]}
                    onPress={async () => {
                      setFieldValue('actionType', 'update');
                      formikHandleSubmit();
                    }}
                    disabled={isLoading}>
                    {isLoading ? (
                      <ActivityIndicator color="white" />
                    ) : (
                      <Text
                        style={[
                          styles.textWhite,
                          {fontWeight: 'bold', textAlign: 'center'},
                        ]}>
                        {currentLanguage === 'vi' ? 'Cập nhật' : 'Update'}
                      </Text>
                    )}
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={[styles.btn, isLoading && {opacity: 0.7}]}
                    onPress={() => {
                      console.log('Button pressed');
                      setFieldValue('actionType', 'next');
                      formikHandleSubmit();
                    }}
                    disabled={isLoading}>
                    {isLoading ? (
                      <ActivityIndicator color="white" />
                    ) : (
                      <Text style={styles.textWhite}>
                        {t('formCreateLoan.financialInfo.submit')}
                      </Text>
                    )}
                  </TouchableOpacity>
                )}
              </View>
            </ScrollView>
          </TouchableWithoutFeedback>
        );
      }}
    </Formik>
  );
};
export default FormCreateFinancialInfo;
