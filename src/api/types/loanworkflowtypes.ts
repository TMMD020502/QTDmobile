export type StepType = 'ACTION' | 'APPROVAL';
export type WorkflowStatus =
  | 'INPROGRESS'
  | 'DENIED'
  | 'COMPLETED'
  | 'CANCELLED';
export type StepName =
  | 'init'
  | 'create-loan-request'
  | 'add-asset-collateral'
  | 'create-loan-plan'
  | 'create-financial-info'
  | 'create-credit-rating';

export interface LoanWorkflowResponseS {
  code: number;
  message: string;
  result: WorkflowResult;
}

export interface WorkflowResult {
  id: string;
  createdAt: string | null;
  updatedAt: string | null;
  lastModifiedBy: string;
  createdBy: string;
  targetId: string;
  prevSteps: StepName[];
  currentSteps: StepName[];
  nextSteps: StepName[];
  status: WorkflowStatus;
  startTime: string;
  endTime: string | null;
  metadata: WorkflowMetadata | null;
  steps: StepHistoryResponse[];
  deleted: boolean;
}

export interface WorkflowMetadata {
  histories: History[];
  [key: string]: any;
}

export interface StepHistoryResponse {
  id: string;
  name: StepName;
  startTime: string;
  endTime: string | null;
  nextSteps: StepName[];
  status: WorkflowStatus;
  type: StepType;
  transactionId: string | null;
  metadata: StepMetadata;
}

export interface StepMetadata {
  histories: History[];
  [key: string]: any;
}

export interface History {
  action: string;
  request: HistoryRequest;
  response: HistoryResponse;
}

export interface HistoryRequest {
  ip: string;
  time: string;
  user: string;
  endpoint: string;
  applicationId?: string;
  loanRequestRequest?: LoanRequest;
}

export interface HistoryResponse {
  approvalProcessResponse?: ApprovalProcessResponse;
  applicationResponse?: LoanApplication;
}

export type BorrowerType = 'INDIVIDUAL' | 'ORGANIZATION';
export type LoanSecurityType = 'MORTGAGE' | 'UNSECURED' | 'PLEDGE' | 'NONE';
export type LoanCollateralType = 'VEHICLE' | 'LAND' | 'APARTMENT' | 'OTHER';
export interface LoanRequest {
  purpose: string;
  amount: number;
  borrowerType: BorrowerType;
  loanSecurityType: LoanSecurityType;
  loanCollateralTypes: LoanCollateralType[];
  note: string;
  metadata?: Record<string, string>;
  application: {
    id: string;
  };
}

export interface ApprovalProcessResponse {
  id: string;
  type: string;
  status: string;
  deleted: boolean;
  metadata: LoanResponse;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  approvedAt: string | null;
  application: {
    id: string;
  };
  referenceIds: string[] | null;
  lastModifiedBy: string;
}

export interface LoanResponse {
  purpose: string;
  amount: number;
  borrowerType: BorrowerType;
  loanSecurityType: LoanSecurityType;
  loanCollateralTypes: LoanCollateralType[];
  note: string;
  metadata?: Record<string, string>;
  application: {
    id: string;
  };
}
export interface LoanApplication {
  id: string;
  amount: number | null;
  deleted: boolean;
  dueDate: string | null;
  customer: {
    id: string;
  };
  createdAt: string;
  createdBy: string;
  startDate: string | null;
  updatedAt: string;
  amountPaid: number | null;
  interestRate: number | null;
  lastModifiedBy: string;
  loanProcessors: any[];
  currentOutstandingDebt: number | null;
}
