import React, {useEffect, useState} from 'react';
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
import {
  addAssetCollateral,
  getworkflowbyapplicationid,
  updateAssetCollateral,
} from '../../api/services/loan';
import {
  vehicleFields,
  vehicleMetadataFields,
  commonFields,
  ownerInfoFields,
} from './formFields';
import {createStyles} from './styles';
import {Theme} from '../../theme/colors';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../navigators/RootNavigator';
import {
  ApiErrorResponse,
  OwnerInfo,
  OwnershipType,
  VehicleFormData,
} from '../../api/types/addAssets';
import {useRoute} from '@react-navigation/native';
import {History} from '../../api/types/loanworkflowtypes';
import {getDocuments} from '../../api/services/uploadImage';
import {DocumentPickerResponse} from 'react-native-document-picker';
import DocumentUpload from '../DocumentUpload/documentupload';

interface FormVehicleFieldsProps {
  theme: Theme;
  appId: string;
  status?: string;
  fromScreen?: string;
  onSuccess?: () => void;
  navigation: StackNavigationProp<RootStackParamList>;
}

interface ExtendedDocumentPickerResponse extends DocumentPickerResponse {
  source: 'local' | 'server';
}

const FormVehicleFields: React.FC<FormVehicleFieldsProps> = ({
  theme,
  navigation,
}) => {
  const route = useRoute();
  const {appId, fromScreen, status} = route.params as {
    appId: string;
    fromScreen?: string;
    status?: string;
  };
  const [isLoading, setIsLoading] = useState(false);
  const [transactionId, setTransactionId] = useState<string>();
  const [selectedDateField, setSelectedDateField] = useState<string | null>(
    null,
  );

  const [selectedFiles, setSelectedFiles] = useState<
    ExtendedDocumentPickerResponse[]
  >([]);
  const [tempDate, setTempDate] = useState(new Date());
  const [formData, setFormData] = useState<VehicleFormData>({
    assetType: 'VEHICLE',
    title: 'Villa with Land in District 1',
    ownershipType: 'INDIVIDUAL',
    proposedValue: 800000000,
    landAndImprovement: null,
    // location: null,
    // apartment: null,
    // landAsset: null,
    //machinery: null,
    // otherAsset: null,
    // marketStalls: null,
    documents: [],
    application: {id: appId},
    ownerInfos: [
      {
        fullName: 'John Doe',
        dayOfBirth: '1980-01-01T00:00:00Z',
        idCardNumber: '123456789012',
        idIssueDate: '2022-01-01T07:00:00Z',
        idIssuePlace: 'công an HCM',
        permanentAddress: '123 Villa Street, District 1',
      },
    ],
    transferInfo: {
      fullName: 'Previous Owner',
      dayOfBirth: '1975-01-01T00:00:00Z',
      idCardNumber: '987654321012',
      idIssueDate: '2022-01-01T07:00:00Z',
      idIssuePlace: 'công an HCM',
      permanentAddress: '456 Old Street, District 2',
      transferDate: '2022-01-01T00:00:00Z',
      transferRecordNumber: 'TR0001',
    },
    vehicle: {
      model: 'X7',
      ownerName: 'Charlie Brown',
      address: '321 Car Street, District 3',
      engineNumber: 'ENG123456',
      chassisNumber: 'CHS789012',
      brand: 'BMW',
      modelNumber: 'G07',
      vehicleType: 'SUV',
      engineCapacity: 2998,
      color: 'Black',
      loadCapacity: '750.5',
      seatCapacity: 7,
      registrationExpiryDate: '2024-12-31T00:00:00Z',
      licensePlateNumber: 'ABC123',
      firstRegistrationDate: '2023-01-01T00:00:00Z',
      issueDate: '2023-01-01T00:00:00Z',
      registrationCertificateNumber: 'RC789012',
      note: 'Fully loaded version with all options',
      kilometersDriven: 5000,
      inspectionCertificateNumber: 'IC123456',
      metadata: {
        fuelType: 'Petrol',
        transmission: 'Automatic',
        lastService: '2023-06-15',
        warranty: 'Valid until 2026',
        annualTax: 1,
        insuranceCost: 1,
      },
    },
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getworkflowbyapplicationid<VehicleFormData>(appId);
        if (data.result) {
          const createLoanStep = data.result[0].steps.find(
            step => step.name === 'add-asset-collateral',
          );
          setTransactionId(createLoanStep?.transactionId ?? '');

          const lastValidHistory = Array.isArray(
            createLoanStep?.metadata?.histories,
          )
            ? createLoanStep?.metadata?.histories
                ?.filter((history: History<VehicleFormData>) => !history?.error)
                .at(-1)
            : null;

          const metadata =
            lastValidHistory?.response.approvalProcessResponse?.metadata[0];

          if (metadata) {
            setFormData(prev => ({
              ...prev,
              assetType: 'VEHICLE',
              title: metadata?.title || '',
              ownershipType:
                (metadata?.ownershipType as OwnershipType) || 'INDIVIDUAL',
              proposedValue: metadata?.proposedValue || 0,
              documents: metadata?.documents || [],
              ownerInfos: (metadata?.ownerInfos || []).map(
                (owner: OwnerInfo) => ({
                  fullName: owner?.fullName || '',
                  dayOfBirth: owner?.dayOfBirth || '1980-01-01T00:00:00Z',
                  idCardNumber: owner?.idCardNumber || '',
                  idIssueDate: owner?.idIssueDate || '2022-01-01T00:00:00Z',
                  idIssuePlace: owner?.idIssuePlace || '',
                  permanentAddress: owner?.permanentAddress || '',
                }),
              ),
              transferInfo: {
                fullName: metadata?.transferInfo?.fullName || '',
                dayOfBirth:
                  metadata?.transferInfo?.dayOfBirth || '1975-01-01T00:00:00Z',
                idCardNumber: metadata?.transferInfo?.idCardNumber || '',
                idIssueDate:
                  metadata?.transferInfo?.idIssueDate || '2022-01-01T00:00:00Z',
                idIssuePlace: metadata?.transferInfo?.idIssuePlace || '',
                permanentAddress:
                  metadata?.transferInfo?.permanentAddress || '',
                transferDate:
                  metadata?.transferInfo?.transferDate ||
                  '2022-01-01T00:00:00Z',
                transferRecordNumber:
                  metadata?.transferInfo?.transferRecordNumber || '',
              },
              vehicle: {
                model: metadata?.vehicle?.model || '',
                ownerName: metadata?.vehicle?.ownerName || '',
                address: metadata?.vehicle?.address || '',
                engineNumber: metadata?.vehicle?.engineNumber || '',
                chassisNumber: metadata?.vehicle?.chassisNumber || '',
                brand: metadata?.vehicle?.brand || '',
                modelNumber: metadata?.vehicle?.modelNumber || '',
                vehicleType: metadata?.vehicle?.vehicleType || '',
                engineCapacity: metadata?.vehicle?.engineCapacity || 0,
                color: metadata?.vehicle?.color || '',
                loadCapacity: metadata?.vehicle?.loadCapacity || '',
                seatCapacity: metadata?.vehicle?.seatCapacity || 0,
                registrationExpiryDate:
                  metadata?.vehicle?.registrationExpiryDate ||
                  '2024-12-31T00:00:00Z',
                licensePlateNumber: metadata?.vehicle?.licensePlateNumber || '',
                firstRegistrationDate:
                  metadata?.vehicle?.firstRegistrationDate ||
                  '2023-01-01T00:00:00Z',
                issueDate:
                  metadata?.vehicle?.issueDate || '2023-01-01T00:00:00Z',
                registrationCertificateNumber:
                  metadata?.vehicle?.registrationCertificateNumber || '',
                note: metadata?.vehicle?.note || '',
                kilometersDriven: metadata?.vehicle?.kilometersDriven || 0,
                inspectionCertificateNumber:
                  metadata?.vehicle?.inspectionCertificateNumber || '',
                metadata: {
                  fuelType: metadata?.vehicle?.metadata?.fuelType || '',
                  transmission: metadata?.vehicle?.metadata?.transmission || '',
                  lastService: metadata?.vehicle?.metadata?.lastService || '',
                  warranty: metadata?.vehicle?.metadata?.warranty || '',
                  annualTax: metadata?.vehicle?.metadata?.annualTax || 0,
                  insuranceCost:
                    metadata?.vehicle?.metadata?.insuranceCost || 0,
                },
              },
              application: {id: appId},
            }));
          }

          if (metadata?.documents?.length > 0) {
            try {
              const documents = await getDocuments(metadata?.documents);
              const formattedFiles = documents
                .filter(doc => doc)
                .map(doc => ({
                  uri: doc.result.url || '',
                  type: doc.result.type || 'application/octet-stream',
                  name: doc.result.title || 'Unknown File',
                  fileCopyUri: null,
                  size: 0,
                  source: 'server' as const,
                }));

              if (formattedFiles.length > 0) {
                setSelectedFiles(formattedFiles);
              }
            } catch (error) {
              console.error('Error fetching documents:', error);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching workflow:', error);
      }
    };

    fetchData();
  }, [appId]);

  const styles = createStyles(theme);

  const handleChange = (field: string, value: any) => {
    setFormData(prev => {
      if (field.startsWith('vehicle.metadata.')) {
        const metadataField = field.split('.')[2];
        return {
          ...prev,
          vehicle: {
            ...prev.vehicle,
            metadata: {
              ...prev.vehicle.metadata,
              [metadataField]: value,
            },
          },
        };
      }
      if (field.startsWith('vehicle.')) {
        const vehicleField = field.split('.')[1];
        return {
          ...prev,
          vehicle: {
            ...prev.vehicle,
            [vehicleField]: value,
          },
        };
      }
      return {
        ...prev,
        [field]: value,
      };
    });
  };

  const handleSubmit = async (_actionType: 'next' | 'update') => {
    try {
      setIsLoading(true);
      if (_actionType === 'next') {
        const response = await addAssetCollateral(appId, formData);

        // Navigate to CreditRating with the appId
        if (response) {
          navigation.replace('InfoCreateLoan', {appId});
        }
      } else {
        const response = await updateAssetCollateral(
          appId,
          formData,
          transactionId || '',
        );
        if (response && navigation) {
          navigation.replace('InfoCreateLoan', {appId});
        }
      }
    } catch (error) {
      const apiError = error as ApiErrorResponse;
      console.error('Error submitting:', apiError);
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
        formData.vehicle[pathParts[1] as keyof typeof formData.vehicle];
    } else if (pathParts.length === 3) {
      const section = formData.vehicle[
        pathParts[1] as keyof typeof formData.vehicle
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

  const getFieldValue = (fieldPath: string): any => {
    const parts = fieldPath.split('.');

    // Handle direct properties of formData
    if (parts.length === 1) {
      return formData[parts[0] as keyof typeof formData];
    }
    if (parts[0] === 'ownerInfos') {
      const [_, index, field] = parts;
      const ownerIndex = parseInt(index);
      const owner = formData.ownerInfos[ownerIndex];

      // Use type assertion to tell TypeScript that field is a valid key of OwnerInfo
      return owner?.[field as keyof OwnerInfo] ?? '';
    }
    if (parts[0] === 'transferInfo') {
      // Thêm case xử lý ownerInfos
      return formData.transferInfo[
        parts[1] as keyof typeof formData.transferInfo
      ];
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
                    getInputValue(formData[field]),
                    field,
                  )}
                </View>
              ),
            )}
          </View>

          {/* Owner Info Fields */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Thông tin chủ sở hữu</Text>

            {formData.ownerInfos.map((owner, ownerIndex) => (
              <View key={ownerIndex} style={styles.ownerSection}>
                {ownerIndex > 0 && (
                  <Text style={styles.ownerTitle}>
                    Chủ sở hữu {ownerIndex + 1}
                  </Text>
                )}

                {/* Thông tin cơ bản - fullName */}
                <View style={styles.fieldContainer}>
                  <Text style={styles.label}>{ownerInfoFields[0].label}</Text>
                  {renderField(
                    ownerInfoFields[0],
                    getFieldValue(
                      `ownerInfos.${ownerIndex}.${ownerInfoFields[0].field}`,
                    ),
                    `ownerInfos.${ownerIndex}.${ownerInfoFields[0].field}`,
                  )}
                </View>

                {/* Row chứa Ngày sinh và CCCD */}
                <View style={styles.gridContainer}>
                  {/* Ngày sinh */}
                  <View style={styles.gridItemDateSmall}>
                    <Text style={styles.label}>{ownerInfoFields[1].label}</Text>
                    {renderField(
                      ownerInfoFields[1],
                      getFieldValue(
                        `ownerInfos.${ownerIndex}.${ownerInfoFields[1].field}`,
                      ),
                      `ownerInfos.${ownerIndex}.${ownerInfoFields[1].field}`,
                    )}
                  </View>

                  {/* Số CMND/CCCD */}
                  <View style={styles.gridItemDateLarge}>
                    <Text style={styles.label}>{ownerInfoFields[2].label}</Text>
                    {renderField(
                      ownerInfoFields[2],
                      getFieldValue(
                        `ownerInfos.${ownerIndex}.${ownerInfoFields[2].field}`,
                      ),
                      `ownerInfos.${ownerIndex}.${ownerInfoFields[2].field}`,
                    )}
                  </View>
                </View>

                {/* Row chứa Ngày cấp và Nơi cấp */}
                <View style={styles.gridContainer}>
                  {/* Nơi cấp */}
                  <View style={styles.gridItemDateLarge}>
                    <Text style={styles.label}>{ownerInfoFields[4].label}</Text>
                    {renderField(
                      ownerInfoFields[4],
                      getFieldValue(
                        `ownerInfos.${ownerIndex}.${ownerInfoFields[4].field}`,
                      ),
                      `ownerInfos.${ownerIndex}.${ownerInfoFields[4].field}`,
                    )}
                  </View>
                  {/* Ngày cấp */}
                  <View style={styles.gridItemDateSmall}>
                    <Text style={styles.label}>{ownerInfoFields[5].label}</Text>
                    {renderField(
                      ownerInfoFields[5],
                      getFieldValue(
                        `ownerInfos.${ownerIndex}.${ownerInfoFields[5].field}`,
                      ),
                      `ownerInfos.${ownerIndex}.${ownerInfoFields[5].field}`,
                    )}
                  </View>
                </View>

                {/* Địa chỉ thường trú */}
                <View style={styles.fieldContainer}>
                  <Text style={styles.label}>{ownerInfoFields[3].label}</Text>
                  {renderField(
                    ownerInfoFields[3],
                    getFieldValue(
                      `ownerInfos.${ownerIndex}.${ownerInfoFields[3].field}`,
                    ),
                    `ownerInfos.${ownerIndex}.${ownerInfoFields[3].field}`,
                  )}
                </View>

                {/* Remove Owner Button (except first owner) */}
                {ownerIndex > 0 && (
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => {
                      setFormData(prev => ({
                        ...prev,
                        ownerInfos: prev.ownerInfos.filter(
                          (_, i) => i !== ownerIndex,
                        ),
                      }));
                    }}>
                    <Text style={styles.removeButtonText}>Xóa chủ sở hữu</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}

            {/* Add Owner Button */}
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => {
                setFormData(prev => ({
                  ...prev,
                  ownerInfos: [
                    ...prev.ownerInfos,
                    {
                      fullName: '',
                      dayOfBirth: '2023-01-01T00:00:00Z',
                      idCardNumber: '',
                      idIssueDate: '2023-01-01T00:00:00Z',
                      idIssuePlace: '',
                      permanentAddress: '',
                    },
                  ],
                }));
              }}>
              <Text style={styles.addButtonText}>Thêm chủ sở hữu</Text>
            </TouchableOpacity>
          </View>

          {/* Vehicle Fields */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Thông tin xe</Text>
            {vehicleFields.map(
              ({field, label, placeholder, numeric, isDate, isCurrency}) => (
                <View key={field} style={styles.fieldContainer}>
                  <Text style={styles.label}>{label}</Text>
                  {renderField(
                    {field, label, placeholder, numeric, isDate, isCurrency},
                    getInputValue(
                      formData.vehicle[field as keyof typeof formData.vehicle],
                    ),
                    `vehicle.${field}`,
                  )}
                </View>
              ),
            )}
          </View>

          {/* Vehicle Metadata */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Thông tin bổ sung</Text>
            {vehicleMetadataFields.map(
              ({field, label, placeholder, isDate, numeric, isCurrency}) => (
                <View key={field} style={styles.fieldContainer}>
                  <Text style={styles.label}>{label}</Text>
                  {renderField(
                    {field, label, placeholder, isDate, numeric, isCurrency},
                    // Use type assertion to tell TypeScript this is a valid key
                    getInputValue(
                      formData.vehicle.metadata[
                        field as keyof typeof formData.vehicle.metadata
                      ],
                    ),
                    `vehicle.metadata.${field}`,
                  )}
                </View>
              ),
            )}
          </View>

          <View style={styles.section}>
            <DocumentUpload
              theme={theme}
              selectedFiles={selectedFiles}
              onFilesChange={files => {
                setSelectedFiles(files);
                // Cập nhật formData.documents khi files thay đổi
                setFormData(prev => ({
                  ...prev,
                  documents: files.map(f => f.uri),
                  documentIds: files.map(f => f.uri),
                }));
              }}
              onDocumentIdsChange={ids => {
                //setDocumentIds(ids);
                // Cập nhật formData.documents khi ids thay đổi
                setFormData(prev => ({
                  ...prev,
                  documents: ids,
                  documentIds: ids,
                }));
              }}
            />
          </View>

          {/* Submit Button */}
          {status === 'completed' ? null : fromScreen === 'InfoCreateLoan' ? (
            <TouchableOpacity
              style={[styles.submitButton, isLoading && {opacity: 0.7}]}
              onPress={() => handleSubmit('update')}
              disabled={isLoading}>
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Cập nhật</Text>
              )}
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.submitButton, isLoading && {opacity: 0.7}]}
              onPress={() => handleSubmit('next')}
              disabled={isLoading}>
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Tiếp tục</Text>
              )}
            </TouchableOpacity>
          )}
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

export default FormVehicleFields;
