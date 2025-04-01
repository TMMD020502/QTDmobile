export type StepType = 'ACTION' | 'DEFAULT';
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
export interface UserInit {
  userId: string | undefined;
}

export interface LoanWorkflowResponse {
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
  workflowStatus: WorkflowStatus;
  startTime: string;
  endTime: string;
  metadata: WorkflowMetadata;
  steps: StepHistoryResponse[];
  deleted: boolean;
}

interface WorkflowMetadata {
  histories: History[];
  [key: string]: any;
}

export interface StepHistoryResponse {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  nextSteps: string[];
  status: WorkflowStatus;
  type: StepType;
  transactionId: string;
  metadata: StepMetadata;
}
export interface StepMetadata {
  histories: History[];
  [key: string]: any;
}

export interface WorkflowStep {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  nextSteps: string[];
  status: 'COMPLETED' | 'PENDING' | 'FAILED';
  type: 'DEFAULT' | string;
  transactionId: string | null;
  metadata: StepMetadata;
}

export interface StepMetadata {
  histories: History[];
}

export interface History {
  action: string;
  request: {
    ip: string;
    time: number;
    user: string;
    endpoint: string;
    customerId: string;
  };
  response: {
    applicationResponse: LoanApplication;
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
  createdAt: number;
  createdBy: string;
  startDate: string | null;
  updatedAt: number;
  amountPaid: number | null;
  interestRate: number | null;
  lastModifiedBy: string;
  loanProcessors: any[];
  currentOutstandingDebt: number | null;
}

export interface CancelLoanResponse {
  code: number;
  message: string;
  result: {
    applicationId?: string;
    [key: string]: any;
  };
}
