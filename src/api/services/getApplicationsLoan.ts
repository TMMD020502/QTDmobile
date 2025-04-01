import axiosInstance from '../axiosInstance';
import {
  ApprovalProcess,
  ApprovalProcessListResponse,
} from '../types/approvalProcess';
import {
  Application,
  ApplicationsListResponse,
  ApiResponse,
} from '../types/getApplications';

export const getApplication = async (
  customerId: string,
): Promise<Application | undefined> => {
  try {
    const response = await axiosInstance.get<
      ApiResponse<ApplicationsListResponse>>(`/applications?filter=customer.id:'${customerId}' and status:'CREATING'`);

    return response.data.result.content[0];
  } catch (error) {
    console.log('Error fetching application:', (error as any).response);
    return undefined;
  }
};

export const getApplications = async (
  customerId: string,
): Promise<Application[] | undefined> => {
  try {
    const response = await axiosInstance.get<ApiResponse<ApplicationsListResponse>>(`/applications?filter=customer.id:'${customerId}'`);

    return response.data.result.content;
  } catch (error) {
    console.error('Error fetching applications:', error);
    return undefined;
  }
};

export const getApprovalProcess = async (
  applicationId: string,
): Promise<ApprovalProcess[] | undefined> => {
  // Changed return type to array
  try {
    const response = await axiosInstance.get<
      ApiResponse<ApprovalProcessListResponse>
    >(`/approval-process?filter=application.id:'${applicationId}'`);

    return response.data.result.content; // Return the full array
  } catch (error) {
    console.log('Error fetching application:', (error as any).response);
    return undefined;
  }
};
