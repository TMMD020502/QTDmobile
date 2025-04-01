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
  landFields,
  commonFields,
  landMetadataFields,
  transferInfoFields,
  ownerInfoFields,
} from './formFields';
import {createStyles} from './styles';
import {Theme} from '../../theme/colors';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../navigators/RootNavigator';
import {ApiErrorResponse, LandFormData} from '../../api/types/addAssets';

interface FormLandFieldsProps {
  theme: Theme;
  appId: string;
  navigation: StackNavigationProp<RootStackParamList>;
}

const FormLandFields: React.FC<FormLandFieldsProps> = ({
  theme,
  appId,
  navigation,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<LandFormData>({
    assetType: 'LAND',
    title: '',
    ownershipType: 'INDIVIDUAL',
    proposedValue: 0,
    documents: [],
    application: {id: appId},
    landAsset: {
      plotNumber: '',
      mapNumber: '',
      address: '',
      area: 0,
      purpose: '',
      expirationDate: '',
      originOfUsage: '',
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
      metadata: {
        zoning: '',
        frontage: '',
        landUseRights: '',
        developmentPotential: '',
      },
    },
  });

  const [selectedDateField, setSelectedDateField] = useState<string | null>(
    null,
  );
  const [tempDate, setTempDate] = useState(new Date());

  console.log('formData', formData);

  const styles = createStyles(theme);

  const handleChange = (field: string, value: any) => {
    setFormData(prev => {
      const pathParts = field.split('.');

      if (pathParts.length === 1) {
        return {
          ...prev,
          [field]: value,
        };
      } else if (pathParts.length === 2 && pathParts[0] === 'landAsset') {
        return {
          ...prev,
          landAsset: {
            ...prev.landAsset,
            [pathParts[1]]: value,
          },
        };
      } else if (pathParts.length === 3 && pathParts[0] === 'landAsset') {
        const section = pathParts[1];
        const field = pathParts[2];

        return {
          ...prev,
          landAsset: {
            ...prev.landAsset,
            [section]: {
              ...prev.landAsset[section],
              [field]: value,
            },
          },
        };
      }

      return prev;
    });
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const response = await addAssetCollateral(appId, formData);
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

  // Utility function to format dates to required API format
  const formatDateForAPI = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}T00:00:00Z`;
  };

  const handleDatePress = (fieldPath: string) => {
    let currentValue = null;
    const pathParts = fieldPath.split('.');

    if (pathParts.length === 2) {
      currentValue =
        formData.landAsset[pathParts[1] as keyof typeof formData.landAsset];
    } else if (pathParts.length === 3) {
      const section = formData.landAsset[
        pathParts[1] as keyof typeof formData.landAsset
      ] as any;
      currentValue = section[pathParts[2]];
    }

    setTempDate(currentValue ? new Date(currentValue) : new Date());
    setSelectedDateField(fieldPath);
  };

  const handleDateConfirm = (dateString: string) => {
    if (selectedDateField) {
      const pathParts = selectedDateField.split('.');
      // Format the date in the required format for API
      const formattedDate = formatDateForAPI(new Date(dateString));

      if (pathParts.length === 2) {
        setFormData(prev => ({
          ...prev,
          landAsset: {
            ...prev.landAsset,
            [pathParts[1]]: formattedDate,
          },
        }));
      } else if (pathParts.length === 3) {
        setFormData(prev => ({
          ...prev,
          landAsset: {
            ...prev.landAsset,
            [pathParts[1]]: {
              ...prev.landAsset[pathParts[1]],
              [pathParts[2]]: formattedDate,
            },
          },
        }));
      }
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
      const displayValue = value ? formatDate(new Date(value)) : '';
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
          value={Number(value) || 0}
          onChangeText={numValue => handleChange(fieldPath, numValue)}
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
        keyboardType={field.numeric ? 'numeric' : 'default'}
      />
    );
  };

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      nestedScrollEnabled={true}
      showsVerticalScrollIndicator={false}>
      <View style={styles.wrapper}>
        <ScrollView
          style={styles.container}
          scrollEnabled={!selectedDateField} // Disable scroll when date picker is visible
        >
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

          {/* Land Fields */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Thông tin đất</Text>
            {landFields.map(({field, label, placeholder, numeric, isDate}) => (
              <View key={field} style={styles.fieldContainer}>
                <Text style={styles.label}>{label}</Text>
                {renderField(
                  {field, label, placeholder, numeric, isDate},
                  getInputValue(
                    formData.landAsset[
                      field as keyof typeof formData.landAsset
                    ],
                  ),
                  `landAsset.${field}`,
                )}
              </View>
            ))}
          </View>

          {/* Owner Info Fields */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Thông tin chủ sở hữu</Text>
            {ownerInfoFields.map(({field, label, placeholder, isDate}) => (
              <View key={field} style={styles.fieldContainer}>
                <Text style={styles.label}>{label}</Text>
                {renderField(
                  {field, label, placeholder, isDate},
                  getInputValue(
                    formData.landAsset.ownerInfo[
                      field as keyof typeof formData.landAsset.ownerInfo
                    ],
                  ),
                  `landAsset.ownerInfo.${field}`,
                )}
              </View>
            ))}
          </View>

          {/* Land Metadata Fields */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Thông tin bổ sung</Text>
            {landMetadataFields.map(({field, label, placeholder}) => (
              <View key={field} style={styles.fieldContainer}>
                <Text style={styles.label}>{label}</Text>
                {renderField(
                  {field, label, placeholder},
                  getInputValue(
                    formData.landAsset.metadata[
                      field as keyof typeof formData.landAsset.metadata
                    ],
                  ),
                  `landAsset.metadata.${field}`,
                )}
              </View>
            ))}
          </View>

          {/* Transfer Info Fields */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Thông tin chuyển nhượng</Text>
            {transferInfoFields.map(({field, label, placeholder, isDate}) => (
              <View key={field} style={styles.fieldContainer}>
                <Text style={styles.label}>{label}</Text>
                {renderField(
                  {field, label, placeholder, isDate},
                  getInputValue(
                    formData.landAsset.transferInfo[
                      field as keyof typeof formData.landAsset.transferInfo
                    ],
                  ),
                  `landAsset.transferInfo.${field}`,
                )}
              </View>
            ))}
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

        {/* Move DatePicker outside ScrollView */}
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

export default FormLandFields;
