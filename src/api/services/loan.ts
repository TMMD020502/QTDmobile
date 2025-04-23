import axiosInstance from '../axiosInstance';
import {
  CreateFinancialInfoRequest,
  FinancialInfoResponse,
} from '../types/financialInfo';
import {
  LoanWorkflowResponse,
  UserInit,
  CancelLoanResponse,
  InterestRate,
} from '../types/loanInit';
import {LoanRequest, LoanWorkflowResponseS} from '../types/loanworkflowtypes';
import {CreateLoanPlanRequest, LoanPlanResponse} from '../types/loanPlan';
import {Asset, AddAssetsResponse, AssetApiError} from '../types/addAssets';
import {CreditRatingRequest, CreditRatingResponse} from '../types/creditRating';
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
  applicationId: string,
): Promise<LoanWorkflowResponse> => {
  await new Promise(resolve => setTimeout(resolve, 500)); // Add 5s delay
  const response = await axiosInstance.get(
    `/onboarding-workflows/${applicationId}`,
  );
  return response.data;
};

export const fetchInterestRates = async (): Promise<InterestRate[]> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500)); // Add 5s delay
    const response = await axiosInstance.get(
      `/settings/interest-rate-settings?filter=type:'LOAN'`,
    );
    return response.data.result.content || [];
  } catch (error) {
    console.error('Error fetching interest rates:', error);
    return []; // Return empty array instead of undefined
  }
};

//Create loan request
export const loanRequest = async (
  applicationId: string,
  loanData: Omit<LoanRequest, 'application'>,
): Promise<LoanWorkflowResponse> => {
  try {
    const requestBody: LoanRequest = {
      ...loanData,
      application: {
        id: applicationId,
      },
    };
    console.log('APPLICATIONID' + applicationId);
    console.log('Request body:', JSON.stringify(requestBody, null, 2));

    const response = await axiosInstance.post(
      `/loan-requests?applicationId=${applicationId}`,
      requestBody,
    );
    console.log('Loan request successful:', response.data);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      // Handle server errors (4xx, 5xx)
      console.error(
        'Server error:',
        JSON.stringify(error.response.status),
        JSON.stringify(error.response.data),
      );
      return error.response.data;
    } else if (error.request) {
      // Handle network errors
      console.error('Network error:', JSON.stringify(error.request));
    } else {
      // Handle other errors
      console.error(
        'Error creating loan request:',
        JSON.stringify(error.message),
      );
    }
  }
  // Return error response
  return {
    code: 'ERROR',
    message: 'Lỗi kết nối hoặc lỗi không xác định',
    result: {
      id: '',
      status: 'failed',
    },
  } as unknown as LoanWorkflowResponse;
};

export const updateLoanRequest = async (
  applicationId: string,
  loanData: Omit<LoanRequest, 'application'>, // Không cần applicationId
  transactionId: string,
): Promise<LoanWorkflowResponse> => {
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

  try {
    const response = await axiosInstance.put(
      `/loan-requests/${transactionId}`,
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
  } as unknown as LoanWorkflowResponse;
};

export const getworkflowbyapplicationid = async <T>(
  applicationId: string,
): Promise<LoanWorkflowResponseS<T>> => {
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
  } as unknown as LoanWorkflowResponseS<T>;
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
  return response.data;
};
//Update_loan_plan
export const updateLoanPlan = async (
  applicationId: string,
  loanPlanData: Omit<CreateLoanPlanRequest, 'application'>,
  transactionId: string,
): Promise<LoanPlanResponse> => {
  const requestBody: CreateLoanPlanRequest = {
    ...loanPlanData,
    application: {
      id: applicationId,
    },
  };
  console.log('APPLICATIONID ' + applicationId);
  const response = await axiosInstance.put(
    `/loan-plans/${transactionId}`,
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
  return response.data;
};
export const updateFinancialInfo = async (
  applicationId: string,
  loanPlanData: Omit<CreateFinancialInfoRequest, 'application'>,
  transactionId: string,
): Promise<LoanPlanResponse> => {
  const requestBody: CreateFinancialInfoRequest = {
    ...loanPlanData,
    application: {
      id: applicationId,
    },
  };

  const response = await axiosInstance.put(
    `/financial-infos/${transactionId}`,
    requestBody,
  );
  return response.data;
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
    console.log(
      'Assets with application: ',
      JSON.stringify(assetsWithApplication, null, 2),
    );
    const response = await axiosInstance.post(
      `/assets?applicationId=${applicationId}`,
      assetsWithApplication,
    );
    return response.data;
  } catch (error: unknown) {
    const assetError = error as AssetApiError;
    if (assetError.isAxiosError && assetError.response) {
      console.error(
        'Asset creation failed:',
        JSON.stringify(assetError.response, null, 2),
      );
    } else {
      console.error('Unknown error:', JSON.stringify(error, null, 2));
    }
    throw {
      message: assetError.response?.data.message,
      code: assetError.response?.data.code,
    };
  }
};

//update assets
export const updateAssetCollateral = async (
  applicationId: string,
  assets: Asset | Asset[],
  transactionId: string,
): Promise<AddAssetsResponse> => {
  try {
    const data = Array.isArray(assets) ? assets : [assets];
    const assetsWithApplication = data.map(asset => ({
      ...asset,
      application: {id: applicationId},
    }));
    console.log(
      'Assets update with application: ',
      JSON.stringify(assetsWithApplication, null, 2),
    );
    const response = await axiosInstance.put(
      `/assets/${transactionId}`,
      assetsWithApplication,
    );
    return response.data;
  } catch (error: unknown) {
    const assetError = error as AssetApiError;
    if (assetError.isAxiosError && assetError.response) {
      console.error(
        'Asset update failed:',
        JSON.stringify(assetError.response, null, 2),
      );
    } else {
      console.error('Unknown error:', JSON.stringify(error, null, 2));
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
