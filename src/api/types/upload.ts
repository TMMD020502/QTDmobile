export interface UploadFile {
  uri: string | undefined;
  type: string;
  fileName: string;
  typeapi: string;
}

export interface UploadRequest {
  url: string;
  id?: string;
  title?: string;
  type?: string;
}
export interface UploadResponse {
  code: number;
  message: string;
  result: UploadResponseResult;
}
export interface UploadResponseResult {
  url?: string;
  type?: string;
  title?: string;
  id?: string;
}
export enum UploadErrorCode {
  FILE_TOO_LARGE = 413,
  UNSUPPORTED_FORMAT = 415,
}
