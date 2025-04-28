import {Alert} from 'react-native';
import axiosInstance, {ApiResponse} from '../axiosInstance';
import {ApiEndpoints} from '../endpoints';
import {
  UploadFile,
  UploadResponse,
  UploadErrorCode,
  UploadRequest,
  UploadResponseResult,
} from '../types/upload';

import {AxiosError} from 'axios';
import {encode} from 'base64-arraybuffer';

export class UploadError extends Error {
  constructor(message: string, public code?: number) {
    super(message);
    this.name = 'UploadError';
  }
}

export const uploadImage = async (file: UploadFile): Promise<UploadRequest> => {
  try {
    if (!file?.fileName) {
      throw new UploadError('File không hợp lệ');
    }
    console.log('File 2 :', file);
    const formData = new FormData();
    formData.append('file', {
      uri: file.uri,
      type: file.type,
      name: file.fileName,
    } as any);
    formData.append('type', file.typeapi);
    console.log('FormData:' + JSON.stringify(file));
    const logFormData = (formData: FormData) => {
      console.log('🧾 FormData contents:');
      (formData as any)._parts?.forEach((part: any) => {
        console.log(`${part[0]}:`, part[1]);
      });
    };

    logFormData(formData);

    const response = await axiosInstance.post<ApiResponse<UploadRequest>>(
      ApiEndpoints.UPLOAD_IMAGE,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000,
      },
    );

    if (!response.data?.result) {
      throw new UploadError('Không nhận được đường dẫn ảnh từ server');
    }

    return response.data.result;
  } catch (error) {
    const axiosError = error as AxiosError<ApiResponse<UploadResponse>, any>;
    if (axiosError.response) {
      // Server responded with a status code outside the 2xx range
      console.error('🔴 Lỗi từ response server:', {
        status: axiosError.response.status,
        message: axiosError.response.data?.message || 'Unknown error',
        result: axiosError.response.data?.result || null,
      });

      const status = axiosError.response.status;
      switch (status) {
        case 413: // File too large
          Alert.alert('Error', 'Kích thước file quá lớn');
          throw new UploadError(
            'Kích thước file quá lớn',
            UploadErrorCode.FILE_TOO_LARGE,
          );
        case 415: // Unsupported format
          Alert.alert('Error', 'Định dạng file không được hỗ trợ');
          throw new UploadError(
            'Định dạng file không được hỗ trợ',
            UploadErrorCode.UNSUPPORTED_FORMAT,
          );
        default:
          Alert.alert(
            'Error',
            `Code: ${axiosError.response.status}\nMessage: ${
              axiosError.response.data?.message || 'Unknown error'
            }`,
          );
          throw new UploadError(
            `Lỗi upload: ${
              axiosError.response.data?.message || 'Vui lòng thử lại'
            }`,
            axiosError.response.status,
          );
      }
    } else if (axiosError.request) {
      // No response received from the server
      console.error('❌ Không có phản hồi từ server:', {
        request: axiosError.request, // Log the request object
        config: axiosError.config, // Log the request configuration
      });

      Alert.alert(
        'Network Error',
        'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng và thử lại.',
      );

      throw new UploadError('Không thể kết nối đến server');
    } else {
      // Other errors (e.g., client-side or unexpected issues)
      console.error('❌ Lỗi không xác định:', {
        message: axiosError.message,
        stack: axiosError.stack, // Log the error stack trace
      });

      Alert.alert(
        'Unknown Error',
        `Đã xảy ra lỗi không xác định: ${
          axiosError.message || 'Vui lòng thử lại'
        }`,
      );

      throw new UploadError(
        axiosError.message || 'Có lỗi xảy ra khi upload ảnh',
      );
    }
  }
};

export const getDocuments = async (
  documentIds: string[],
): Promise<ApiResponse<UploadResponseResult>[]> => {
  // Thay đổi return type
  console.log('duyệt qua ', documentIds);
  try {
    console.log('📄 Bắt đầu gọi tài liệu với các ID:', documentIds);

    if (!Array.isArray(documentIds) || documentIds.length === 0) {
      console.log('⚠️ Không có ID nào được cung cấp');
      return [];
    }

    const results: ApiResponse<UploadResponseResult>[] = []; // Thay đổi type của results

    for (const documentId of documentIds) {
      try {
        const response = await axiosInstance.get<ApiResponse<UploadResponseResult>>(
          `/documents/${documentId}`,
        );
        console.log(`✅ Đã lấy tài liệu ${documentId}:`, response.data);

        if (response.data) {
          results.push(response.data); // Thay đổi ở đây
        } else {
          console.warn(`⚠️ Tài liệu ${documentId} không có dữ liệu`);
        }
      } catch (error: any) {
        console.error(`❌ Lỗi khi gọi tài liệu ${documentId}:`, error.message);
        continue;
      }
    }

    console.log('📦 Tài liệu hợp lệ:', results);
    return results;
  } catch (error: any) {
    console.error('❌ Lỗi tổng quát trong getDocuments:', error);
    Alert.alert('Lỗi', error.message || 'Có lỗi xảy ra khi lấy tài liệu');
    return [];
  }
};

export const fetchImage = async (fileUri: string): Promise<string> => {
  try {
    // Loại bỏ phần "/api/v1" từ fileUri
    const sanitizedUri = fileUri.replace('/api/v1', '');
    console.log('Sanitized URI:', sanitizedUri);

    // Make the GET request
    const response = await axiosInstance.get(sanitizedUri, {
      responseType: 'arraybuffer',
      timeout: 30000, // Set a timeout for the request
    });
    console.log('2');

    // Convert the array buffer to Base64
    const base64Image = `data:image/jpeg;base64,${encode(response.data)}`;
    console.log('Fetched base64 image:', base64Image);

    return base64Image;
  } catch (error: any) {
    console.error('Error fetching image:', error);

    // Handle errors
    if (error.response) {
      console.error('🔴 Server error:', {
        status: error.response.status,
        message: error.response.data?.message || 'Unknown error',
      });

      Alert.alert(
        'Error',
        `Failed to fetch image. Code: ${error.response.status}\nMessage: ${
          error.response.data?.message || 'Unknown error'
        }`,
      );
    } else if (error.request) {
      console.error('❌ No response from server:', error.request);

      Alert.alert(
        'Network Error',
        'Could not connect to the server. Please check your network and try again.',
      );
    } else {
      console.error('❌ Unknown error:', error.message);

      Alert.alert(
        'Unknown Error',
        `An unknown error occurred: ${error.message || 'Please try again'}`,
      );
    }

    throw new Error('Failed to fetch image');
  }
};
