import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Alert,
  Image,
  Modal,
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
import {
  ApartmentFormData,
  ApiErrorResponse,
  OwnershipType,
} from '../../api/types/addAssets';
import {useTranslation} from 'react-i18next';
import {useRoute} from '@react-navigation/native';
import {Apartment, History} from '../../api/types/loanworkflowtypes';
import {AppIcons} from '../../icons';
import {getDocuments, uploadImage} from '../../api/services/uploadImage';
import DocumentPicker, {
  DocumentPickerResponse,
} from 'react-native-document-picker';
import {
  clearFinanciaDocumentIds,
  getFinanciaDocumentIds,
  saveFinanciaDocumentIds,
} from '../../../tokenStorage';
import FileViewer from 'react-native-file-viewer';
import ImageDisplay from '../ImageDisplay/ImageDisplay';
import {UploadResponse} from '../../api/types/upload';
import DocumentUpload from '../DocumentUpload/documentupload';
interface FormApartmentFieldsProps {
  theme: Theme;
  appId: string;
  status?: string;
  fromScreen?: string;
  onSuccess?: () => void;
  navigation?: StackNavigationProp<RootStackParamList>;
}
interface ExtendedDocumentPickerResponse extends DocumentPickerResponse {
  source: 'local' | 'server';
}
const FormApartmentFields: React.FC<FormApartmentFieldsProps> = ({
  theme,
  navigation,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDateField, setSelectedDateField] = useState<string | null>(
    null,
  );
  const route = useRoute();
  const {appId, fromScreen, status} = route.params as {
    appId: string;
    fromScreen?: string;
    status?: string;
  };
  const [selectedFiles, setSelectedFiles] = useState<
    ExtendedDocumentPickerResponse[]
  >([]);
  const [documentIds, setDocumentIds] = useState<string[]>([]);
  //const [showImage, setShowImage] = useState(false); // Trạng thái hiển thị Modal
  //const [selectedFileUri, setSelectedFileUri] = useState<string | null>(null); // URL của file cần hiển thị
  const [tempDate, setTempDate] = useState(new Date());
  //const [selectedFiles, setSelectedFiles] = useState<ExtendedDocumentPickerResponse[]>([]);
  const {t} = useTranslation();
  const [formData, setFormData] = useState<ApartmentFormData>({
    assetType: 'APARTMENT',
    title: '',
    ownershipType: '' as OwnershipType,
    proposedValue: 0,
    documents: [],
    application: {id: appId},
    ownerInfo: {
      fullName: '',
      dayOfBirth: '',
      idCardNumber: '',
      idIssueDate: '',
      idIssuePlace: '',
      permanentAddress: '',
    },
    transferInfo: {
      fullName: '',
      dayOfBirth: '',
      idCardNumber: '',
      idIssueDate: '',
      idIssuePlace: '',
      permanentAddress: '',
      transferDate: '',
      transferRecordNumber: '',
    },
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
  const handleFilePress = (file: ExtendedDocumentPickerResponse) => {
    if (file.source === 'local') {
      handleViewFile(file.uri); // Mở file từ thiết bị
    } else if (file.source === 'server') {
      setSelectedFileUri(file.uri); // Lưu URL của file từ server
      setShowImage(true); // Hiển thị Modal
    }
  };
  const handleViewFile = async (fileUri: string) => {
    try {
      // Thử mở file với URI ban đầu
      await FileViewer.open(fileUri);
    } catch (error) {
      console.error('Error opening file with original URI:', error);
    }
  };
  const handleDocumentPick = async () => {
    const res = await DocumentPicker.pick({
      type: [DocumentPicker.types.allFiles], // Chọn loại tệp bạn muốn cho phép
    });
    console.log('Selected file1:', res[0]);
    const File: ExtendedDocumentPickerResponse = {
      ...res[0],
      source: 'local', // Đánh dấu file từ thiết bị
    };
    /*
      const fileUri =
        Platform.OS === 'android' && !res[0].uri.startsWith('file://')
          ? `file://${res[0].uri}`
          : res[0].uri;*/
    const file = {
      uri: res[0].uri,
      type: res[0].type || 'application/octet-stream',
      fileName: res[0].name || '',
      source: 'local',
      typeapi: 'FINANCIAL_INFO',
    };
    console.log('Formdata:' + JSON.stringify(file));
    const uploadResponse = await uploadImage(file);

    if (uploadResponse) {
      // 🎯 Hiển thị đầy đủ thông tin phản hồi
      console.log('✅ Response:', uploadResponse);
      console.log('📌 Id:', uploadResponse.id);

      setSelectedFiles(prev => [...prev, File]);
      // Lấy danh sách id hiện tại từ AsyncStorage
      const existingIds = (await getFinanciaDocumentIds()) || [];

      // Thêm id mới vào danh sách
      const updatedIds = [...existingIds, uploadResponse.id ?? ''];
      await saveFinanciaDocumentIds(updatedIds);
      setFormData(prev => ({
        ...prev,
        documents: [...prev.documents, uploadResponse.id ?? ''],
      }));
    }
  };
  const handleRemoveFile = (index: number) => {
    // Remove file from selectedFiles state
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));

    // Remove file ID from documents array in formData
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index),
    }));

    // Clear saved document IDs from storage
    clearFinanciaDocumentIds();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getworkflowbyapplicationid<Apartment>(appId);
        if (data.result) {
          const createLoanStep = data.result.steps.find(
            step => step.name === 'add-asset-collateral',
          );
          const lastValidHistory = Array.isArray(
            createLoanStep?.metadata?.histories,
          )
            ? createLoanStep?.metadata?.histories
                ?.filter((history: History<Apartment>) => !history?.error)
                .at(-1)
            : null;

          setFormData(prev => ({
            ...prev,
            assetType: 'APARTMENT',
            title:
              lastValidHistory?.response.approvalProcessResponse?.metadata[0]
                ?.title || '',
            ownershipType:
              (lastValidHistory?.response.approvalProcessResponse?.metadata[0]
                ?.ownershipType as OwnershipType) || ('' as OwnershipType),
            proposedValue:
              lastValidHistory?.response.approvalProcessResponse?.metadata[0]
                ?.proposedValue || 0,
            documents:
              lastValidHistory?.response.approvalProcessResponse?.metadata[0]
                ?.documents || [],
            ownerInfo: {
              fullName:
                lastValidHistory?.response.approvalProcessResponse?.metadata[0]
                  ?.ownerInfo?.fullName || '',
              dayOfBirth:
                lastValidHistory?.response.approvalProcessResponse?.metadata[0]
                  ?.ownerInfo?.dayOfBirth || '2023-01-01T00:00:00Z',
              idCardNumber:
                lastValidHistory?.response.approvalProcessResponse?.metadata[0]
                  ?.ownerInfo?.idCardNumber || '',
              idIssueDate:
                lastValidHistory?.response.approvalProcessResponse?.metadata[0]
                  ?.ownerInfo?.idIssueDate || '2023-01-01T00:00:00Z',
              idIssuePlace:
                lastValidHistory?.response.approvalProcessResponse?.metadata[0]
                  ?.ownerInfo?.idIssuePlace || '',
              permanentAddress:
                lastValidHistory?.response.approvalProcessResponse?.metadata[0]
                  ?.ownerInfo?.permanentAddress || '',
            },
            transferInfo: {
              fullName:
                lastValidHistory?.response.approvalProcessResponse?.metadata[0]
                  ?.transferInfo?.fullName || '',
              dayOfBirth:
                lastValidHistory?.response.approvalProcessResponse?.metadata[0]
                  ?.transferInfo?.dayOfBirth || '2023-01-01T00:00:00Z',
              idCardNumber:
                lastValidHistory?.response.approvalProcessResponse?.metadata[0]
                  ?.transferInfo?.idCardNumber || '',
              idIssueDate:
                lastValidHistory?.response.approvalProcessResponse?.metadata[0]
                  ?.transferInfo?.idIssueDate || '2023-01-01T00:00:00Z',
              idIssuePlace:
                lastValidHistory?.response.approvalProcessResponse?.metadata[0]
                  ?.transferInfo?.idIssuePlace || '',
              permanentAddress:
                lastValidHistory?.response.approvalProcessResponse?.metadata[0]
                  ?.transferInfo?.permanentAddress || '',
              transferDate:
                lastValidHistory?.response.approvalProcessResponse?.metadata[0]
                  ?.transferInfo?.transferDate || '2023-01-01T00:00:00Z',
              transferRecordNumber:
                lastValidHistory?.response.approvalProcessResponse?.metadata[0]
                  ?.transferInfo?.transferRecordNumber || '',
            },
            apartment: {
              plotNumber:
                lastValidHistory?.response.approvalProcessResponse?.metadata[0]
                  ?.apartment?.plotNumber || '',
              mapNumber:
                lastValidHistory?.response.approvalProcessResponse?.metadata[0]
                  ?.apartment?.mapNumber || '',
              address:
                lastValidHistory?.response.approvalProcessResponse?.metadata[0]
                  ?.apartment?.address || '',
              area:
                lastValidHistory?.response.approvalProcessResponse?.metadata[0]
                  ?.apartment?.area || 0,
              purpose:
                lastValidHistory?.response.approvalProcessResponse?.metadata[0]
                  ?.apartment?.purpose || '',
              name:
                lastValidHistory?.response.approvalProcessResponse?.metadata[0]
                  ?.apartment?.name || '',
              floorArea:
                lastValidHistory?.response.approvalProcessResponse?.metadata[0]
                  ?.apartment?.floorArea || 0,
              typeOfHousing:
                lastValidHistory?.response.approvalProcessResponse?.metadata[0]
                  ?.apartment?.typeOfHousing || '',
              typeOfOwnership:
                lastValidHistory?.response.approvalProcessResponse?.metadata[0]
                  ?.apartment?.typeOfOwnership || '',
              ownershipTerm:
                lastValidHistory?.response.approvalProcessResponse?.metadata[0]
                  ?.apartment?.ownershipTerm || '',
              notes:
                lastValidHistory?.response.approvalProcessResponse?.metadata[0]
                  ?.apartment?.notes || '',
              sharedFacilities:
                lastValidHistory?.response.approvalProcessResponse?.metadata[0]
                  ?.apartment?.sharedFacilities || '',
              certificateNumber:
                lastValidHistory?.response.approvalProcessResponse?.metadata[0]
                  ?.apartment?.certificateNumber || '',
              certificateBookNumber:
                lastValidHistory?.response.approvalProcessResponse?.metadata[0]
                  ?.apartment?.certificateBookNumber || '',
              issuingAuthority:
                lastValidHistory?.response.approvalProcessResponse?.metadata[0]
                  ?.apartment?.issuingAuthority || '',
              issueDate:
                lastValidHistory?.response.approvalProcessResponse?.metadata[0]
                  ?.apartment?.issueDate || '2023-01-01T00:00:00Z',
              expirationDate:
                lastValidHistory?.response.approvalProcessResponse?.metadata[0]
                  ?.apartment?.expirationDate || '2023-01-01T00:00:00Z',
              originOfUsage:
                lastValidHistory?.response.approvalProcessResponse?.metadata[0]
                  ?.apartment?.originOfUsage || '', // Thêm trường này
              metadata: {
                // Đảm bảo đủ trường metadata
                parkingSpace:
                  lastValidHistory?.response.approvalProcessResponse
                    ?.metadata[0]?.apartment?.metadata?.parkingSpace || '',
                floor:
                  lastValidHistory?.response.approvalProcessResponse
                    ?.metadata[0]?.apartment?.metadata?.floor || 0,
                view:
                  lastValidHistory?.response.approvalProcessResponse
                    ?.metadata[0]?.apartment?.metadata?.view || '',
                renovationStatus:
                  lastValidHistory?.response.approvalProcessResponse
                    ?.metadata[0]?.apartment?.metadata?.renovationStatus || '',
              },
            },
            application: {id: appId},
          }));
        } // Gọi API getDocuments
        const documents = await getDocuments();
        console.log('Documents from API:', documents);
        if (documents && documents.length > 0) {
          const formattedFiles: ExtendedDocumentPickerResponse[] =
            documents.map((doc: UploadResponse) => ({
              uri: doc.result.url || '', // Đường dẫn đến file
              type: doc.result.type || 'application/octet-stream',
              name: doc.result.title || 'Unknown File',
              fileCopyUri: null, // Default value for fileCopyUri
              size: 0, // Default value for size
              source: 'server', // Đánh dấu file từ server
            }));

          setSelectedFiles(formattedFiles);
          setDocumentIds(formattedFiles.map(f => f.uri));
        }
      } catch (error) {
        console.error('Error fetching workflow:', error);
      }
    };

    fetchData();
  }, [appId, setSelectedFiles]);
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
      if (field.startsWith('ownerInfo.')) {
        // Xử lý ownerInfo ở root
        const ownerField = field.split('.')[1];
        return {
          ...prev,
          ownerInfo: {
            ...prev.ownerInfo,
            [ownerField]: value,
          },
        };
      }
      if (field.startsWith('transferInfo.')) {
        // Xử lý ownerInfo ở root
        const transferInfo = field.split('.')[1];
        return {
          ...prev,
          transferInfo: {
            ...prev.transferInfo,
            [transferInfo]: value,
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
      console.log('formData next1');
      if (_actionType === 'next') {
        console.log('formData next');
        const response = await addAssetCollateral(appId, formData);
        // Navigate to CreditRating with the appId
        if (response && navigation) {
          navigation.replace('InfoCreateLoan', {appId});
        }
      } else {
        console.log('formData', formData);
        const response = await updateAssetCollateral(appId, formData);
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
      //const currentValue = getFieldValue(fieldPath);
      return (
        <CurrencyInput
          value={value ? Number(value) : 0}
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
    if (parts[0] === 'ownerInfo') {
      // Thêm case xử lý ownerInfo
      return formData.ownerInfo[parts[1] as keyof typeof formData.ownerInfo];
    }
    if (parts[0] === 'transferInfo') {
      // Thêm case xử lý ownerInfo
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
            <View style={styles.gridContainer}>
              {commonFields.map(
                ({field, label, placeholder, numeric, isCurrency}) => (
                  <View
                    key={field}
                    style={[
                      field === 'title'
                        ? styles.gridItemnumberLarge
                        : styles.gridItemnumberSmall,
                    ]}>
                    <Text style={styles.label} numberOfLines={1}>
                      {label}
                    </Text>
                    {renderField(
                      {field, label, placeholder, numeric, isCurrency},
                      getInputValue(formData[field as keyof typeof formData]),
                      field,
                    )}
                  </View>
                ),
              )}
            </View>
          </View>

          {/* Apartment Fields */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Thông tin căn hộ</Text>

            {/* Số thửa và số tờ bản đồ */}
            <View style={styles.gridContainer}>
              <View style={styles.gridItem}>
                <Text style={styles.label}>{apartmentFields[0].label}</Text>
                {renderField(
                  apartmentFields[0],
                  getFieldValue(`apartment.${apartmentFields[0].field}`),
                  `apartment.${apartmentFields[0].field}`,
                )}
              </View>
              <View style={styles.gridItem}>
                <Text style={styles.label}>{apartmentFields[1].label}</Text>
                {renderField(
                  apartmentFields[1],
                  getFieldValue(`apartment.${apartmentFields[1].field}`),
                  `apartment.${apartmentFields[1].field}`,
                )}
              </View>
            </View>

            {/* Địa chỉ (full width) */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>{apartmentFields[2].label}</Text>
              {renderField(
                apartmentFields[2],
                getFieldValue(`apartment.${apartmentFields[2].field}`),
                `apartment.${apartmentFields[2].field}`,
              )}
            </View>

            {/* Diện tích và mục đích sử dụng */}
            <View style={styles.gridContainer}>
              <View style={styles.gridItemDateSmall}>
                <Text style={styles.label}>{apartmentFields[3].label}</Text>
                {renderField(
                  apartmentFields[3],
                  getFieldValue(`apartment.${apartmentFields[3].field}`),
                  `apartment.${apartmentFields[3].field}`,
                )}
              </View>
              <View style={styles.gridItemDateLarge}>
                <Text style={styles.label}>{apartmentFields[4].label}</Text>
                {renderField(
                  apartmentFields[4],
                  getFieldValue(`apartment.${apartmentFields[4].field}`),
                  `apartment.${apartmentFields[4].field}`,
                )}
              </View>
            </View>

            {/* Tên căn hộ và diện tích sàn */}
            <View style={styles.gridContainer}>
              <View style={styles.gridItemDateLargeWithOffset}>
                <Text style={styles.label}>{apartmentFields[5].label}</Text>
                {renderField(
                  apartmentFields[5],
                  getFieldValue(`apartment.${apartmentFields[5].field}`),
                  `apartment.${apartmentFields[5].field}`,
                )}
              </View>
              <View style={styles.gridItemDateSmall}>
                <Text style={styles.label}>{apartmentFields[6].label}</Text>
                {renderField(
                  apartmentFields[6],
                  getFieldValue(`apartment.${apartmentFields[6].field}`),
                  `apartment.${apartmentFields[6].field}`,
                )}
              </View>
            </View>

            {/* Loại nhà ở và hình thức sở hữu */}
            <View style={styles.gridContainer}>
              <View style={styles.gridItem}>
                <Text style={styles.label}>{apartmentFields[7].label}</Text>
                {renderField(
                  apartmentFields[7],
                  getFieldValue(`apartment.${apartmentFields[7].field}`),
                  `apartment.${apartmentFields[7].field}`,
                )}
              </View>
              <View style={styles.gridItem}>
                <Text style={styles.label}>{apartmentFields[8].label}</Text>
                {renderField(
                  apartmentFields[8],
                  getFieldValue(`apartment.${apartmentFields[8].field}`),
                  `apartment.${apartmentFields[8].field}`,
                )}
              </View>
            </View>

            {/* Số GCN và Số vào sổ cấp GCN */}
            <View style={styles.gridContainer}>
              <View style={styles.gridItem}>
                <Text style={styles.label}>{apartmentFields[9].label}</Text>
                {renderField(
                  apartmentFields[9],
                  getFieldValue(`apartment.${apartmentFields[9].field}`),
                  `apartment.${apartmentFields[9].field}`,
                )}
              </View>
              <View style={styles.gridItem}>
                <Text style={styles.label}>{apartmentFields[10].label}</Text>
                {renderField(
                  apartmentFields[10],
                  getFieldValue(`apartment.${apartmentFields[10].field}`),
                  `apartment.${apartmentFields[10].field}`,
                )}
              </View>
            </View>

            {/* Cơ quan cấp và ngày hết hạn */}
            <View style={styles.gridContainer}>
              <View style={styles.gridItemDateLarge}>
                <Text style={styles.label}>{apartmentFields[11].label}</Text>
                {renderField(
                  apartmentFields[11],
                  getFieldValue(`apartment.${apartmentFields[11].field}`),
                  `apartment.${apartmentFields[11].field}`,
                )}
              </View>
              <View style={styles.gridItemDateSmall}>
                <Text style={styles.label}>{apartmentFields[12].label}</Text>
                {renderField(
                  apartmentFields[12],
                  getFieldValue(`apartment.${apartmentFields[12].field}`),
                  `apartment.${apartmentFields[12].field}`,
                )}
              </View>
            </View>

            {/* Nguồn gốc và thời hạn sở hữu */}
            <View style={styles.gridContainer}>
              <View style={styles.gridItemDateLargeWithOffset}>
                <Text style={styles.label}>{apartmentFields[13].label}</Text>
                {renderField(
                  apartmentFields[13],
                  getFieldValue(`apartment.${apartmentFields[13].field}`),
                  `apartment.${apartmentFields[13].field}`,
                )}
              </View>
              <View style={styles.gridItemDateSmall}>
                <Text style={styles.label}>{apartmentFields[14].label}</Text>
                {renderField(
                  apartmentFields[14],
                  getFieldValue(`apartment.${apartmentFields[14].field}`),
                  `apartment.${apartmentFields[14].field}`,
                )}
              </View>
            </View>

            {/* Tiện ích chung và ngày cấp */}
            <View style={styles.gridContainer}>
              <View style={styles.gridItemDateSmall}>
                <Text style={styles.label}>{apartmentFields[17].label}</Text>
                {renderField(
                  apartmentFields[17],
                  getFieldValue(`apartment.${apartmentFields[17].field}`),
                  `apartment.${apartmentFields[17].field}`,
                )}
              </View>
              <View style={styles.gridItemDateLarge}>
                <Text style={styles.label}>{apartmentFields[16].label}</Text>
                {renderField(
                  apartmentFields[16],
                  getFieldValue(`apartment.${apartmentFields[16].field}`),
                  `apartment.${apartmentFields[16].field}`,
                )}
              </View>
            </View>
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>{apartmentFields[15].label}</Text>
              {renderField(
                apartmentFields[15],
                getFieldValue(`apartment.${apartmentFields[15].field}`),
                `apartment.${apartmentFields[15].field}`,
              )}
            </View>
          </View>

          {/* Owner Info Fields */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Thông tin chủ sở hữu</Text>
            {/* Thông tin cơ bản - fullName */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>{ownerInfoFields[0].label}</Text>
              {renderField(
                ownerInfoFields[0],
                getFieldValue(`ownerInfo.${ownerInfoFields[0].field}`),
                `ownerInfo.${ownerInfoFields[0].field}`,
              )}
            </View>

            {/* Row chứa Ngày sinh và CCCD */}
            <View style={styles.gridContainer}>
              {/* Ngày sinh */}
              <View style={styles.gridItemDateSmall}>
                <Text style={styles.label}>{ownerInfoFields[1].label}</Text>
                {renderField(
                  ownerInfoFields[1],
                  getFieldValue(`ownerInfo.${ownerInfoFields[1].field}`),
                  `ownerInfo.${ownerInfoFields[1].field}`,
                )}
              </View>

              {/* Số CMND/CCCD */}
              <View style={styles.gridItemDateLarge}>
                <Text style={styles.label}>{ownerInfoFields[2].label}</Text>
                {renderField(
                  ownerInfoFields[2],
                  getFieldValue(`ownerInfo.${ownerInfoFields[2].field}`),
                  `ownerInfo.${ownerInfoFields[2].field}`,
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
                  getFieldValue(`ownerInfo.${ownerInfoFields[4].field}`),
                  `ownerInfo.${ownerInfoFields[4].field}`,
                )}
              </View>
              {/* Ngày cấp */}
              <View style={styles.gridItemDateSmall}>
                <Text style={styles.label}>{ownerInfoFields[5].label}</Text>
                {renderField(
                  ownerInfoFields[5],
                  getFieldValue(`ownerInfo.${ownerInfoFields[5].field}`),
                  `ownerInfo.${ownerInfoFields[5].field}`,
                )}
              </View>
            </View>

            {/* Địa chỉ thường trú */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>{ownerInfoFields[3].label}</Text>
              {renderField(
                ownerInfoFields[3],
                getFieldValue(`ownerInfo.${ownerInfoFields[3].field}`),
                `ownerInfo.${ownerInfoFields[3].field}`,
              )}
            </View>
          </View>

          {/* Apartment Metadata */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Thông tin bổ sung</Text>
            <View style={styles.gridContainer}>
              {/* Chỗ đậu xe */}
              <View style={[styles.gridItemMetadataLarge1]}>
                <Text style={styles.label}>
                  {apartmentMetadataFields[0].label}
                </Text>
                {renderField(
                  apartmentMetadataFields[0],
                  getFieldValue(
                    `apartment.metadata.${apartmentMetadataFields[0].field}`,
                  ),
                  `apartment.metadata.${apartmentMetadataFields[0].field}`,
                )}
              </View>

              {/* Tầng */}
              <View style={[styles.gridItemMetadataSmall]}>
                <Text style={styles.label}>
                  {apartmentMetadataFields[1].label}
                </Text>
                {renderField(
                  apartmentMetadataFields[1],
                  getFieldValue(
                    `apartment.metadata.${apartmentMetadataFields[1].field}`,
                  ),
                  `apartment.metadata.${apartmentMetadataFields[1].field}`,
                )}
              </View>

              {/* View */}
              <View style={[styles.gridItemMetadataLarge]}>
                <Text style={styles.label}>
                  {apartmentMetadataFields[2].label}
                </Text>
                {renderField(
                  apartmentMetadataFields[2],
                  getFieldValue(
                    `apartment.metadata.${apartmentMetadataFields[2].field}`,
                  ),
                  `apartment.metadata.${apartmentMetadataFields[2].field}`,
                )}
              </View>
            </View>

            {/* Tình trạng sửa chữa */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>
                {apartmentMetadataFields[3].label}
              </Text>
              {renderField(
                apartmentMetadataFields[3],
                getFieldValue(
                  `apartment.metadata.${apartmentMetadataFields[3].field}`,
                ),
                `apartment.metadata.${apartmentMetadataFields[3].field}`,
              )}
            </View>
          </View>

          {/* Transfer Info Fields */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Thông tin chuyển nhượng</Text>

            {/* Họ tên chủ cũ */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>{transferInfoFields[0].label}</Text>
              {renderField(
                transferInfoFields[0],
                getFieldValue(`transferInfo.${transferInfoFields[0].field}`),
                `transferInfo.${transferInfoFields[0].field}`,
              )}
            </View>

            {/* Row chứa CMND và Ngày sinh */}
            <View style={styles.gridContainer}>
              {/* CMND */}
              <View style={styles.gridItemDateLarge}>
                <Text style={styles.label}>{transferInfoFields[2].label}</Text>
                {renderField(
                  transferInfoFields[2],
                  getFieldValue(`transferInfo.${transferInfoFields[2].field}`),
                  `transferInfo.${transferInfoFields[2].field}`,
                )}
              </View>
              {/* Ngày sinh */}
              <View style={styles.gridItemDateSmall}>
                <Text style={styles.label}>{transferInfoFields[1].label}</Text>
                {renderField(
                  transferInfoFields[1],
                  getFieldValue(`transferInfo.${transferInfoFields[1].field}`),
                  `transferInfo.${transferInfoFields[1].field}`,
                )}
              </View>
            </View>

            {/* Row chứa Nơi cấp và Ngày cấp */}
            <View style={styles.gridContainer}>
              {/* Nơi cấp */}
              <View style={styles.gridItemDateLarge}>
                <Text style={styles.label}>{transferInfoFields[4].label}</Text>
                {renderField(
                  transferInfoFields[4],
                  getFieldValue(`transferInfo.${transferInfoFields[4].field}`),
                  `transferInfo.${transferInfoFields[4].field}`,
                )}
              </View>
              {/* Ngày cấp */}
              <View style={styles.gridItemDateSmall}>
                <Text style={styles.label}>{transferInfoFields[3].label}</Text>
                {renderField(
                  transferInfoFields[3],
                  getFieldValue(`transferInfo.${transferInfoFields[3].field}`),
                  `transferInfo.${transferInfoFields[3].field}`,
                )}
              </View>
            </View>
            {/* Địa chỉ thường trú */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>{transferInfoFields[5].label}</Text>
              {renderField(
                transferInfoFields[5],
                getFieldValue(`transferInfo.${transferInfoFields[5].field}`),
                `transferInfo.${transferInfoFields[5].field}`,
              )}
            </View>
            {/* Row chứa Ngày chuyển nhượng và Hồ sơ */}
            <View style={styles.gridContainer}>
              {/* Ngày chuyển nhượng */}
              <View style={styles.gridItemDateSmall}>
                <Text style={styles.label}>{transferInfoFields[6].label}</Text>
                {renderField(
                  transferInfoFields[6],
                  getFieldValue(`transferInfo.${transferInfoFields[6].field}`),
                  `transferInfo.${transferInfoFields[6].field}`,
                )}
              </View>
              {/* Hồ sơ chuyển nhượng */}
              <View style={styles.gridItemDateLargeWithOffset}>
                <Text style={styles.label}>{transferInfoFields[7].label}</Text>
                {renderField(
                  transferInfoFields[7],
                  getFieldValue(`transferInfo.${transferInfoFields[7].field}`),
                  `transferInfo.${transferInfoFields[7].field}`,
                )}
              </View>
            </View>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tài liệu đính kèm</Text>
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
                setDocumentIds(ids);
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
                <Text
                  style={[
                    styles.buttonText,
                    {fontWeight: 'bold', textAlign: 'center'},
                  ]}>
                  {t('formCreateLoan.update')}
                </Text>
              )}
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[
                styles.submitButton,
                isLoading && {opacity: 0.7},
                {flex: 1, marginLeft: 1},
              ]}
              onPress={() => handleSubmit('next')}
              disabled={isLoading}>
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text
                  style={[
                    styles.buttonText,
                    {fontWeight: 'bold', textAlign: 'center'},
                  ]}>
                  {t('formCreateLoan.next')}
                </Text>
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

export default FormApartmentFields;
