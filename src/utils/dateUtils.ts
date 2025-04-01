export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

export const parseDate = (dateString: string): Date => {
  if (!dateString) return new Date();
  return new Date(dateString);
};
