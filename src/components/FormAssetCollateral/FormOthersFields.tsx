import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import InputBackground from '../InputBackground/InputBackground';
import {
  addAssetCollateral,
  getworkflowbyapplicationid,
  updateAssetCollateral,
} from '../../api/services/loan';
import {
  commonFields,
  otherAssetFields,
  pieceFields,
  insuranceFields,
  storageFields,
} from './formFields';
import {createStyles} from './styles';
import {Theme} from '../../theme/colors';
import {ArtPiece, OtherAsset, OwnershipType} from '../../api/types/addAssets';
import {DocumentPickerResponse} from 'react-native-document-picker';
import {useRoute} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../navigators/RootNavigator';
import {getDocuments} from '../../api/services/uploadImage';
import {History} from '../../api/types/loanworkflowtypes';
import DocumentUpload from '../DocumentUpload/documentupload';

interface FormOthersFieldsProps {
  theme: Theme;
  appId: string;
  status?: string;
  fromScreen?: string;
  onSuccess: () => void;
  navigation: StackNavigationProp<RootStackParamList>;
}

interface ExtendedDocumentPickerResponse extends DocumentPickerResponse {
  source: 'local' | 'server';
}

const FormOthersFields: React.FC<FormOthersFieldsProps> = ({
  theme,
  onSuccess,
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
  const [selectedFiles, setSelectedFiles] = useState<
    ExtendedDocumentPickerResponse[]
  >([]);
  const [formData, setFormData] = useState<OtherAsset>({
    assetType: 'OTHER',
    title: '',
    ownershipType: 'INDIVIDUAL',
    proposedValue: 0,
    documents: [],
    application: {id: appId},
    otherAsset: {
      metadata: {
        assetType: '',
        location: '',
        pieces: [
          {
            name: '',
            artist: '',
            year: 0,
            medium: '',
            dimensions: '',
            value: 0,
          },
        ],
        insurance: {
          provider: '',
          policyNumber: '',
          coverage: 0,
        },
        storage: {
          location: '',
          security: '',
        },
      },
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getworkflowbyapplicationid<OtherAsset>(appId);
        if (data.result) {
          const createLoanStep = data.result.steps.find(
            step => step.name === 'add-asset-collateral',
          );
          setTransactionId(createLoanStep?.transactionId ?? '');

          const lastValidHistory = Array.isArray(
            createLoanStep?.metadata?.histories,
          )
            ? createLoanStep?.metadata?.histories
                ?.filter((history: History<OtherAsset>) => !history?.error)
                .at(-1)
            : null;

          const metadata =
            lastValidHistory?.response.approvalProcessResponse?.metadata[0];

          if (metadata) {
            setFormData(prev => ({
              ...prev,
              assetType: 'OTHER',
              title: metadata?.title || '',
              ownershipType:
                (metadata?.ownershipType as OwnershipType) || 'INDIVIDUAL',
              proposedValue: metadata?.proposedValue || 0,
              documents: metadata?.documents || [],
              otherAsset: {
                metadata: {
                  assetType: metadata?.otherAsset?.metadata?.assetType || '',
                  location: metadata?.otherAsset?.metadata?.location || '',
                  pieces: (metadata?.otherAsset?.metadata?.pieces || []).map(
                    (piece: ArtPiece) => ({
                      name: piece?.name || '',
                      artist: piece?.artist || '',
                      year: piece?.year || 0,
                      medium: piece?.medium || '',
                      dimensions: piece?.dimensions || '',
                      value: piece?.value || 0,
                    }),
                  ),
                  insurance: {
                    provider:
                      metadata?.otherAsset?.metadata?.insurance?.provider || '',
                    policyNumber:
                      metadata?.otherAsset?.metadata?.insurance?.policyNumber ||
                      '',
                    coverage:
                      metadata?.otherAsset?.metadata?.insurance?.coverage || 0,
                  },
                  storage: {
                    location:
                      metadata?.otherAsset?.metadata?.storage?.location || '',
                    security:
                      metadata?.otherAsset?.metadata?.storage?.security || '',
                  },
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
      const newData = {...prev};
      if (field.startsWith('otherAsset.metadata.')) {
        const metadataField = field.split('otherAsset.metadata.')[1];
        newData.otherAsset.metadata = {
          ...newData.otherAsset.metadata,
          [metadataField]: value,
        };
      } else if (field.startsWith('insurance.')) {
        const insuranceField = field.split('insurance.')[1];
        newData.otherAsset.metadata.insurance = {
          ...newData.otherAsset.metadata.insurance,
          [insuranceField]: value,
        };
      } else if (field.startsWith('storage.')) {
        const storageField = field.split('storage.')[1];
        newData.otherAsset.metadata.storage = {
          ...newData.otherAsset.metadata.storage,
          [storageField]: value,
        };
      } else if (field.startsWith('pieces.')) {
        const [, index, pieceField] = field.split('.');
        const pieces = [...newData.otherAsset.metadata.pieces];
        pieces[Number(index)] = {
          ...pieces[Number(index)],
          [pieceField]: value,
        };
        newData.otherAsset.metadata.pieces = pieces;
      } else {
        return {
          ...prev,
          [field]: value,
        };
      }
      return newData;
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
        console.log('formData', JSON.stringify(formData, null, 2));

        const response = await updateAssetCollateral(
          appId,
          formData,
          transactionId || '',
        );
        if (response && navigation) {
          navigation.replace('InfoCreateLoan', {appId});
        }
      }
      onSuccess();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const addPiece = () => {
    setFormData(prev => ({
      ...prev,
      otherAsset: {
        ...prev.otherAsset,
        metadata: {
          ...prev.otherAsset.metadata,
          pieces: [
            ...prev.otherAsset.metadata.pieces,
            {
              name: '',
              artist: '',
              year: 0,
              medium: '',
              dimensions: '',
              value: 0,
            },
          ],
        },
      },
    }));
  };

  const removePiece = (index: number) => {
    setFormData(prev => ({
      ...prev,
      otherAsset: {
        ...prev.otherAsset,
        metadata: {
          ...prev.otherAsset.metadata,
          pieces: prev.otherAsset.metadata.pieces.filter((_, i) => i !== index),
        },
      },
    }));
  };

  return (
    <ScrollView style={styles.container}>
      {/* Common Fields */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Thông tin cơ bản</Text>
        {commonFields.map(field => (
          <View key={field.field} style={styles.fieldContainer}>
            <Text style={styles.label}>{field.label}</Text>
            <InputBackground
              value={String(
                formData[field.field as keyof typeof formData] || '',
              )}
              onChangeText={value =>
                handleChange(field.field, field.numeric ? Number(value) : value)
              }
              placeholder={field.placeholder}
              keyboardType={field.numeric ? 'numeric' : 'default'}
            />
          </View>
        ))}
      </View>

      {/* Other Asset Fields */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Thông tin tài sản</Text>
        {otherAssetFields.map(field => (
          <View key={field.field} style={styles.fieldContainer}>
            <Text style={styles.label}>{field.label}</Text>
            <InputBackground
              value={String(
                formData.otherAsset.metadata[
                  field.field as keyof typeof formData.otherAsset.metadata
                ] || '',
              )}
              onChangeText={value =>
                handleChange(`otherAsset.metadata.${field.field}`, value)
              }
              placeholder={field.placeholder}
            />
          </View>
        ))}
      </View>

      {/* Pieces */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Danh sách tác phẩm</Text>
        {formData.otherAsset.metadata.pieces.map((piece, index) => (
          <View key={index} style={styles.pieceContainer}>
            <View style={styles.pieceHeader}>
              <Text style={styles.pieceTitle}>Tác phẩm {index + 1}</Text>
              {index > 0 && (
                <TouchableOpacity onPress={() => removePiece(index)}>
                  <Text style={styles.removeButton}>Xóa</Text>
                </TouchableOpacity>
              )}
            </View>
            {pieceFields.map(field => (
              <View key={field.field} style={styles.fieldContainer}>
                <Text style={styles.label}>{field.label}</Text>
                <InputBackground
                  value={String(piece[field.field as keyof ArtPiece] || '')}
                  onChangeText={value =>
                    handleChange(
                      `pieces.${index}.${field.field}`,
                      field.numeric ? Number(value) : value,
                    )
                  }
                  placeholder={field.placeholder}
                  keyboardType={field.numeric ? 'numeric' : 'default'}
                />
              </View>
            ))}
          </View>
        ))}
        <TouchableOpacity style={styles.addButton} onPress={addPiece}>
          <Text style={styles.addButtonText}>Thêm tác phẩm</Text>
        </TouchableOpacity>
      </View>

      {/* Insurance Fields */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Thông tin bảo hiểm</Text>
        {insuranceFields.map(field => (
          <View key={field.field} style={styles.fieldContainer}>
            <Text style={styles.label}>{field.label}</Text>
            <InputBackground
              value={String(
                formData.otherAsset.metadata.insurance[
                  field.field as keyof typeof formData.otherAsset.metadata.insurance
                ] || '',
              )}
              onChangeText={value =>
                handleChange(
                  `insurance.${field.field}`,
                  field.numeric ? Number(value) : value,
                )
              }
              placeholder={field.placeholder}
              keyboardType={field.numeric ? 'numeric' : 'default'}
            />
          </View>
        ))}
      </View>

      {/* Storage Fields */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Thông tin lưu trữ</Text>
        {storageFields.map(field => (
          <View key={field.field} style={styles.fieldContainer}>
            <Text style={styles.label}>{field.label}</Text>
            <InputBackground
              value={String(
                formData.otherAsset.metadata.storage[
                  field.field as keyof typeof formData.otherAsset.metadata.storage
                ] || '',
              )}
              onChangeText={value =>
                handleChange(`storage.${field.field}`, value)
              }
              placeholder={field.placeholder}
            />
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
  );
};

export default FormOthersFields;
