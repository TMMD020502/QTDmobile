import React, {useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
// Remove CheckBox import
import Header from '../components/Header/Header';
import {useTheme} from '../context/ThemeContext';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../navigators/RootNavigator';
import i18n from '../../i18n';
import {useSelector} from 'react-redux';
import {RootState} from '../store/store';
import {initLoan} from '../api/services/loan';

type IntroduceLoanNavigationProp = StackNavigationProp<
  RootStackParamList,
  'IntroduceLoan'
>;

interface IntroduceLoanProps {
  navigation: IntroduceLoanNavigationProp;
}

interface ContentType {
  title: string;
  description: string;
  terms: string;
  buttonText: string;
  sections: {
    features: {
      title: string;
      bullets: string[];
    };
    requirements: {
      title: string;
      bullets: string[];
    };
    documents: {
      title: string;
      bullets: string[];
    };
  };
}

const IntroduceLoan: React.FC<IntroduceLoanProps> = ({navigation}) => {
  const [isAccepted, setIsAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const currentLanguage = i18n.language;
  const {theme} = useTheme();

  const user = useSelector((state: RootState) => state.user.userData);
  console.log('user', user);

  const content: Record<'vi' | 'en', ContentType> = {
    vi: {
      title: 'Vay tiêu dùng tín chấp',
      description:
        'Vay tiêu dùng tín chấp là hình thức cho vay không cần tài sản đảm bảo, chỉ dựa trên uy tín và khả năng trả nợ của người vay.',
      terms: 'Tôi đã đọc và đồng ý với các điều khoản trên',
      buttonText: 'Đăng ký vay',
      sections: {
        features: {
          title: 'Đặc điểm sản phẩm',
          bullets: [
            'Hạn mức vay: Từ 10 - 100 triệu đồng',
            'Thời hạn vay: 12 - 48 tháng',
            'Lãi suất: Từ 0.8%/tháng',
            'Không cần tài sản đảm bảo',
          ],
        },
        requirements: {
          title: 'Điều kiện vay',
          bullets: [
            'Công dân Việt Nam từ 20-60 tuổi',
            'Thu nhập ổn định từ 5 triệu/tháng',
            'Không có nợ xấu tại các tổ chức tín dụng',
          ],
        },
        documents: {
          title: 'Hồ sơ cần chuẩn bị',
          bullets: [
            'CCCD/CMND còn hiệu lực',
            'Sổ hộ khẩu/KT3',
            'Hợp đồng lao động và bảng lương',
            'Sao kê ngân hàng 3 tháng gần nhất',
          ],
        },
      },
    },
    en: {
      title: 'Unsecured Consumer Loan',
      description:
        "Unsecured consumer loan is a form of lending without collateral, based solely on the borrower's creditworthiness and repayment ability.",
      terms: 'I have read and agree to the above terms',
      buttonText: 'Apply for Loan',
      sections: {
        features: {
          title: 'Product Features',
          bullets: [
            'Loan amount: From 10 - 100 million VND',
            'Loan term: 12 - 48 months',
            'Interest rate: From 0.8%/month',
            'No collateral required',
          ],
        },
        requirements: {
          title: 'Loan Conditions',
          bullets: [
            'Vietnamese citizens aged 20-60',
            'Stable income from 5 million/month',
            'No bad debts at credit institutions',
          ],
        },
        documents: {
          title: 'Required Documents',
          bullets: [
            'Valid ID card',
            'Household registration book/KT3',
            'Labor contract and salary slip',
            'Bank statement of the last 3 months',
          ],
        },
      },
    },
  };

  const styles = StyleSheet.create({
    view: {
      flex: 1,
      backgroundColor: theme.background,
    },
    container: {
      flex: 1,
    },
    contentContainer: {
      padding: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 12,
    },
    description: {
      fontSize: 16,
      color: theme.text,
      lineHeight: 24,
      marginBottom: 20,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.text,
      marginTop: 20,
      marginBottom: 12,
    },
    bulletPoint: {
      flexDirection: 'row',
      marginBottom: 10,
      paddingLeft: 16,
    },
    bullet: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: theme.text,
      marginTop: 8,
      marginRight: 8,
    },
    bulletText: {
      flex: 1,
      fontSize: 15,
      color: theme.text,
      lineHeight: 22,
    },
    footer: {
      padding: 20,
      borderTopWidth: 1,
      borderTopColor: '#ccc',
      backgroundColor: theme.background,
    },
    checkboxContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    customCheckbox: {
      width: 20,
      height: 20,
      borderWidth: 2,
      borderColor: theme.noteText,
      borderRadius: 12,
      marginRight: 8,
      justifyContent: 'center',
      alignItems: 'center',
    },
    checkboxInner: {
      width: 12,
      height: 12,
      backgroundColor: theme.buttonSubmit,
      borderRadius: 8,
    },
    checkboxText: {
      flex: 1,
      color: theme.text,
      fontSize: 14,
    },
    button: {
      backgroundColor: isAccepted ? theme.buttonSubmit : '#ccc',
      padding: 16,
      borderRadius: 8,
      alignItems: 'center',
    },
    buttonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: '600',
    },
  });

  const handleApply = async () => {
    if (!isAccepted || isLoading || !user?.id) return;

    try {
      setIsLoading(true);
      const response = await initLoan({userId: user.id});

      if (response.code === 200) {
        navigation.replace('LoadingWorkflowLoan');
      }
    } catch (error) {
      Alert.alert(
        'Lỗi',
        'Không thể đăng ký khoản vay mới. \n Vui lòng liên hệ quầy để hỗ trợ',
      );
      console.log('Error initializing loan:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const selectedContent = content[currentLanguage === 'vi' ? 'vi' : 'en'];

  return (
    <SafeAreaView style={styles.view}>
      <View style={styles.container}>
        <Header Navbar="IntroduceLoan" navigation={navigation} />

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.contentContainer}>
            <Text style={styles.title}>{selectedContent.title}</Text>

            <Text style={styles.description}>
              {selectedContent.description}
            </Text>

            {/* Features Section */}
            <Text style={styles.sectionTitle}>
              {selectedContent.sections.features.title}
            </Text>
            {selectedContent.sections.features.bullets.map((bullet, index) => (
              <View key={index} style={styles.bulletPoint}>
                <View style={styles.bullet} />
                <Text style={styles.bulletText}>{bullet}</Text>
              </View>
            ))}

            {/* Requirements Section */}
            <Text style={styles.sectionTitle}>
              {selectedContent.sections.requirements.title}
            </Text>
            {selectedContent.sections.requirements.bullets.map(
              (bullet, index) => (
                <View key={index} style={styles.bulletPoint}>
                  <View style={styles.bullet} />
                  <Text style={styles.bulletText}>{bullet}</Text>
                </View>
              ),
            )}

            {/* Documents Section */}
            <Text style={styles.sectionTitle}>
              {selectedContent.sections.documents.title}
            </Text>
            {selectedContent.sections.documents.bullets.map((bullet, index) => (
              <View key={index} style={styles.bulletPoint}>
                <View style={styles.bullet} />
                <Text style={styles.bulletText}>{bullet}</Text>
              </View>
            ))}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => setIsAccepted(!isAccepted)}
            disabled={isLoading}>
            <View style={styles.customCheckbox}>
              {isAccepted && <View style={styles.checkboxInner} />}
            </View>
            <Text style={styles.checkboxText}>{selectedContent.terms}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, isLoading && {opacity: 0.7}]}
            onPress={handleApply}
            disabled={!isAccepted || isLoading}>
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>
                {selectedContent.buttonText}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default IntroduceLoan;
