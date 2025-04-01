/* eslint-disable react-native/no-inline-styles */
import {
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React, {useState} from 'react';
import DropdownComponent from '../DropdownComponent/DropdownComponent';
import InputBackground from '../InputBackground/InputBackground';
import {useTranslation} from 'react-i18next';
import i18n from '../../../i18n';
import {Theme} from '../../theme/colors';
import {createCreditRating} from '../../api/services/loan';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../navigators/RootNavigator';
import DatePicker from '../DatePicker/DatePicker';
import {formatDate} from '../../utils/dateUtils';
import {RatingByCriteria, RatingByCIC} from '../../api/types/creditRating';

interface FormCreditRatingProps {
  theme: Theme;
  appId: string;
  navigation: StackNavigationProp<RootStackParamList, 'CreditRating'>;
}

interface TargetItem {
  value: string;
  label: string;
}

interface FormData {
  ratingByCriteria: RatingByCriteria;
  ratingByCIC: RatingByCIC;
}

interface FormErrors {
  'ratingByCriteria.score'?: string;
  'ratingByCriteria.ratingLevel'?: string;
  'ratingByCIC.score'?: string;
  'ratingByCIC.riskLevel'?: string;
  'ratingByCIC.document'?: string;
  'ratingByCIC.term'?: string;
}

const FormCreditRating: React.FC<FormCreditRatingProps> = ({
  theme,
  appId,
  navigation,
}) => {
  const currentLanguage = i18n.language;
  const {t} = useTranslation();

  const ratingLevels = [
    {value: 'A', label: 'A'},
    {value: 'AA', label: 'AA'},
    {value: 'B', label: 'B'},
    {value: 'BB', label: 'BB'},
    {value: 'C', label: 'C'},
    {value: 'CC', label: 'CC'},
  ];

  const riskLevels = [
    {value: '01', label: '01 - Low Risk'},
    {value: '02', label: '02 - Medium Risk'},
    {value: '03', label: '03 - High Risk'},
  ];

  const [formData, setFormData] = useState<FormData>({
    ratingByCriteria: {
      score: 85.5,
      ratingLevel: 'AA',
    },
    ratingByCIC: {
      score: 750.5,
      riskLevel: '01',
      scoringDate: new Date().toISOString().split('T')[0] + 'T00:00:00Z', // Format as 2024-12-31T00:00:00Z
      document: 'CIC_REPORT_123.pdf',
      term: 15,
    },
  });

  console.log('formData', formData);

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempDate, setTempDate] = useState(new Date());

  const handleOnchange = (field: string, value: any): void => {
    setFormData(prev => {
      if (field.includes('.')) {
        const [parent, child] = field.split('.') as [keyof FormData, string];

        // Type guard to ensure parent is a valid key of FormData
        if (parent === 'ratingByCriteria' || parent === 'ratingByCIC') {
          return {
            ...prev,
            [parent]: {
              ...prev[parent],
              [child]: value,
            },
          };
        }
      }
      // This case shouldn't be reached with the current form structure,
      // but keeping it for any potential direct field updates
      return {
        ...prev,
        [field]: value,
      };
    });
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    if (!formData.ratingByCriteria.score) {
      newErrors['ratingByCriteria.score'] =
        currentLanguage === 'vi'
          ? 'Vui lòng nhập điểm đánh giá'
          : 'Please enter rating score';
      isValid = false;
    }

    if (!formData.ratingByCriteria.ratingLevel) {
      newErrors['ratingByCriteria.ratingLevel'] =
        currentLanguage === 'vi'
          ? 'Vui lòng chọn cấp độ đánh giá'
          : 'Please select rating level';
      isValid = false;
    }

    if (!formData.ratingByCIC.score) {
      newErrors['ratingByCIC.score'] =
        currentLanguage === 'vi'
          ? 'Vui lòng nhập điểm CIC'
          : 'Please enter CIC score';
      isValid = false;
    }

    if (!formData.ratingByCIC.riskLevel) {
      newErrors['ratingByCIC.riskLevel'] =
        currentLanguage === 'vi'
          ? 'Vui lòng chọn mức độ rủi ro'
          : 'Please select risk level';
      isValid = false;
    }

    if (!formData.ratingByCIC.document) {
      newErrors['ratingByCIC.document'] =
        currentLanguage === 'vi'
          ? 'Vui lòng nhập tên tài liệu'
          : 'Please enter document name';
      isValid = false;
    }

    if (!formData.ratingByCIC.term) {
      newErrors['ratingByCIC.term'] =
        currentLanguage === 'vi' ? 'Vui lòng nhập kỳ hạn' : 'Please enter term';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);

      // Submit credit rating
      const ratingData = {
        ratingByCriteria: formData.ratingByCriteria,
        ratingByCIC: formData.ratingByCIC,
      };

      const response = await createCreditRating(appId, ratingData);

      if (response) {
        navigation.replace('HomeTabs', {screen: 'Loan'});
      }
    } catch (error: any) {
      console.log('Error creating credit rating:', error.response);

      // Type guard to check if error is an object with response property
      const errorResponse = (error as any)?.response ?? null;

      const errorMessage = errorResponse?.data?.message || '';

      // Check for specific dependency error
      if (
        errorMessage ===
        'Dependency step not completed (create-financial-info:inprogress)'
      ) {
        Alert.alert(
          currentLanguage === 'vi' ? 'Thông báo' : 'Notification',
          currentLanguage === 'vi'
            ? 'Vui lòng đợi mục thông tin tài chính xác nhận'
            : 'Please wait for financial information to be confirmed',
        );
      } else {
        Alert.alert(
          currentLanguage === 'vi' ? 'Lỗi' : 'Error',
          currentLanguage === 'vi'
            ? 'Có lỗi xảy ra khi tạo đánh giá tín dụng'
            : 'Error occurred while creating credit rating',
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDatePress = () => {
    setShowDatePicker(true);
    setTempDate(
      formData.ratingByCIC.scoringDate
        ? new Date(formData.ratingByCIC.scoringDate)
        : new Date(),
    );
  };

  const handleDateConfirm = (dateString: string) => {
    // Convert the date to the required format: YYYY-MM-DDT00:00:00Z
    const date = new Date(dateString);
    const formattedDate = date.toISOString().split('T')[0] + 'T00:00:00Z';

    handleOnchange('ratingByCIC.scoringDate', formattedDate);
    setShowDatePicker(false);
  };

  const handleDateChange = (date: Date) => {
    setTempDate(date);
  };

  const styles = StyleSheet.create({
    boxInput: {
      marginBottom: 12,
    },
    headingTitle: {
      fontWeight: 'bold',
      marginBottom: 8,
      color: theme.text,
    },
    dateInput: {
      padding: 12,
      borderRadius: 8,
      marginTop: 4,
      backgroundColor: theme.inputBackground,
      borderWidth: 1,
      borderColor: theme.borderInputBackground,
    },
    dateInputText: {
      fontSize: 14,
      fontWeight: '400',
      color: '#000',
    },
    dateInputPlaceholder: {
      fontSize: 14,
      fontWeight: '400',
      color: '#999',
    },
    btn: {
      width: '100%',
      backgroundColor: '#007BFF',
      padding: 12,
      borderRadius: 12,
      marginTop: 8,
    },
    errorText: {
      color: 'red',
      fontSize: 12,
      marginTop: 8,
    },
    textWhite: {
      color: 'white',
    },
    // ...other styles
  });

  return (
    <View>
      {/* Credit Rating Criteria Section */}
      <View style={{marginTop: 20}}>
        <Text style={[styles.headingTitle, {fontSize: 16}]}>
          {currentLanguage === 'vi' ? 'Đánh giá tín dụng' : 'Credit Rating'}
        </Text>
      </View>

      <View style={styles.boxInput}>
        <Text style={styles.headingTitle}>
          {currentLanguage === 'vi' ? 'Điểm đánh giá' : 'Rating Score'}
        </Text>
        <InputBackground
          placeholder={
            currentLanguage === 'vi' ? 'Nhập điểm số' : 'Enter score'
          }
          keyboardType="numeric"
          onChangeText={(value: string) =>
            handleOnchange('ratingByCriteria.score', Number(value))
          }
          value={formData.ratingByCriteria.score.toString()}
        />
        {errors['ratingByCriteria.score'] && (
          <Text style={styles.errorText}>
            {errors['ratingByCriteria.score']}
          </Text>
        )}
      </View>

      <View style={styles.boxInput}>
        <Text style={styles.headingTitle}>
          {currentLanguage === 'vi' ? 'Cấp độ đánh giá' : 'Rating Level'}
        </Text>
        <DropdownComponent
          value={formData.ratingByCriteria.ratingLevel}
          data={ratingLevels}
          placeholder={
            currentLanguage === 'vi' ? 'Chọn cấp độ' : 'Select rating level'
          }
          onChange={(value: TargetItem) =>
            handleOnchange('ratingByCriteria.ratingLevel', value.value)
          }
        />
        {errors['ratingByCriteria.ratingLevel'] && (
          <Text style={styles.errorText}>
            {errors['ratingByCriteria.ratingLevel']}
          </Text>
        )}
      </View>

      {/* CIC Rating Section */}
      <View style={{marginTop: 20}}>
        <Text style={[styles.headingTitle, {fontSize: 16}]}>
          {currentLanguage === 'vi'
            ? 'Đánh giá từ Trung tâm CIC'
            : 'CIC Rating'}
        </Text>
      </View>

      <View style={styles.boxInput}>
        <Text style={styles.headingTitle}>
          {currentLanguage === 'vi' ? 'Điểm số CIC' : 'CIC Score'}
        </Text>
        <InputBackground
          placeholder={
            currentLanguage === 'vi' ? 'Nhập điểm số' : 'Enter score'
          }
          keyboardType="numeric"
          onChangeText={(value: string) =>
            handleOnchange('ratingByCIC.score', Number(value))
          }
          value={formData.ratingByCIC.score.toString()}
        />
        {errors['ratingByCIC.score'] && (
          <Text style={styles.errorText}>{errors['ratingByCIC.score']}</Text>
        )}
      </View>

      <View style={styles.boxInput}>
        <Text style={styles.headingTitle}>
          {currentLanguage === 'vi' ? 'Mức độ rủi ro' : 'Risk Level'}
        </Text>
        <DropdownComponent
          value={formData.ratingByCIC.riskLevel}
          data={riskLevels}
          placeholder={
            currentLanguage === 'vi' ? 'Chọn mức độ' : 'Select risk level'
          }
          onChange={(value: TargetItem) =>
            handleOnchange('ratingByCIC.riskLevel', value.value)
          }
        />
        {errors['ratingByCIC.riskLevel'] && (
          <Text style={styles.errorText}>
            {errors['ratingByCIC.riskLevel']}
          </Text>
        )}
      </View>

      <View style={styles.boxInput}>
        <Text style={styles.headingTitle}>
          {currentLanguage === 'vi' ? 'Ngày đánh giá' : 'Scoring Date'}
        </Text>
        <TouchableOpacity style={styles.dateInput} onPress={handleDatePress}>
          <Text
            style={
              formData.ratingByCIC.scoringDate
                ? styles.dateInputText
                : styles.dateInputPlaceholder
            }>
            {formData.ratingByCIC.scoringDate
              ? formatDate(new Date(formData.ratingByCIC.scoringDate))
              : currentLanguage === 'vi'
              ? 'Chọn ngày'
              : 'Select date'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.boxInput}>
        <Text style={styles.headingTitle}>
          {currentLanguage === 'vi' ? 'Tài liệu' : 'Document'}
        </Text>
        <InputBackground
          placeholder={
            currentLanguage === 'vi'
              ? 'Nhập tên tài liệu'
              : 'Enter document name'
          }
          onChangeText={(value: string) =>
            handleOnchange('ratingByCIC.document', value)
          }
          value={formData.ratingByCIC.document}
        />
        {errors['ratingByCIC.document'] && (
          <Text style={styles.errorText}>{errors['ratingByCIC.document']}</Text>
        )}
      </View>

      <View style={styles.boxInput}>
        <Text style={styles.headingTitle}>
          {currentLanguage === 'vi' ? 'Kỳ hạn (tháng)' : 'Term (months)'}
        </Text>
        <InputBackground
          placeholder={currentLanguage === 'vi' ? 'Nhập kỳ hạn' : 'Enter term'}
          keyboardType="numeric"
          onChangeText={(value: string) =>
            handleOnchange('ratingByCIC.term', Number(value))
          }
          value={formData.ratingByCIC.term.toString()}
        />
        {errors['ratingByCIC.term'] && (
          <Text style={styles.errorText}>{errors['ratingByCIC.term']}</Text>
        )}
      </View>

      <TouchableOpacity
        style={[styles.btn, isLoading && {opacity: 0.7}]}
        onPress={handleSubmit}
        disabled={isLoading}>
        {isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text
            style={[
              styles.textWhite,
              {fontWeight: 'bold', textAlign: 'center'},
            ]}>
            {t('formCreateLoan.next')}
          </Text>
        )}
      </TouchableOpacity>

      {showDatePicker && (
        <DatePicker
          isVisible={showDatePicker}
          onClose={() => setShowDatePicker(false)}
          onConfirm={handleDateConfirm}
          value={tempDate}
          onChange={handleDateChange}
          theme={theme}
          locale="vi-VN"
        />
      )}
    </View>
  );
};

export default FormCreditRating;
