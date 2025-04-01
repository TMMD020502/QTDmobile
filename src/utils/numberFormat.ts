import i18n from '../../i18n';

/**
 * Format a number with thousand separators based on current language
 * @param num The number to format
 * @returns Formatted number string with appropriate thousand separators
 */
export const formatNumberWithCommas = (num: number): string => {
  const currentLanguage = i18n.language;

  if (currentLanguage === 'vi') {
    // Vietnamese format: 100,000
    return num.toLocaleString('vi-VN');
  } else {
    // English format: 100.000
    return num.toLocaleString('en-US').replace(/,/g, '.');
  }
};

/**
 * Format a number as currency with appropriate thousand separators and symbol
 * @param num The number to format
 * @returns Formatted currency string with symbol
 */
export const formatCurrency = (num: number): string => {
  const currentLanguage = i18n.language;

  if (currentLanguage === 'vi') {
    return `${formatNumberWithCommas(num)} đ`;
  } else {
    return `${formatNumberWithCommas(num)} $`;
  }
};

/**
 * Remove non-numeric characters from a string
 * @param str The input string
 * @returns String with only numeric characters
 */
export const parseNumericString = (str: string): string => {
  return str.replace(/[^0-9]/g, '');
};

/**
 * Check if a string is a currency formatted value
 * @param str The string to check
 * @returns Boolean indicating if the string contains currency formatting
 */
export const isCurrencyFormat = (str: string): boolean => {
  const currentLanguage = i18n.language;
  // Check if string ends with currency symbol
  return str.trim().endsWith(currentLanguage === 'vi' ? 'đ' : '$');
};

/**
 * Parse a formatted currency string back to a number
 * @param str The currency string to parse
 * @returns A number value
 */
export const parseCurrencyToNumber = (str: string): number => {
  const numeric = parseNumericString(str);
  return numeric ? Number(numeric) : 0;
};
