import axiosInstance from '../axiosInstance';
import {
  NotificationResponse,
  NotificationItem,
} from '../types/getNotifications';

export const getNotifications = async (): Promise<
  NotificationItem[] | undefined
> => {
  try {
    const response = await axiosInstance.get<NotificationResponse>(
      '/employee-notifications/my-notifications',
    );

    return response.data.result.content;
  } catch (error: any) {
    console.error('Error fetching notification:', error);
    console.error('Error fetching notification:', error.response);
    return undefined;
  }
};
