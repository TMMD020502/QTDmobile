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
import {
  ApiErrorResponse,
  LandFormData,
  OwnerInfo,
  OwnershipType,
} from '../../api/types/addAssets';
import {useRoute} from '@react-navigation/native';
import {DocumentPickerResponse} from 'react-native-document-picker';
import {History} from '../../api/types/loanworkflowtypes';
import {getDocuments} from '../../api/services/uploadImage';
import DocumentUpload from '../DocumentUpload/documentupload';

interface FormLandFieldsProps {
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

const FormLandFields: React.FC<FormLandFieldsProps> = ({theme, navigation}) => {
  const route = useRoute();
  const {appId, fromScreen, status} = route.params as {
    appId: string;
    fromScreen?: string;
    status?: string;
  };
  const [selectedFiles, setSelectedFiles] = useState<
    ExtendedDocumentPickerResponse[]
  >([]);
  const [transactionId, setTransactionId] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<LandFormData>({
    assetType: 'LAND',
    title: 'Commercial Land Plot',
    ownershipType: 'INDIVIDUAL',
    proposedValue: 1000000000,
    documents: [],
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
    application: {id: appId},
    landAsset: {
      plotNumber: 'LAND001',
      mapNumber: 'MAP003',
      address: '789 Commercial Street, District 2',
      area: 1000.0,
      purpose: 'Commercial',
      expirationDate: '2050-12-31T00:00:00Z',
      originOfUsage: 'Purchase',
      metadata: {
        zoning: 'Commercial',
        frontage: '50m',
        landUseRights: 'Commercial development',
        developmentPotential: 'High',
      },
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getworkflowbyapplicationid<LandFormData>(appId);
        if (data.result) {
          const createLoanStep = data.result[0].steps.find(
            step => step.name === 'add-asset-collateral',
          );
          setTransactionId(createLoanStep?.transactionId ?? '');

          const lastValidHistory = Array.isArray(
            createLoanStep?.metadata?.histories,
          )
            ? createLoanStep?.metadata?.histories
                .filter((history: History<LandFormData>) => !history?.error)
                .at(-1)
            : null;

          const metadata =
            lastValidHistory?.response.approvalProcessResponse?.metadata[0];

          if (metadata) {
            setFormData(prev => ({
              ...prev,
              assetType: 'LAND',
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
              landAsset: {
                plotNumber: metadata?.landAsset?.plotNumber || '',
                mapNumber: metadata?.landAsset?.mapNumber || '',
                address: metadata?.landAsset?.address || '',
                area: metadata?.landAsset?.area || 0,
                purpose: metadata?.landAsset?.purpose || '',
                expirationDate: metadata?.landAsset?.expirationDate || '',
                originOfUsage: metadata?.landAsset?.originOfUsage || '',
                metadata: {
                  zoning: metadata?.landAsset?.metadata?.zoning || '',
                  frontage: metadata?.landAsset?.metadata?.frontage || '',
                  landUseRights:
                    metadata?.landAsset?.metadata?.landUseRights || '',
                  developmentPotential:
                    metadata?.landAsset?.metadata?.developmentPotential || '',
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
        console.error('Error fetching land asset data:', error);
      }
    };

    fetchData();
  }, [appId]);

  const [selectedDateField, setSelectedDateField] = useState<string | null>(
    null,
  );
  const [tempDate, setTempDate] = useState(new Date());

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

  const handleSubmit = async (_actionType: 'next' | 'update') => {
    try {
      setIsLoading(true);
      if (_actionType === 'next') {
        const response = await addAssetCollateral(appId, formData);

        // Navigate to CreditRating with the appId
        if (response) {
          navigation.replace('CreditRating', {appId});
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
                    formData.transferInfo[
                      field as keyof typeof formData.transferInfo
                    ],
                  ),
                  `landAsset.transferInfo.${field}`,
                )}
              </View>
            ))}
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
