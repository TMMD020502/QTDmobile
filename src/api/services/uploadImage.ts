import {Alert} from 'react-native';
import axiosInstance, {ApiResponse} from '../axiosInstance';
import {ApiEndpoints} from '../endpoints';
import {
  UploadFile,
  UploadResponse,
  UploadErrorCode,
  UploadRequest,
} from '../types/upload';
import i18n from '../../../i18n';
import {DocumentPickerResponse} from 'react-native-document-picker';
import {getFinanciaDocumentIds} from '../../../tokenStorage';
import {AxiosError} from 'axios';
import {encode} from 'base64-arraybuffer';
const currentLanguage = i18n.language;
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

export const getDocuments = async (): Promise<UploadResponse[]> => {
  try {
    // Lấy danh sách document IDs từ storage
    const documentIds = await getFinanciaDocumentIds();
    console.log('Document IDs:', documentIds);

    if (documentIds && documentIds.length > 0) {
      // Lặp qua từng documentId và gọi API riêng lẻ
      const documentPromises = documentIds.map(async documentId => {
        try {
          const response = await axiosInstance.get(`/documents/${documentId}`);
          console.log(
            `API Response for documentId ${documentId}:`,
            response.data,
          );
          console.log('Response for document' + response.data.result.url);
          return response.data;
        } catch (error: any) {
          console.error(`Lỗi khi gọi API cho documentId ${documentId}:`, error);
          return null; // Trả về null nếu có lỗi cho documentId này
        }
      });

      // Chờ tất cả các yêu cầu hoàn thành
      const documents = await Promise.all(documentPromises);

      // Lọc ra các kết quả hợp lệ (loại bỏ null)
      const validDocuments = documents.filter(doc => doc !== null);

      if (validDocuments.length === 0) {
        throw new Error('Không nhận được tài liệu hợp lệ từ server');
      }

      return validDocuments as UploadResponse[];
    }

    // Return an empty array if documentIds is empty or undefined
    return [];
  } catch (error: any) {
    if (error.response) {
      // Xử lý lỗi từ phía server (4xx, 5xx)
      console.error(
        'Lỗi từ server:',
        error.response.status,
        error.response.data,
      );

      // Hiển thị thông báo lỗi cho người dùng
      Alert.alert(
        'Lỗi',
        `Không thể tải tài liệu: ${
          error.response.data?.message || 'Vui lòng thử lại'
        }`,
      );

      // Trả về giá trị mặc định
      return [];
    }

    if (error.message) {
      // Xử lý lỗi không liên quan đến server
      console.error('Lỗi:', error.message);
      Alert.alert('Lỗi', error.message);
    }

    // Trả về giá trị mặc định nếu có lỗi
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
