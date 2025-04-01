import React, {createContext, useContext, useState} from 'react';
import i18n from 'i18next';

// Tạo context cho ngôn ngữ
const LanguageContext = createContext();

// Custom hook để sử dụng ngôn ngữ
export const useLanguage = () => {
  return useContext(LanguageContext);
};

// Cung cấp context cho các component
export const LanguageProvider = ({children}) => {
  const [language, setLanguage] = useState(i18n.language); // Lưu trữ ngôn ngữ hiện tại
  console.log(language);
  const changeLanguage = lang => {
    i18n.changeLanguage(lang); // Thay đổi ngôn ngữ của i18next
    setLanguage(lang); // Cập nhật ngôn ngữ trong state
  };

  return (
    <LanguageContext.Provider value={{language, changeLanguage}}>
      {children}
    </LanguageContext.Provider>
  );
};
