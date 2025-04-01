import {StyleSheet, Text, View} from 'react-native';
import React, {useMemo} from 'react';
import ProductHome from '../ProductHome/ProductHome';
import {useTranslation} from 'react-i18next';

interface Theme {
  text: string;
  background: string;
  backgroundBox: string;
}

interface WrapProductHomeProps {
  name: string;
  theme: Theme;
}

interface ContentItem {
  en: string;
  vi: string;
}

const WrapProductHome: React.FC<WrapProductHomeProps> = ({name, theme}) => {
  const {i18n} = useTranslation();

  // Reduced to just 4 core loan categories
  const headers: ContentItem[] = [
    {en: 'Personal Loan', vi: 'Vay Cá Nhân'},
    {en: 'Home Loan', vi: 'Vay Mua Nhà'},
    {en: 'Business Loan', vi: 'Vay Kinh Doanh'},
    {en: 'Education Loan', vi: 'Vay Học Tập'},
  ];

  // Enhanced descriptions - more compelling and marketing-oriented
  const descriptions: ContentItem[] = [
    {
      en: 'Transform your dreams into reality with our lightning-fast approval and market-leading rates starting from just 5.99%',
      vi: 'Biến ước mơ thành hiện thực với quy trình phê duyệt siêu nhanh và lãi suất hàng đầu thị trường chỉ từ 6%',
    },
    {
      en: 'Enjoy ultimate flexibility with customized repayment plans and zero early settlement fees, designed around your lifestyle',
      vi: 'Tận hưởng sự linh hoạt tối đa với kế hoạch trả nợ tùy chỉnh và không phí tất toán sớm, được thiết kế phù hợp với lối sống của bạn',
    },
    {
      en: 'Join 50,000+ satisfied customers who saved an average of $2,500 annually by refinancing with us',
      vi: 'Tham gia cùng hơn 50.000 khách hàng hài lòng đã tiết kiệm trung bình 2.500$ mỗi năm bằng cách tái cấp vốn với chúng tôi',
    },
    {
      en: 'Experience our award-winning 24/7 customer service and digital platform rated #1 in customer satisfaction',
      vi: 'Trải nghiệm dịch vụ khách hàng 24/7 từng đoạt giải thưởng và nền tảng kỹ thuật số được xếp hạng #1 về sự hài lòng của khách hàng',
    },
    {
      en: 'Unlock exclusive benefits including complimentary financial planning and premium credit card offers',
      vi: 'Mở khóa các đặc quyền độc quyền bao gồm lập kế hoạch tài chính miễn phí và ưu đãi thẻ tín dụng cao cấp',
    },
    {
      en: 'Secure your future with built-in payment protection and flexible terms during unexpected life changes',
      vi: 'Bảo đảm tương lai của bạn với bảo vệ thanh toán tích hợp và điều khoản linh hoạt trong những thay đổi cuộc sống không lường trước',
    },
  ];

  // Function to get random item from array
  const getRandomItem = (items: ContentItem[]) => {
    const randomIndex = Math.floor(Math.random() * items.length);
    const lang = i18n.language === 'vi' ? 'vi' : 'en';
    return items[randomIndex][lang];
  };

  // Generate content for 3 products with fixed headings but random compelling descriptions
  const products = useMemo(() => {
    // Create an array of 3 products, each using a different header (no duplicates)
    const shuffledHeaders = [...headers].sort(() => Math.random() - 0.5);
    return shuffledHeaders.slice(0, 3).map(header => ({
      header: header[i18n.language === 'vi' ? 'vi' : 'en'],
      desc: getRandomItem(descriptions),
    }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language]); // Regenerate when language changes

  return (
    <View style={styles.product}>
      <Text style={[styles.headingTitle, {color: theme.text}]}>{name}</Text>

      <View style={styles.wrapProduct}>
        {products.map((product, index) => (
          <ProductHome
            key={index}
            header={product.header}
            desc={product.desc}
            theme={theme}
          />
        ))}
      </View>
    </View>
  );
};

export default WrapProductHome;

const styles = StyleSheet.create({
  product: {
    marginTop: 20,
  },
  headingTitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  wrapProduct: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    marginTop: 16,
  },
});
