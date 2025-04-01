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
  apartmentFields,
  commonFields,
  apartmentMetadataFields,
  transferInfoFields,
  ownerInfoFields,
} from './formFields';
import {createStyles} from './styles';
import {Theme} from '../../theme/colors';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../navigators/RootNavigator';
import {ApartmentFormData, ApiErrorResponse} from '../../api/types/addAssets';

interface FormApartmentFieldsProps {
  theme: Theme;
  appId: string;
  onSuccess?: () => void;
  navigation?: StackNavigationProp<RootStackParamList>;
}

const FormApartmentFields: React.FC<FormApartmentFieldsProps> = ({
  theme,
  appId,
  navigation,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDateField, setSelectedDateField] = useState<string | null>(
    null,
  );
  const [tempDate, setTempDate] = useState(new Date());
  const [formData, setFormData] = useState<ApartmentFormData>({
    assetType: 'APARTMENT',
    title: '',
    ownershipType: 'INDIVIDUAL',
    proposedValue: 0,
    documents: ['apartment_cert.pdf', 'ownership_papers.pdf'],
    application: {id: appId},
    apartment: {
      plotNumber: '',
      mapNumber: '',
      address: '',
      area: 0,
      purpose: '',
      name: '',
      floorArea: 0,
      typeOfHousing: '',
      typeOfOwnership: '',
      ownershipTerm: '',
      notes: '',
      sharedFacilities: '',
      certificateNumber: '',
      certificateBookNumber: '',
      issuingAuthority: '',
      issueDate: '',
      expirationDate: '',
      originOfUsage: '',
      metadata: {
        parkingSpace: '',
        floor: 0,
        view: '',
        renovationStatus: '',
      },
      ownerInfo: {
        fullName: '',
        dayOfBirth: '',
        idCardNumber: '',
        permanentAddress: '',
      },
      transferInfo: {
        fullName: '',
        dayOfBirth: '',
        idCardNumber: '',
        permanentAddress: '',
        transferDate: '',
        transferRecordNumber: '',
      },
    },
  });

  const styles = createStyles(theme);

  const handleChange = (field: string, value: any) => {
    setFormData(prev => {
      if (field.startsWith('apartment.metadata.')) {
        const metadataField = field.split('.')[2];
        return {
          ...prev,
          apartment: {
            ...prev.apartment,
            metadata: {
              ...prev.apartment.metadata,
              [metadataField]: value,
            },
          },
        };
      }
      if (field.startsWith('apartment.ownerInfo.')) {
        const ownerField = field.split('.')[2];
        return {
          ...prev,
          apartment: {
            ...prev.apartment,
            ownerInfo: {
              ...prev.apartment.ownerInfo,
              [ownerField]: value,
            },
          },
        };
      }
      if (field.startsWith('apartment.transferInfo.')) {
        const transferField = field.split('.')[2];
        return {
          ...prev,
          apartment: {
            ...prev.apartment,
            transferInfo: {
              ...prev.apartment.transferInfo,
              [transferField]: value,
            },
          },
        };
      }
      if (field.startsWith('apartment.')) {
        const apartmentField = field.split('.')[1];
        return {
          ...prev,
          apartment: {
            ...prev.apartment,
            [apartmentField]: value,
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
      // Navigate to CreditRating with the appId
      if (response && navigation) {
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
        formData.apartment[pathParts[1] as keyof typeof formData.apartment];
    } else if (pathParts.length === 3) {
      const section = formData.apartment[
        pathParts[1] as keyof typeof formData.apartment
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

  const getFieldValue = (fieldPath: string): any => {
    const parts = fieldPath.split('.');

    // Handle direct properties of formData
    if (parts.length === 1) {
      return formData[parts[0] as keyof typeof formData];
    }

    // Handle apartment properties
    if (parts.length >= 2 && parts[0] === 'apartment') {
      if (parts.length === 2) {
        return formData.apartment[parts[1] as keyof typeof formData.apartment];
      }

      // Handle nested properties
      if (parts.length === 3) {
        const section = formData.apartment[
          parts[1] as keyof typeof formData.apartment
        ] as any;
        if (section) {
          return section[parts[2]];
        }
      }
    }

    return '';
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
                    getInputValue(formData[field as keyof typeof formData]),
                    field,
                  )}
                </View>
              ),
            )}
          </View>

          {/* Apartment Fields */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Thông tin căn hộ</Text>
            {apartmentFields.map(
              ({field, label, placeholder, numeric, isDate}) => (
                <View key={field} style={styles.fieldContainer}>
                  <Text style={styles.label}>{label}</Text>
                  {renderField(
                    {field, label, placeholder, numeric, isDate},
                    getFieldValue(`apartment.${field}`),
                    `apartment.${field}`,
                  )}
                </View>
              ),
            )}
          </View>

          {/* Owner Info Fields */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Thông tin chủ sở hữu</Text>
            {ownerInfoFields.map(
              ({field, label, placeholder, numeric, isDate}) => (
                <View key={field} style={styles.fieldContainer}>
                  <Text style={styles.label}>{label}</Text>
                  {renderField(
                    {field, label, placeholder, numeric, isDate},
                    getFieldValue(`apartment.ownerInfo.${field}`),
                    `apartment.ownerInfo.${field}`,
                  )}
                </View>
              ),
            )}
          </View>

          {/* Apartment Metadata */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Thông tin bổ sung</Text>
            {apartmentMetadataFields.map(
              ({field, label, placeholder, numeric}) => (
                <View key={field} style={styles.fieldContainer}>
                  <Text style={styles.label}>{label}</Text>
                  {renderField(
                    {field, label, placeholder, numeric},
                    getFieldValue(`apartment.metadata.${field}`),
                    `apartment.metadata.${field}`,
                  )}
                </View>
              ),
            )}
          </View>

          {/* Transfer Info Fields */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Thông tin chuyển nhượng</Text>
            {transferInfoFields.map(
              ({field, label, placeholder, numeric, isDate}) => (
                <View key={field} style={styles.fieldContainer}>
                  <Text style={styles.label}>{label}</Text>
                  {renderField(
                    {field, label, placeholder, numeric, isDate},
                    getFieldValue(`apartment.transferInfo.${field}`),
                    `apartment.transferInfo.${field}`,
                  )}
                </View>
              ),
            )}
          </View>

          {/* Submit Button */}
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

export default FormApartmentFields;
