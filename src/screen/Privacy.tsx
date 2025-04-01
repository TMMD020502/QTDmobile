import React from 'react';
import {SafeAreaView, StyleSheet, View, Text, ScrollView} from 'react-native';
import Header from '../components/Header/Header';
import {useTheme} from '../context/ThemeContext';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../navigators/RootNavigator';
import i18n from '../../i18n';

type PrivacyNavigationProp = StackNavigationProp<RootStackParamList, 'Privacy'>;

interface PrivacyProps {
  navigation: PrivacyNavigationProp;
}

const Privacy: React.FC<PrivacyProps> = ({navigation}) => {
  const currentLanguage = i18n.language;
  const {theme} = useTheme();

  const content = {
    vi: {
      intro:
        'Quỹ tín dụng nhân dân cam kết bảo vệ quyền riêng tư của khách hàng. Chính sách này mô tả cách chúng tôi thu thập, sử dụng và bảo vệ thông tin của bạn.',
      sections: {
        collection: {
          title: '1. Thông tin chúng tôi thu thập',
          bullets: [
            'Thông tin cá nhân: họ tên, ngày sinh, CCCD/CMND, địa chỉ',
            'Thông tin liên hệ: số điện thoại, email',
            'Thông tin tài chính: lịch sử giao dịch, số dư tài khoản',
          ],
        },
        purpose: {
          title: '2. Mục đích sử dụng thông tin',
          intro: 'Chúng tôi sử dụng thông tin của bạn để:',
          bullets: [
            'Cung cấp và quản lý dịch vụ tài chính',
            'Tuân thủ các quy định pháp luật',
            'Bảo mật và phòng chống gian lận',
          ],
        },
        security: {
          title: '3. Bảo mật thông tin',
          content:
            'Chúng tôi áp dụng các biện pháp bảo mật nghiêm ngặt để bảo vệ thông tin của bạn khỏi truy cập trái phép, thay đổi hoặc tiết lộ.',
        },
        sharing: {
          title: '4. Chia sẻ thông tin',
          intro:
            'Chúng tôi không chia sẻ thông tin của bạn với bên thứ ba, trừ khi:',
          bullets: ['Được sự đồng ý của bạn', 'Theo yêu cầu của pháp luật'],
        },
      },
      footer: {
        lastUpdate: 'Cập nhật lần cuối: 15/12/2023',
        author: 'Quỹ tín dụng nhân dân Châu Đức',
      },
    },
    en: {
      intro:
        "The People's Credit Fund is committed to protecting customer privacy. This policy describes how we collect, use and protect your information.",
      sections: {
        collection: {
          title: '1. Information We Collect',
          bullets: [
            'Personal information: full name, date of birth, ID card, address',
            'Contact information: phone number, email',
            'Financial information: transaction history, account balance',
          ],
        },
        purpose: {
          title: '2. Purpose of Information Use',
          intro: 'We use your information to:',
          bullets: [
            'Provide and manage financial services',
            'Comply with legal regulations',
            'Security and fraud prevention',
          ],
        },
        security: {
          title: '3. Information Security',
          content:
            'We implement strict security measures to protect your information from unauthorized access, modification or disclosure.',
        },
        sharing: {
          title: '4. Information Sharing',
          intro:
            'We do not share your information with third parties, except when:',
          bullets: ['With your consent', 'Required by law'],
        },
      },
      footer: {
        lastUpdate: 'Last updated: December 15, 2023',
        author: "Chau Duc People's Credit Fund",
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
    privacyContainer: {
      padding: 16,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 16,
    },
    heading: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.text,
      marginTop: 20,
      marginBottom: 8,
    },
    paragraph: {
      fontSize: 14,
      color: theme.text,
      lineHeight: 22,
      marginBottom: 12,
    },
    bulletPoint: {
      flexDirection: 'row',
      marginBottom: 8,
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
      fontSize: 14,
      color: theme.text,
      lineHeight: 22,
    },
    footer: {
      marginTop: 24,
      paddingTop: 16,
      borderTopWidth: 1,
      borderTopColor: '#ccc',
    },
    authorText: {
      fontSize: 14,
      color: theme.text,
      fontStyle: 'italic',
    },
  });

  return (
    <SafeAreaView style={styles.view}>
      <View style={styles.container}>
        <Header Navbar="Privacy" navigation={navigation} />

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.privacyContainer}>
            <Text style={styles.paragraph}>
              {content[currentLanguage === 'vi' ? 'vi' : 'en'].intro}
            </Text>

            {/* Collection Section */}
            <Text style={styles.heading}>
              {
                content[currentLanguage === 'vi' ? 'vi' : 'en'].sections
                  .collection.title
              }
            </Text>
            {content[
              currentLanguage === 'vi' ? 'vi' : 'en'
            ].sections.collection.bullets.map((bullet, index) => (
              <View key={index} style={styles.bulletPoint}>
                <View style={styles.bullet} />
                <Text style={styles.bulletText}>{bullet}</Text>
              </View>
            ))}

            {/* Purpose Section */}
            <Text style={styles.heading}>
              {
                content[currentLanguage === 'vi' ? 'vi' : 'en'].sections.purpose
                  .title
              }
            </Text>
            <Text style={styles.paragraph}>
              {
                content[currentLanguage === 'vi' ? 'vi' : 'en'].sections.purpose
                  .intro
              }
            </Text>
            {content[
              currentLanguage === 'vi' ? 'vi' : 'en'
            ].sections.purpose.bullets.map((bullet, index) => (
              <View key={index} style={styles.bulletPoint}>
                <View style={styles.bullet} />
                <Text style={styles.bulletText}>{bullet}</Text>
              </View>
            ))}

            {/* Security Section */}
            <Text style={styles.heading}>
              {
                content[currentLanguage === 'vi' ? 'vi' : 'en'].sections
                  .security.title
              }
            </Text>
            <Text style={styles.paragraph}>
              {
                content[currentLanguage === 'vi' ? 'vi' : 'en'].sections
                  .security.content
              }
            </Text>

            {/* Sharing Section */}
            <Text style={styles.heading}>
              {
                content[currentLanguage === 'vi' ? 'vi' : 'en'].sections.sharing
                  .title
              }
            </Text>
            <Text style={styles.paragraph}>
              {
                content[currentLanguage === 'vi' ? 'vi' : 'en'].sections.sharing
                  .intro
              }
            </Text>
            {content[
              currentLanguage === 'vi' ? 'vi' : 'en'
            ].sections.sharing.bullets.map((bullet, index) => (
              <View key={index} style={styles.bulletPoint}>
                <View style={styles.bullet} />
                <Text style={styles.bulletText}>{bullet}</Text>
              </View>
            ))}

            <View style={styles.footer}>
              <Text style={styles.authorText}>
                {
                  content[currentLanguage === 'vi' ? 'vi' : 'en'].footer
                    .lastUpdate
                }
              </Text>
              <Text style={styles.authorText}>
                {content[currentLanguage === 'vi' ? 'vi' : 'en'].footer.author}
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Privacy;
