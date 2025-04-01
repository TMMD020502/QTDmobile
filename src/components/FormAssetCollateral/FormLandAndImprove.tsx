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
  commonFields,
  landFields,
  ownerInfoFields,
  transferInfoFields,
  landAndImprovementFields,
  landAndImprovementMetadataFields,
} from './formFields';
import {createStyles} from './styles';
import {Theme} from '../../theme/colors';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../navigators/RootNavigator';
import {
  LandAndImprovementFormData,
  ApiErrorResponse,
} from '../../api/types/addAssets';

interface FormLandAndImproveProps {
  theme: Theme;
  appId: string;
  navigation: StackNavigationProp<RootStackParamList>;
}

const FormLandAndImprove: React.FC<FormLandAndImproveProps> = ({
  theme,
  appId,
  navigation,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDateField, setSelectedDateField] = useState<string | null>(
    null,
  );
  const [tempDate, setTempDate] = useState(new Date());
  const [formData, setFormData] = useState<LandAndImprovementFormData>({
    assetType: 'LAND_AND_IMPROVEMENT',
    title: '',
    ownershipType: 'INDIVIDUAL',
    proposedValue: 0,
    documents: ['deed.pdf', 'construction_permit.pdf'],
    application: {id: appId},
    landAndImprovement: {
      plotNumber: '',
      mapNumber: '',
      address: '',
      area: 0,
      purpose: '',
      expirationDate: '',
      originOfUsage: '',
      typeOfHousing: '',
      floorArea: 0,
      ancillaryFloorArea: '',
      structureType: '',
      numberOfFloors: 0,
      constructionYear: 0,
      typeOfOwnership: '',
      ownershipTerm: '',
      notes: '',
      sharedFacilities: '',
      certificateNumber: '',
      certificateBookNumber: '',
      issuingAuthority: '',
      issueDate: '',
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
        constructionPermit: '',
        lastRenovation: '',
        buildingMaterials: '',
        parkingSpaces: 0,
      },
    },
  });

  console.log('formData', formData);

  const styles = createStyles(theme);

  const handleChange = (field: string, value: any) => {
    setFormData(prev => {
      if (field.startsWith('landAndImprovement.metadata.')) {
        const metadataField = field.split('.')[2];
        return {
          ...prev,
          landAndImprovement: {
            ...prev.landAndImprovement,
            metadata: {
              ...prev.landAndImprovement.metadata,
              [metadataField]: value,
            },
          },
        };
      }
      if (field.startsWith('landAndImprovement.ownerInfo.')) {
        const ownerInfoField = field.split('.')[2];
        return {
          ...prev,
          landAndImprovement: {
            ...prev.landAndImprovement,
            ownerInfo: {
              ...prev.landAndImprovement.ownerInfo,
              [ownerInfoField]: value,
            },
          },
        };
      }
      if (field.startsWith('landAndImprovement.transferInfo.')) {
        const transferInfoField = field.split('.')[2];
        return {
          ...prev,
          landAndImprovement: {
            ...prev.landAndImprovement,
            transferInfo: {
              ...prev.landAndImprovement.transferInfo,
              [transferInfoField]: value,
            },
          },
        };
      }
      if (field.startsWith('landAndImprovement.')) {
        const landField = field.split('.')[1];
        return {
          ...prev,
          landAndImprovement: {
            ...prev.landAndImprovement,
            [landField]: value,
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
        formData.landAndImprovement[
          pathParts[1] as keyof typeof formData.landAndImprovement
        ];
    } else if (pathParts.length === 3) {
      const section = formData.landAndImprovement[
        pathParts[1] as keyof typeof formData.landAndImprovement
      ] as any;
      if (section) {
        currentValue = section[pathParts[2]];
      }
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
          if (field.numeric || fieldPath.includes('idCardNumber')) {
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
        keyboardType={
          field.numeric || fieldPath.includes('idCardNumber')
            ? 'decimal-pad'
            : 'default'
        }
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
                    getInputValue(formData[field]),
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
                    formData.landAndImprovement[
                      field as keyof typeof formData.landAndImprovement
                    ],
                  ),
                  `landAndImprovement.${field}`,
                )}
              </View>
            ))}
          </View>

          {/* Land and Improvement Fields */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Thông tin cải tạo</Text>
            {landAndImprovementFields.map(
              ({field, label, placeholder, numeric, isDate}) => (
                <View key={field} style={styles.fieldContainer}>
                  <Text style={styles.label}>{label}</Text>
                  {renderField(
                    {field, label, placeholder, numeric, isDate},
                    getInputValue(
                      formData.landAndImprovement[
                        field as keyof typeof formData.landAndImprovement
                      ],
                    ),
                    `landAndImprovement.${field}`,
                  )}
                </View>
              ),
            )}
          </View>

          {/* Owner Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Thông tin chủ sở hữu</Text>
            {ownerInfoFields.map(
              ({field, label, placeholder, isDate, numeric}) => (
                <View key={field} style={styles.fieldContainer}>
                  <Text style={styles.label}>{label}</Text>
                  {renderField(
                    {field, label, placeholder, isDate, numeric},
                    getInputValue(
                      formData.landAndImprovement.ownerInfo[
                        field as keyof typeof formData.landAndImprovement.ownerInfo
                      ],
                    ),
                    `landAndImprovement.ownerInfo.${field}`,
                  )}
                </View>
              ),
            )}
          </View>

          {/* Transfer Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Thông tin chuyển nhượng</Text>
            {transferInfoFields.map(
              ({field, label, placeholder, isDate, numeric}) => (
                <View key={field} style={styles.fieldContainer}>
                  <Text style={styles.label}>{label}</Text>
                  {renderField(
                    {field, label, placeholder, isDate, numeric},
                    getInputValue(
                      formData.landAndImprovement.transferInfo[
                        field as keyof typeof formData.landAndImprovement.transferInfo
                      ],
                    ),
                    `landAndImprovement.transferInfo.${field}`,
                  )}
                </View>
              ),
            )}
          </View>

          {/* Metadata Fields */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Thông tin bổ sung</Text>
            {landAndImprovementMetadataFields.map(
              ({field, label, placeholder, numeric}) => (
                <View key={field} style={styles.fieldContainer}>
                  <Text style={styles.label}>{label}</Text>
                  {renderField(
                    {field, label, placeholder, numeric},
                    getInputValue(
                      formData.landAndImprovement.metadata[
                        field as keyof typeof formData.landAndImprovement.metadata
                      ],
                    ),
                    `landAndImprovement.metadata.${field}`,
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

export default FormLandAndImprove;
