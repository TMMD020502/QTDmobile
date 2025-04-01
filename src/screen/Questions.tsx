import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  ImageSourcePropType,
} from 'react-native';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {useTheme} from '../context/ThemeContext';
import {AppIcons} from '../icons';

// Define types for the question data
interface Question {
  id: string;
  question: string;
  answer: string;
  relatedQuestions?: string[];
  icon: ImageSourcePropType;
}

// Define the route params type
type QuestionsRouteParams = {
  questionData: Question;
  allQuestions: Question[];
};

// Define the route prop type
type QuestionsRouteProp = RouteProp<
  {Questions: QuestionsRouteParams},
  'Questions'
>;

// Define the navigation prop type
type QuestionsNavigationProp = StackNavigationProp<{
  Questions: QuestionsRouteParams;
}>;

const Questions = () => {
  const navigation = useNavigation<QuestionsNavigationProp>();
  const route = useRoute<QuestionsRouteProp>();
  const {theme} = useTheme();

  const {questionData, allQuestions} = route.params;

  const getRelatedQuestions = () => {
    if (!questionData.relatedQuestions) return [];

    return questionData.relatedQuestions
      .map(id => allQuestions.find(q => q.id === id))
      .filter((q): q is Question => q !== undefined);
  };

  const relatedQuestions = getRelatedQuestions();

  const handleRelatedQuestionPress = (question: Question) => {
    // Update current screen with new question instead of navigating to a new screen
    navigation.setParams({
      questionData: question,
      allQuestions: allQuestions,
    });
  };

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: theme.background}]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Image
            source={AppIcons.back}
            style={[styles.iconStyle, {tintColor: theme.text}]}
          />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, {color: theme.text}]}>
          Câu hỏi thường gặp
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        {/* Main Question */}
        <View
          style={[
            styles.questionContainer,
            {backgroundColor: theme.backgroundBox},
          ]}>
          <Text style={[styles.questionText, {color: theme.text}]}>
            {questionData.question}
          </Text>
          <Text style={[styles.answerText, {color: theme.text}]}>
            {questionData.answer}
          </Text>
        </View>

        {/* Related Questions */}
        {relatedQuestions.length > 0 && (
          <View style={styles.relatedSection}>
            <Text style={[styles.relatedTitle, {color: theme.text}]}>
              Câu hỏi liên quan
            </Text>

            {relatedQuestions.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.relatedItem,
                  {backgroundColor: theme.backgroundBox},
                ]}
                onPress={() => handleRelatedQuestionPress(item)}>
                <Image
                  source={item.icon}
                  style={[styles.relatedIcon, {tintColor: theme.iconColor}]}
                />
                <Text style={[styles.relatedItemText, {color: theme.text}]}>
                  {item.question}
                </Text>
                <Image
                  source={AppIcons.next}
                  style={[styles.chevronIcon, {tintColor: theme.iconColor}]}
                />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Contact support section */}
        <View
          style={[
            styles.supportContainer,
            {backgroundColor: theme.backgroundBox},
          ]}>
          <Text style={[styles.supportTitle, {color: theme.text}]}>
            Bạn vẫn cần được trợ giúp?
          </Text>
          <TouchableOpacity
            style={[styles.supportButton, {borderColor: theme.iconColor}]}>
            <Image
              source={AppIcons.message}
              style={[styles.supportIcon, {tintColor: theme.iconColor}]}
            />
            <Text style={[styles.supportButtonText, {color: theme.text}]}>
              Chat với nhân viên hỗ trợ
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 8,
  },
  iconStyle: {
    width: 24,
    height: 24,
  },
  chevronIcon: {
    width: 20,
    height: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  questionContainer: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  questionText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  answerText: {
    fontSize: 16,
    lineHeight: 24,
  },
  relatedSection: {
    marginBottom: 24,
  },
  relatedTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  relatedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  relatedIcon: {
    marginRight: 12,
    width: 20,
    height: 20,
  },
  relatedItemText: {
    flex: 1,
    fontSize: 14,
  },
  supportContainer: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  supportTitle: {
    fontSize: 16,
    marginBottom: 16,
  },
  supportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    width: '100%',
  },
  supportIcon: {
    marginRight: 8,
    width: 20,
    height: 20,
  },
  supportButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
});

export default Questions;
