import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Alert,
} from 'react-native';
import InputBackground from '../InputBackground/InputBackground';
import CurrencyInput from '../CurrencyInput/CurrencyInput';
import DatePicker from '../DatePicker/DatePicker';
import {formatDate} from '../../utils/dateUtils';
import {addAssetCollateral} from '../../api/services/loan';
import {
  machineryFields,
  commonFields,
  machineryMetadataFields,
} from './formFields';
import {createStyles} from './styles';
import {Theme} from '../../theme/colors';
import KeyboardWrapper from '../KeyboardWrapper/KeyboardWrapper';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../navigators/RootNavigator';
import {ApiErrorResponse, MachineryFormData} from '../../api/types/addAssets';

interface FormMachineryFieldsProps {
  theme: Theme;
  appId: string;
  onSuccess?: () => void;
  navigation: StackNavigationProp<RootStackParamList>;
}

const FormMachineryFields: React.FC<FormMachineryFieldsProps> = ({
  theme,
  appId,
  navigation,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDateField, setSelectedDateField] = useState<string | null>(
    null,
  );
  const [tempDate, setTempDate] = useState(new Date());
  const [formData, setFormData] = useState<MachineryFormData>({
    assetType: 'MACHINERY',
    title: '',
    ownershipType: 'INDIVIDUAL',
    proposedValue: 0,
    documents: ['machinery_specs.pdf', 'warranty.pdf'],
    application: {id: appId},
    machinery: {
      name: '',
      model: '',
      manufacturer: '',
      manufactureDate: '',
      purchaseDate: '',
      purchasePrice: 0,
      serialNumber: '',
      location: '',
      status: '',
      note: '',
      metadata: {
        warranty: '',
        maintenanceSchedule: '',
        powerConsumption: '',
        precision: '',
      },
    },
  });

  const styles = createStyles(theme);

  const handleChange = (field: string, value: any) => {
    setFormData(prev => {
      if (field.startsWith('machinery.metadata.')) {
        const metadataField = field.split('.')[2];
        return {
          ...prev,
          machinery: {
            ...prev.machinery,
            metadata: {
              ...prev.machinery.metadata,
              [metadataField]: value,
            },
          },
        };
      }
      if (field.startsWith('machinery.')) {
        const machineryField = field.split('.')[1];
        return {
          ...prev,
          machinery: {
            ...prev.machinery,
            [machineryField]: value,
          },
        };
      }
      return {
        ...prev,
        [field]: value,
      };
    });
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const response = await addAssetCollateral(appId, formData);
      console.log('Successfully submitted machinery details:', response);

      // Navigate to CreditRating with the appId
      if (response) {
        navigation.replace('CreditRating', {appId});
      }
    } catch (error) {
      const apiError = error as ApiErrorResponse;
      console.log('Error submitting:', apiError);
      if (
        apiError?.message ===
        'Dependency step not completed (create-loan-request:inprogress)'
      ) {
        Alert.alert(
          'Thông báo',
          'Vui lòng đợi yêu cầu vay xét duyệt để tạo tiếp',
        );
      } else if (
        apiError?.message ===
        'Dependency step not completed (create-loan-plan:inprogress)'
      ) {
        Alert.alert(
          'Thông báo',
          'Vui lòng đợi kế hoạch vay xét duyệt để tạo tiếp',
        );
      } else {
        Alert.alert('Thông báo', 'Có lỗi khi tạo khoản vay');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getInputValue = (value: any): string => {
    if (value === undefined || value === null) return '';
    return String(value);
  };

  const handleDatePress = (fieldPath: string) => {
    let currentValue = null;
    const pathParts = fieldPath.split('.');

    if (pathParts.length === 2) {
      currentValue =
        formData.machinery[pathParts[1] as keyof typeof formData.machinery];
    } else if (pathParts.length === 3) {
      const section = formData.machinery[
        pathParts[1] as keyof typeof formData.machinery
      ] as any;
      currentValue = section[pathParts[2]];
    }

    setTempDate(currentValue ? new Date(currentValue) : new Date());
    setSelectedDateField(fieldPath);
  };

  const handleDateConfirm = (dateString: string) => {
    if (selectedDateField) {
      // Convert the date to the required format: YYYY-MM-DDT00:00:00Z
      const date = new Date(dateString);
      const formattedDate = date.toISOString().split('T')[0] + 'T00:00:00Z';

      handleChange(selectedDateField, formattedDate);
      setSelectedDateField(null);
    }
  };

  const handleDateChange = (date: Date) => {
    setTempDate(date);
  };

  const validateNumericInput = (value: string): string => {
    // Remove any non-numeric characters except dots for decimal numbers
    const cleanedValue = value.replace(/[^0-9.]/g, '');

    // Ensure only one decimal point
    const parts = cleanedValue.split('.');
    if (parts.length > 2) {
      return parts[0] + '.' + parts[1];
    }

    return cleanedValue;
  };

  const renderField = (
    field: any,
    value: string | number,
    fieldPath: string,
  ) => {
    if (field.isDate) {
      const displayValue = value ? formatDate(new Date(value as string)) : '';
      return (
        <TouchableOpacity
          style={styles.dateInput}
          onPress={() => handleDatePress(fieldPath)}>
          <Text
            style={
              displayValue ? styles.dateInputText : styles.dateInputPlaceholder
            }>
            {displayValue || field.placeholder}
          </Text>
        </TouchableOpacity>
      );
    }

    if (field.isCurrency) {
      return (
        <CurrencyInput
          value={typeof value === 'number' ? value : 0}
          onChangeText={(numValue: number) => handleChange(fieldPath, numValue)}
          placeholder={field.placeholder}
        />
      );
    }

    return (
      <InputBackground
        value={getInputValue(value)}
        onChangeText={value => {
          if (field.numeric) {
            const validatedValue = validateNumericInput(value);
            handleChange(
              fieldPath,
              validatedValue ? Number(validatedValue) : 0,
            );
          } else {
            handleChange(fieldPath, value);
          }
        }}
        placeholder={field.placeholder}
        keyboardType={field.numeric ? 'decimal-pad' : 'default'}
      />
    );
  };

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      nestedScrollEnabled={true}
      showsVerticalScrollIndicator={false}>
      <View style={[styles.wrapper, {minHeight: '100%'}]}>
        <ScrollView style={styles.container} scrollEnabled={!selectedDateField}>
          {/* Common Fields */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Thông tin cơ bản</Text>
            {commonFields.map(
              ({field, label, placeholder, numeric, isCurrency}) => (
                <View key={field} style={styles.fieldContainer}>
                  <Text style={styles.label}>{label}</Text>
                  {renderField(
                    {field, label, placeholder, numeric, isCurrency},
                    getInputValue(formData[field as keyof typeof formData]), // Add type assertion
                    field,
                  )}
                </View>
              ),
            )}
          </View>

          {/* Machinery Fields */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Thông tin máy móc</Text>
            {machineryFields.map(
              ({field, label, placeholder, isDate, numeric, isCurrency}) => (
                <View key={field} style={styles.fieldContainer}>
                  <Text style={styles.label}>{label}</Text>
                  {renderField(
                    {field, label, placeholder, isDate, numeric, isCurrency},
                    getInputValue(
                      formData.machinery[
                        field as keyof typeof formData.machinery
                      ],
                    ),
                    `machinery.${field}`,
                  )}
                </View>
              ),
            )}
          </View>

          {/* Metadata Fields */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Thông tin bổ sung</Text>
            {machineryMetadataFields.map(
              ({field, label, placeholder, numeric, isCurrency}) => (
                <View key={field} style={styles.fieldContainer}>
                  <Text style={styles.label}>{label}</Text>
                  {renderField(
                    {field, label, placeholder, numeric, isCurrency},
                    getInputValue(
                      formData.machinery.metadata[
                        field as keyof typeof formData.machinery.metadata
                      ],
                    ),
                    `machinery.metadata.${field}`,
                  )}
                </View>
              ),
            )}
          </View>

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Tiếp tục</Text>
            )}
          </TouchableOpacity>
        </ScrollView>

        {selectedDateField && (
          <DatePicker
            isVisible={!!selectedDateField}
            onClose={() => setSelectedDateField(null)}
            onConfirm={handleDateConfirm}
            value={tempDate}
            onChange={handleDateChange}
            theme={theme}
            locale="vi-VN"
          />
        )}
      </View>
    </ScrollView>
  );
};

export default FormMachineryFields;
