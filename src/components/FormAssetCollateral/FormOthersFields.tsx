import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import InputBackground from '../InputBackground/InputBackground';
import {addAssetCollateral} from '../../api/services/loan';
import {
  commonFields,
  otherAssetFields,
  pieceFields,
  insuranceFields,
  storageFields,
} from './formFields';
import {createStyles} from './styles';
import {Theme} from '../../theme/colors';
import {ArtPiece} from '../../api/types/addAssets';

interface FormOthersFieldsProps {
  theme: Theme;
  appId: string;
  onSuccess: () => void;
}

const FormOthersFields: React.FC<FormOthersFieldsProps> = ({
  theme,
  appId,
  onSuccess,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
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

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      await addAssetCollateral(appId, formData);
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
  );
};

export default FormOthersFields;
