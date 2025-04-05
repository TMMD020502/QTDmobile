import axiosInstance from '../axiosInstance';
import {
  CreateFinancialInfoRequest,
  FinancialInfoResponse,
} from '../types/financialInfo';
import {
  LoanWorkflowResponse,
  UserInit,
  CancelLoanResponse,
} from '../types/loanInit';
import {LoanRequest, LoanWorkflowResponseS} from '../types/loanworkflowtypes';
import {CreateLoanPlanRequest, LoanPlanResponse} from '../types/loanPlan';
import {Asset, AddAssetsResponse, AssetApiError} from '../types/addAssets';
import {CreditRatingRequest, CreditRatingResponse} from '../types/creditRating';
import {
  saveAccessApprovalProcessId,
  getAccessApprovalProcessId,
  saveLoanPlanApprovalProcessId,
  getLoanPlanApprovalProcessId,
  saveFinancialInfoApprovalProcessId,
  getFinancialInfoApprovalProcessId,
  getDocumentIds,
} from '../../../tokenStorage';
import {UploadResponse} from '../types/upload';
import {DocumentPickerResponse} from 'react-native-document-picker';
//Init Application
export const initLoan = async (
  params: UserInit,
): Promise<LoanWorkflowResponse> => {
  const response = await axiosInstance.post(
    `/applications?customerId=${params.userId}`,
    {
      userId: params.userId,
    },
  );
  return response.data;
};

export const fetchWorkflowStatus = async (
  userId: string,
): Promise<LoanWorkflowResponse> => {
  await new Promise(resolve => setTimeout(resolve, 500)); // Add 5s delay
  const response = await axiosInstance.get(`/onboarding-workflows/${userId}`);
  return response.data;
};

//Create loan request
export const loanRequest = async (
  applicationId: string,
  loanData: Omit<LoanRequest, 'application'>,
): Promise<LoanWorkflowResponse> => {
  const requestBody: LoanRequest = {
    ...loanData,
    application: {
      id: applicationId,
    },
  };
  console.log('APPLICATIONID' + applicationId);
  const response = await axiosInstance.post(
    `/loan-requests?applicationId=${applicationId}`,
    requestBody,
  );
  console.log('Create loan request trong' + response.data.result.id);
  await saveAccessApprovalProcessId(response.data.result.id);
  console.log('lưu AccessApprovalProcessId thành công');
  return response.data;
};

export const updateLoanRequest = async (
  applicationId: string,
  loanData: Omit<LoanRequest, 'application'>, // Không cần applicationId
): Promise<LoanWorkflowResponseS> => {
  // Loại bỏ asset trước khi tạo requestBody
  //const filteredLoanData = {...loanData};
  //delete (filteredLoanData as any).asset;
  const requestBody: LoanRequest = {
    //...filteredLoanData,
    ...loanData,
    application: {
      id: applicationId,
    },
  };
  console.log('APPLICATIONID' + applicationId);
  const loanRequestApprovalProcessId = await getAccessApprovalProcessId();

  console.log('test1', loanRequestApprovalProcessId);

  try {
    const response = await axiosInstance.put(
      `/loan-requests/${loanRequestApprovalProcessId}`,
      requestBody,
    );
    console.log('API Response:', response.data);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      // Lỗi từ phía server (4xx, 5xx)
      console.error(
        'Lỗi từ server:',
        error.response.status,
        error.response.data,
      );

      // Trả về một giá trị mặc định thay vì undefined
      return error.response.data;
    }
  }
  return {
    code: 'ERROR',
    message: 'Lỗi kết nối hoặc lỗi không xác định',
    result: {
      id: '',
      status: 'failed',
    },
  } as unknown as LoanWorkflowResponseS;
};

export const getworkflowbyapplicationid = async (
  applicationId: string,
): Promise<LoanWorkflowResponseS> => {
  // Loại bỏ asset trước khi tạo requestBody
  try {
    console.log('APPLICATIONID' + applicationId);
    const response = await axiosInstance.get(
      `/onboarding-workflows/${applicationId}`,
    );
    console.log('API Response:', response.data);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      // Lỗi từ phía server (4xx, 5xx)
      console.error(
        'Lỗi từ server:',
        error.response.status,
        error.response.data,
      );
      // Trả về một giá trị mặc định thay vì undefined
      return error.response.data;
    }
  }
  return {
    code: 'ERROR',
    message: 'Lỗi kết nối hoặc lỗi không xác định',
    result: {
      id: '',
      status: 'failed',
    },
  } as unknown as LoanWorkflowResponseS;
};
//Creat_loan_plan
export const loanPlan = async (
  applicationId: string,
  loanPlanData: Omit<CreateLoanPlanRequest, 'application'>,
): Promise<LoanPlanResponse> => {
  const requestBody: CreateLoanPlanRequest = {
    ...loanPlanData,
    application: {
      id: applicationId,
    },
  };

  const response = await axiosInstance.post(
    `/loan-plans?applicationId=${applicationId}`,
    requestBody,
  );
  await saveLoanPlanApprovalProcessId(response.data.result.id);
  console.log(await getLoanPlanApprovalProcessId());
  return response.data;
};
//Update_loan_plan
export const updateLoanPlan = async (
  applicationId: string,
  loanPlanData: Omit<CreateLoanPlanRequest, 'application'>,
): Promise<LoanPlanResponse> => {
  const requestBody: CreateLoanPlanRequest = {
    ...loanPlanData,
    application: {
      id: applicationId,
    },
  };
  console.log('APPLICATIONID' + applicationId);
  const LoanPlanApprovalProcessId = await getLoanPlanApprovalProcessId();
  const response = await axiosInstance.put(
    `/loan-plans/${LoanPlanApprovalProcessId}`,
    requestBody,
  );
  return response.data;
};
//Create-financial-info
export const financialInfo = async (
  applicationId: string,
  financialInfoData: Omit<CreateFinancialInfoRequest, 'application'>,
): Promise<FinancialInfoResponse> => {
  const requestBody: CreateFinancialInfoRequest = {
    ...financialInfoData,
    application: {
      id: applicationId,
    },
  };
  console.log('APPLICATIONID' + applicationId);
  console.log('Filtered JSON:', JSON.stringify(requestBody, null, 2));
  const response = await axiosInstance.post(
    `/financial-infos?applicationId=${applicationId}`,
    requestBody,
  );
  await saveFinancialInfoApprovalProcessId(response.data.result.id);
  return response.data;
};
export const updateFinancialInfo = async (
  applicationId: string,
  loanPlanData: Omit<CreateFinancialInfoRequest, 'application'>,
): Promise<LoanPlanResponse> => {
  const requestBody: CreateFinancialInfoRequest = {
    ...loanPlanData,
    application: {
      id: applicationId,
    },
  };
  console.log('APPLICATIONID' + applicationId);
  const financialinfoApprovalProcessId =
    await getFinancialInfoApprovalProcessId();

  const response = await axiosInstance.put(
    `/financial-infos/${financialinfoApprovalProcessId}`,
    requestBody,
  );
  return response.data;
};

export const getDocuments = async (): Promise<DocumentPickerResponse> => {
  // Loại bỏ asset trước khi tạo requestBody
  try {
    const documentIds = await getDocumentIds();
    console.log('Documenid' + documentIds);
    const response = await axiosInstance.get(`/documents/${documentIds}`);
    console.log('API Response documen:', response.data);
    return response.data.result;
  } catch (error: any) {
    if (error.response) {
      // Lỗi từ phía server (4xx, 5xx)
      console.error(
        'Lỗi từ server:',
        error.response.status,
        error.response.data,
      );
      // Trả về một giá trị mặc định thay vì undefined
      return error.response.data;
    }
  }
  return {
    code: 'ERROR',
    message: 'Lỗi kết nối hoặc lỗi không xác định',
    result: {
      id: '',
      status: 'failed',
    },
  } as unknown as DocumentPickerResponse;
};

//add assets
export const addAssetCollateral = async (
  applicationId: string,
  assets: Asset | Asset[],
): Promise<AddAssetsResponse> => {
  try {
    const data = Array.isArray(assets) ? assets : [assets];
    const assetsWithApplication = data.map(asset => ({
      ...asset,
      application: {id: applicationId},
    }));

    const response = await axiosInstance.post(
      `/assets?applicationId=${applicationId}`,
      assetsWithApplication,
    );
    return response.data;
  } catch (error: unknown) {
    const assetError = error as AssetApiError;
    if (assetError.isAxiosError && assetError.response) {
      console.log('Asset creation failed:', assetError.response);
    } else {
      console.log('Unknown error:', error);
    }
    throw {
      message: assetError.response?.data.message,
      code: assetError.response?.data.code,
    };
  }
};

export const createCreditRating = async (
  applicationId: string,
  ratingData: Omit<CreditRatingRequest, 'application'>,
): Promise<CreditRatingResponse> => {
  const requestBody: CreditRatingRequest = {
    ...ratingData,
    application: {
      id: applicationId,
    },
  };

  //Create_credit_rating
  const response = await axiosInstance.post(
    `/credit-ratings?applicationId=${applicationId}`,
    requestBody,
  );
  return response.data;
};

export const cancelLoan = async (
  applicationId: string,
): Promise<CancelLoanResponse> => {
  const response = await axiosInstance.post(
    `/applications/${applicationId}/cancel`,
  );
  return response.data;
};
