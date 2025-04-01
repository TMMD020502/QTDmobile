/**
 * Format a number as currency (VND)
 * @param amount Amount to format
 * @returns Formatted amount string
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .format(amount)
    .replace('₫', 'đ');
};
