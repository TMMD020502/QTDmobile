import {StyleSheet, Text, View, ImageSourcePropType} from 'react-native';
import React from 'react';
import QuestionHome from '../QuestionHome/QuestionHome';
import {AppIcons} from '../../icons';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../navigators/RootNavigator';

type NavigationProp = StackNavigationProp<RootStackParamList, 'Questions'>;

interface Theme {
  text: string;
  background: string;
  iconColor: string;
  backgroundBox: string;
}

interface WrapQuestionHomeProps {
  name: string;
  theme: Theme;
}

interface Question {
  id: string;
  question: string;
  answer: string;
  icon: ImageSourcePropType;
  relatedQuestions: string[];
}

// Sample data for questions
const questionsData: Question[] = [
  {
    id: '1',
    question: 'Chuyển tiền / Nạp tiền',
    answer:
      'Để chuyển tiền hoặc nạp tiền, bạn cần đăng nhập vào tài khoản, chọn chức năng "Chuyển tiền" hoặc "Nạp tiền" và làm theo hướng dẫn trên màn hình.',
    icon: AppIcons.depositIcon, // Updated to use depositIcon
    relatedQuestions: ['2', '4'],
  },
  {
    id: '2',
    question: 'Chat với nhân viên',
    answer:
      'Bạn có thể chat với nhân viên hỗ trợ bằng cách nhấn vào biểu tượng chat ở góc phải màn hình chính hoặc trong mục "Hỗ trợ".',
    icon: AppIcons.message, // Using message icon
    relatedQuestions: ['1'],
  },
  {
    id: '3',
    question: 'Cách rút tiền về tài khoản ngân hàng',
    answer:
      'Để rút tiền về tài khoản ngân hàng, vui lòng chọn chức năng "Rút tiền", nhập số tiền và chọn tài khoản ngân hàng để nhận tiền.',
    icon: AppIcons.withdrawIcon, // Updated to use withdrawIcon
    relatedQuestions: ['1', '4'],
  },
  {
    id: '4',
    question: 'Hướng dẫn thay đổi thông tin cá nhân',
    answer:
      'Bạn có thể thay đổi thông tin cá nhân bằng cách vào mục "Cài đặt" > "Thông tin cá nhân" và cập nhật thông tin theo yêu cầu.',
    icon: AppIcons.infoIcon, // Updated to use infoIcon
    relatedQuestions: ['2'],
  },
];

const WrapQuestionHome: React.FC<WrapQuestionHomeProps> = ({name, theme}) => {
  const navigation = useNavigation<NavigationProp>();

  const handleQuestionPress = (questionData: Question) => {
    navigation.navigate('Questions', {
      questionData,
      allQuestions: questionsData,
    });
  };

  return (
    <View style={styles.questions}>
      <Text style={[styles.headingTitle, {color: theme.text}]}>{name}</Text>

      <View style={styles.wrapBox}>
        {questionsData.map((item, index) => (
          <QuestionHome
            key={index}
            question={item.question}
            urlIcon={item.icon}
            theme={theme}
            onPress={() => handleQuestionPress(item)}
            data={item}
          />
        ))}
      </View>
    </View>
  );
};

export default WrapQuestionHome;

const styles = StyleSheet.create({
  questions: {
    marginTop: 32,
    paddingHorizontal: 8,
  },
  headingTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 16,
    letterSpacing: 0.3,
  },
  wrapBox: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 8,
    rowGap: 16,
  },
});
