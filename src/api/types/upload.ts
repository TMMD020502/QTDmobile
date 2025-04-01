export interface UploadFile {
  uri: string | undefined;
  type: string;
  fileName: string;
}

export interface UploadResponse {
  url: string;
  id?: string;
}

export enum UploadErrorCode {
  FILE_TOO_LARGE = 413,
  UNSUPPORTED_FORMAT = 415,
}
