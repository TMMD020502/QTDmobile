import axiosInstance from '../axiosInstance';
import { ApiEndpoints } from '../endpoints';
import { User } from '../types/user';
import { ApiResponse } from '../axiosInstance';

export const getUserData = async (): Promise<User> => {
  try {
    const response = await axiosInstance.get<ApiResponse<User>>(
      ApiEndpoints.GET_USER_PROFILE
    );
    return response.data.result;
  } catch (error) {
    console.error('Error fetching user data:', (error as any).response);
    throw error;
  }
};
