import React, {useState, useCallback, useEffect} from 'react';
import {TextInputProps} from 'react-native';
import InputBackground from '../InputBackground/InputBackground';
import i18n from '../../../i18n';

interface CurrencyInputProps
  extends Omit<TextInputProps, 'value' | 'onChangeText'> {
  value: number;
  onChangeText: (value: number) => void;
  placeholder?: string;
}

const CurrencyInput: React.FC<CurrencyInputProps> = ({
  value,
  onChangeText,
  placeholder = '',
  ...props
}) => {
  // Store the formatted display value
  const [displayValue, setDisplayValue] = useState('');
  // Track current language
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);

  // Set up language change listener
  useEffect(() => {
    const handleLanguageChange = () => {
      setCurrentLanguage(i18n.language);
    };

    // Add language change listener
    i18n.on('languageChanged', handleLanguageChange);

    // Clean up listener on unmount
    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, []);

  // Format a number based on the current language - using manual formatting to ensure correct format
  const formatNumber = useCallback(
    (value: number | string): string => {
      if (!value && value !== 0) return '';

      // Convert to number if it's a string
      const numValue =
        typeof value === 'string'
          ? parseInt(value.replace(/\D/g, ''), 10)
          : value;

      if (isNaN(numValue)) return '';

      // Convert number to string and split by thousands
      const parts = numValue.toString().split('.');
      const wholePart = parts[0];
      const decimalPart = parts.length > 1 ? parts[1] : '';

      // Add thousand separators based on language
      let result = '';

      // Add thousand separators to whole part
      if (currentLanguage === 'vi') {
        // Vietnamese format: use comma (,) as thousand separator
        result = wholePart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      } else {
        // English format: use dot (.) as thousand separator
        // First format with comma, then replace commas with dots
        result = wholePart
          .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
          .replace(/,/g, '.');
      }

      // Add decimal part if it exists
      if (decimalPart) {
        result += (currentLanguage === 'vi' ? '.' : ',') + decimalPart;
      }

      return result;
    },
    [currentLanguage],
  );

  // Format the initial value and when external value changes
  useEffect(() => {
    setDisplayValue(formatNumber(value));
  }, [value, formatNumber]);

  // Handle text changes with improved cleaning based on current language
  const handleTextChange = useCallback(
    (text: string) => {
      // Get current language for proper cleaning
      let numericValue = '';

      if (currentLanguage === 'vi') {
        // For Vietnamese input (using comma as thousand separator)
        // Keep only digits and remove any dots (decimal point shouldn't be entered)
        // Then replace all commas with nothing to get the raw number
        numericValue = text.replace(/[^\d,]/g, '').replace(/,/g, '');
      } else {
        // For English input (using dot as thousand separator)
        // Keep only digits and remove any commas (decimal point shouldn't be entered)
        // Then replace all dots with nothing to get the raw number
        numericValue = text.replace(/[^\d.]/g, '').replace(/\./g, '');
      }

      if (!numericValue) {
        setDisplayValue('');
        onChangeText(0);
        return;
      }

      // Convert to number
      const numberValue = parseInt(numericValue, 10);

      // Format with appropriate separator for display
      const formatted = formatNumber(numberValue);
      setDisplayValue(formatted);

      // Notify parent with numeric value
      onChangeText(numberValue);
    },
    [onChangeText, formatNumber, currentLanguage],
  );

  // Reformat when language changes
  useEffect(() => {
    if (value || value === 0) {
      setDisplayValue(formatNumber(value));
    }
  }, [currentLanguage, formatNumber, value]);

  return (
    <InputBackground
      value={displayValue}
      onChangeText={handleTextChange}
      placeholder={placeholder}
      keyboardType="numeric"
      {...props}
    />
  );
};

export default CurrencyInput;
