import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import {formatDate} from '../../utils/dateUtils';
import {AppIcons} from '../../icons';
import {getworkflowbyapplicationid} from '../../api/services/loan';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../navigators/RootNavigator';

interface FormCreditRatingProps {
  theme: any;
  appId: string;
  navigation: StackNavigationProp<RootStackParamList, 'CreditRating'>;
  data?: {
    ratingByCriteria: {
      score: number;
      ratingLevel: string;
    };
    ratingByCIC: {
      score: number;
      riskLevel: string;
      scoringDate: string;
      term: number;
      document: string;
    };
    file?: {
      name: string;
      size: number;
    } | null;
  };
}
interface FormData {
  scoreCriteria: number;
  ratingLevel: string;
  term: number;
  scoreCIC: number;
  document: string;
  riskLevel: string;
  scoringDate: string;
}
const FormCreditRating: React.FC<FormCreditRatingProps> = ({
  theme,
  appId,
  navigation,
}) => {
  const [formData, setFormData] = useState<FormData>({
    scoreCriteria: 0,
    ratingLevel: '',
    term: 0,
    scoreCIC: 0,
    document: '',
    riskLevel: '',
    scoringDate: '',
  });
  const styles = StyleSheet.create({
    container: {
      padding: 5,
      backgroundColor: theme.background,
      borderRadius: 12,
      margin: 16,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3, // For Android shadow
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 12,
      borderBottomWidth: 1,
      borderBottomColor: '#ddd',
      paddingBottom: 8,
    },
    label: {
      color: theme.text,
      fontSize: 14,
      fontWeight: '600',
      marginBottom: 4,
    },
    value: {
      fontSize: 14,
      color: '#ff0000',
      marginBottom: 16,
      padding: 8,
      backgroundColor: theme.backgroundBox || '#f9f9f9',
      borderRadius: 8,
    },
    fileContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 12,
      backgroundColor: theme.backgroundBox || '#f5f5f5',
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#ddd',
      marginTop: 8,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2, // For Android shadow
    },
    fileIcon: {
      width: 24,
      height: 24,
      marginRight: 12,
      tintColor: theme.noteText || '#666',
    },
    fileName: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.text,
      marginBottom: 4,
    },
    fileSize: {
      fontSize: 12,
      color: theme.noteText || '#999',
    },
    downloadIcon: {
      width: 24,
      height: 24,
      tintColor: '#007BFF', // Màu xanh cho biểu tượng tải xuống
      marginLeft: 12,
    },
    noDocumentText: {
      fontSize: 14,
      color: '#999',
      fontStyle: 'italic',
      marginTop: 8,
    },
    navigateButton: {
      marginTop: 20,
      backgroundColor: '#007BFF',
      padding: 12,
      borderRadius: 8,
      alignItems: 'center',
    },
    navigateButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: 'bold',
    },
  });
  const handleNavigateToAssetCollateral = () => {
    navigation.navigate('AssetCollateral', {
      appId,
      fromScreen: 'CreditRating',
    });
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getworkflowbyapplicationid(appId);
        if (data.result) {
          const createLoanStep = data.result.steps.find(
            step => step.name === 'create-credit-rating',
          );
          const lastValidHistory = createLoanStep?.metadata?.histories
            ?.filter(histories => !histories?.error)
            .at(-1);
          if (lastValidHistory) {
            const financialData =
              lastValidHistory?.response.creditRatingResponse?.ratingByCriteria;
            const financialData2 =
              lastValidHistory?.response.creditRatingResponse?.ratingByCIC;

            if (financialData) {
              const mapLoanToFormData = (
                financialData: any,
                financialData2: any,
              ): FormData => ({
                scoreCriteria: financialData?.score || 0,
                ratingLevel: financialData?.ratingLevel || '',
                term: financialData2?.term || 0,
                scoreCIC: financialData2?.score || 0,
                document: financialData2?.document || '',
                riskLevel: financialData2?.riskLevel || '',
                scoringDate: financialData2?.scoringDate || '',
              });
              const converted = mapLoanToFormData(
                financialData,
                financialData2,
              );
              setFormData(prev => ({
                ...prev,
                ...converted,
              }));
            }
          }
        }
        /*
        // Gọi API getDocuments
        const documents = await getDocuments();
        if (documents && documents.length > 0) {
          const formattedFiles: ExtendedDocumentPickerResponse[] =
            documents.map((doc: UploadResponse) => ({
              uri: doc.url,
              type: doc.type || 'application/octet-stream',
              name: doc.title || 'Unknown File',
              fileCopyUri: null, // Default value for fileCopyUri
              size: 0, // Default value for size
              source: 'server', // Đánh dấu file từ server
            }));

          setSelectedFiles(formattedFiles);
          
        }*/
      } catch (error) {
        console.error('Error fetching workflow:', error);
      }
    };

    fetchData();
  }, [appId]);
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Đánh giá tín dụng</Text>
      <View>
        <Text style={styles.label}>Điểm đánh giá:</Text>
        <Text style={styles.value}>{formData?.scoreCriteria ?? '--'}</Text>
      </View>

      <View>
        <Text style={styles.label}>Cấp độ đánh giá:</Text>
        <Text style={styles.value}>{formData?.ratingLevel ?? '--'}</Text>
      </View>

      <Text style={styles.sectionTitle}>Đánh giá từ CIC</Text>
      <View>
        <Text style={styles.label}>Điểm CIC:</Text>
        <Text style={styles.value}>{formData?.scoreCIC ?? '--'}</Text>
      </View>

      <View>
        <Text style={styles.label}>Mức độ rủi ro:</Text>
        <Text style={styles.value}>{formData?.riskLevel ?? '--'}</Text>
      </View>

      <View>
        <Text style={styles.label}>Ngày đánh giá:</Text>
        <Text style={styles.value}>
          {formData?.scoringDate
            ? formatDate(new Date(formData.scoringDate))
            : '--'}
        </Text>
      </View>

      <View>
        <Text style={styles.label}>Kỳ hạn:</Text>
        <Text style={styles.value}>{formData?.term ?? '--'} tháng</Text>
      </View>

      <View>
        <Text style={styles.label}>Tài liệu đính kèm:</Text>
        {formData?.document ? (
          <View style={styles.fileContainer}>
            <Image source={AppIcons.infoIcon} style={styles.fileIcon} />
            <View style={{flex: 1}}>
              <Text style={styles.fileName}>{formData?.document}</Text>
              <Text style={styles.fileSize}>Kích thước: 1.2 MB</Text>
              {/* Thêm kích thước file nếu có */}
            </View>
            <TouchableOpacity onPress={() => console.log('Download file')}>
              <Image
                source={AppIcons.downloadIcon}
                style={styles.downloadIcon}
              />
            </TouchableOpacity>
          </View>
        ) : (
          <Text style={styles.noDocumentText}>Không có tài liệu</Text>
        )}
      </View>
      <TouchableOpacity
        style={styles.navigateButton}
        onPress={handleNavigateToAssetCollateral}>
        <Text style={styles.navigateButtonText}>
          Chuyển đến tài sản thế chấp
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default FormCreditRating;
