import axiosInstance, {ApiResponse} from '../axiosInstance';
import {ApiEndpoints} from '../endpoints';
import {UploadFile, UploadResponse, UploadErrorCode} from '../types/upload';

export class UploadError extends Error {
  constructor(message: string, public code?: number) {
    super(message);
    this.name = 'UploadError';
  }
}

export const uploadImage = async (
  file: UploadFile,
): Promise<UploadResponse> => {
  try {
    if (!file?.fileName) {
      throw new UploadError('File không hợp lệ');
    }

    const formData = new FormData();
    formData.append('file', {
      uri: file.uri,
      type: file.type,
      name: file.fileName,
    } as any);

    const response = await axiosInstance.post<ApiResponse<UploadResponse>>(
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
  } catch (error: any) {
    console.error('Upload image error:', {error});

    if (error.response) {
      switch (error.response.status) {
        case UploadErrorCode.FILE_TOO_LARGE:
          throw new UploadError(
            'Kích thước file quá lớn',
            UploadErrorCode.FILE_TOO_LARGE,
          );
        case UploadErrorCode.UNSUPPORTED_FORMAT:
          throw new UploadError(
            'Định dạng file không được hỗ trợ',
            UploadErrorCode.UNSUPPORTED_FORMAT,
          );
        default:
          throw new UploadError(
            `Lỗi upload: ${error.response.data?.message || 'Vui lòng thử lại'}`,
            error.response.status,
          );
      }
    }

    if (error.request) {
      throw new UploadError('Không thể kết nối đến server');
    }

    throw new UploadError(error.message || 'Có lỗi xảy ra khi upload ảnh');
  }
};
