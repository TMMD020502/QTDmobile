import { User } from './types/user';

export enum ApiEndpoints {
  GET_USER_PROFILE = '/customers/profile',
  UPLOAD_IMAGE = '/documents/upload',
  CREATE_PRODUCT = '/products/create',
}

export interface EndpointTypes {
  [ApiEndpoints.GET_USER_PROFILE]: User;
  [ApiEndpoints.UPLOAD_IMAGE]: { url: string };
  [ApiEndpoints.CREATE_PRODUCT]: { id: string };
}

export type EndpointKeys = keyof typeof ApiEndpoints;
export default ApiEndpoints;
