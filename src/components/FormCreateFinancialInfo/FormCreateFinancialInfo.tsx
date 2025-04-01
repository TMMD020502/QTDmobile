/* eslint-disable react-native/no-inline-styles */
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
} from 'react-native';
import React, {useState} from 'react';
import InputBackground from '../InputBackground/InputBackground';
import CurrencyInput from '../CurrencyInput/CurrencyInput';
import {useTranslation} from 'react-i18next';
import {Theme} from '../../theme/colors';
import {financialInfo} from '../../api/services/loan';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../navigators/RootNavigator';
import DocumentPicker, {
  DocumentPickerResponse,
} from 'react-native-document-picker';
import {AppIcons} from '../../icons';
import KeyboardWrapper from '../KeyboardWrapper/KeyboardWrapper';

interface FormCreateFinancialInfoProps {
  theme: Theme;
  navigation: StackNavigationProp<RootStackParamList, 'CreateFinancialInfo'>;
  appId: string;
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
}

const FormCreateFinancialInfo: React.FC<FormCreateFinancialInfoProps> = ({
  theme,
  navigation,
  appId,
}) => {
  const {t} = useTranslation();

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
  });

  const [isLoading, setIsLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<DocumentPickerResponse[]>(
    [],
  );

  console.log('selectedFiles:', formData);

  const handleOnchange = (field: keyof FormData, value: any): void => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDocumentPick = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });

      const file = result[0];
      setSelectedFiles(prev => [...prev, file]);

      const formDataFile = new FormData();
      formDataFile.append('file', {
        uri: file.uri,
        name: file.name,
        type: file.type,
      });

      const response = await fetch('https://your-api.com/upload', {
        method: 'POST',
        body: formDataFile,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const uploadResult = await response.json();
      setFormData(prev => ({
        ...prev,
        files: [...prev.files, uploadResult.data],
      }));
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker
      } else {
        Alert.alert('Error', 'Failed to upload document');
      }
    }
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const response = await financialInfo(appId, formData);

      if (response) {
        navigation.replace('AssetCollateral', {appId});
      }
    } catch (error) {
      console.error('Error submitting financial info:', error);
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
  });

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  return (
    <KeyboardWrapper>
      <ScrollView style={styles.container}>
        <View style={styles.boxInput}>
          <Text style={styles.headingTitle}>
            {t('formCreateLoan.financialInfo.jobTitle')}
          </Text>
          <InputBackground
            placeholder={t('formCreateLoan.financialInfo.jobTitlePlaceholder')}
            onChangeText={(value: string) => handleOnchange('jobTitle', value)}
            value={formData.jobTitle}
          />
        </View>

        <View style={styles.boxInput}>
          <Text style={styles.headingTitle}>
            {t('formCreateLoan.financialInfo.companyName')}
          </Text>
          <InputBackground
            placeholder={t(
              'formCreateLoan.financialInfo.companyNamePlaceholder',
            )}
            onChangeText={(value: string) =>
              handleOnchange('companyName', value)
            }
            value={formData.companyName}
          />
        </View>

        <View style={styles.boxInput}>
          <Text style={styles.headingTitle}>
            {t('formCreateLoan.financialInfo.companyAddress')}
          </Text>
          <InputBackground
            placeholder={t(
              'formCreateLoan.financialInfo.companyAddressPlaceholder',
            )}
            onChangeText={(value: string) =>
              handleOnchange('companyAddress', value)
            }
            value={formData.companyAddress}
          />
        </View>

        <View style={styles.switchContainer}>
          <Text style={styles.headingTitle}>
            {t('formCreateLoan.financialInfo.hasMarried')}
          </Text>
          <Switch
            value={formData.hasMarried}
            onValueChange={value => handleOnchange('hasMarried', value)}
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
            onChangeText={(value: number) =>
              handleOnchange('totalIncome', value)
            }
            value={formData.totalIncome}
          />
        </View>

        <View style={styles.boxInput}>
          <Text style={styles.headingTitle}>
            {t('formCreateLoan.financialInfo.monthlyExpense')}
          </Text>
          <CurrencyInput
            placeholder={t(
              'formCreateLoan.financialInfo.monthlyExpensePlaceholder',
            )}
            onChangeText={(value: number) =>
              handleOnchange('monthlyExpense', value)
            }
            value={formData.monthlyExpense}
          />
        </View>

        <View style={styles.boxInput}>
          <Text style={styles.headingTitle}>
            {t('formCreateLoan.financialInfo.monthlySaving')}
          </Text>
          <CurrencyInput
            placeholder={t(
              'formCreateLoan.financialInfo.monthlySavingPlaceholder',
            )}
            onChangeText={(value: number) =>
              handleOnchange('monthlySaving', value)
            }
            value={formData.monthlySaving}
          />
        </View>

        <View style={styles.boxInput}>
          <Text style={styles.headingTitle}>
            {t('formCreateLoan.financialInfo.monthlyDebt')}
          </Text>
          <CurrencyInput
            placeholder={t(
              'formCreateLoan.financialInfo.monthlyDebtPlaceholder',
            )}
            onChangeText={(value: number) =>
              handleOnchange('monthlyDebt', value)
            }
            value={formData.monthlyDebt}
          />
        </View>

        <View style={styles.boxInput}>
          <Text style={styles.headingTitle}>
            {t('formCreateLoan.financialInfo.monthlyLoanPayment')}
          </Text>
          <CurrencyInput
            placeholder={t(
              'formCreateLoan.financialInfo.monthlyLoanPaymentPlaceholder',
            )}
            onChangeText={(value: number) =>
              handleOnchange('monthlyLoanPayment', value)
            }
            value={formData.monthlyLoanPayment}
          />
        </View>

        <View style={styles.boxInput}>
          <Text style={styles.headingTitle}>
            {t('formCreateLoan.financialInfo.documents')}
          </Text>

          <View style={styles.uploadSection}>
            <View style={styles.uploadInfo}>
              <Image source={AppIcons.infoIcon} style={styles.fileIcon} />
              <Text style={styles.uploadInfoText}>
                Hỗ trợ PDF, DOCX, JPG, PNG (Max: 5MB)
              </Text>
            </View>

            <TouchableOpacity
              style={styles.uploadButton}
              onPress={handleDocumentPick}>
              <Image source={AppIcons.upLoad} style={styles.uploadIcon} />
              <Text style={styles.uploadText}>
                {t('formCreateLoan.financialInfo.uploadDocument')}
              </Text>
            </TouchableOpacity>

            <View style={styles.filesList}>
              {selectedFiles.map((file, index) => (
                <View key={index} style={styles.fileItemContainer}>
                  <View style={styles.fileContent}>
                    <Image source={AppIcons.infoIcon} style={styles.fileIcon} />
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

        <TouchableOpacity
          style={[styles.btn, isLoading && {opacity: 0.7}]}
          onPress={handleSubmit}
          disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.textWhite}>
              {t('formCreateLoan.financialInfo.submit')}
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardWrapper>
  );
};

export default FormCreateFinancialInfo;
