import {CreditRatingResponse} from './creditRating';

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

export interface LoanWorkflowResponseS<T, M = T | T[]> {
  code: number;
  message: string;
  result: WorkflowResult<M>[];
}

export interface WorkflowResult<T, M = T | T[]> {
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
  metadata: WorkflowMetadata<M> | null;
  steps: StepHistoryResponse<M>[];
  deleted: boolean;
}

export interface WorkflowMetadata<T> {
  histories: History<T>[];
  [key: string]: any;
}

export interface StepHistoryResponse<T, M = T | T[]> {
  id: string;
  name: StepName;
  startTime: string;
  endTime: string | null;
  nextSteps: StepName[];
  status: WorkflowStatus;
  type: StepType;
  transactionId: string | null;
  metadata: StepMetadata<M>;
}

export interface StepMetadata<T, M = T | T[]> {
  histories: History<M>;
  [key: string]: any;
}

export interface History<T, M = T | T[]> {
  error: string;
  action: string;
  request: HistoryRequest;
  response: HistoryResponse<M>;
}

export interface HistoryRequest {
  ip: string;
  time: string;
  user: string;
  endpoint: string;
  applicationId?: string;
  loanRequestRequest?: LoanRequest;
}

export interface HistoryResponse<T, M = T | T[]> {
  creditRatingResponse?: CreditRatingResponse;
  approvalProcessResponse?: ApprovalProcessResponse<M>;
  applicationResponse?: LoanApplication;
}

export type BorrowerType = 'INDIVIDUAL' | 'ORGANIZATION';
export type LoanSecurityType = 'MORTGAGE' | 'UNSECURED' | 'PLEDGE' | 'NONE';
export type LoanCollateralType = 'VEHICLE' | 'LAND' | 'APARTMENT' | 'OTHER';
export type InterestCalculationType = 'FIXED' | 'FLOATING';
export interface LoanRequest {
  purpose: string;
  amount: number;
  borrowerType: BorrowerType;
  loanSecurityType: LoanSecurityType;
  loanCollateralTypes: LoanCollateralType[];
  monthlyIncome: number;
  repaymentMethod: string;
  interestCalculationType: InterestCalculationType;
  note: string;
  loanTerm: number;
  interestRate: number | undefined;
  metadata?: Record<string, string>;
  application: {
    id: string;
  };
}
export interface ApprovalProcessResponse<T, M = T | T[]> {
  id: string;
  type: string;
  status: string;
  deleted: boolean;
  metadata: M;
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
  jobTitle: string;
  companyName: string;
  companyAddress: string;
  hasMarried: boolean;
  totalIncome: number;
  monthlyExpense: number;
  monthlySaving: number;
  monthlyDebt: number;
  monthlyLoanPayment: number;
  files: string[];

  totalCapitalRequirement: number;
  ownCapital: number;
  proposedLoanAmount: number;

  monthlyIncome: number;
  repaymentPlan: string;
  loanTerm: number;
  interestRate: number | undefined;
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
export interface CreateFinancialInfo {
  jobTitle: string;
  companyName: string;
  companyAddress: string;
  hasMarried: boolean;
  totalIncome: number;
  monthlyExpense: number;
  monthlySaving: number;
  monthlyDebt: number;
  monthlyLoanPayment: number;
  files: string[];
}
export interface CreateLoanResponse {
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
export interface CreateLoanPlan {
  monthlyIncome: number;
  repaymentPlan: string;
  loanTerm: number;
  interestRate: number | undefined;
  note: string;
}
export interface Apartment {
  assetType: string;
  title: string;
  ownershipType: string;
  proposedValue: number;
  documents: [];
  // application: {id: appId},
  ownerInfo: ownerInfo;
  transferInfo: transferInfo;
  apartment: apartment;
}
interface ownerInfo {
  fullName: string;
  dayOfBirth: string;
  idCardNumber: string;
  idIssueDate: string;
  idIssuePlace: string;
  permanentAddress: string;
}
interface transferInfo {
  fullName: string;
  dayOfBirth: string;
  idCardNumber: string;
  idIssueDate: string;
  idIssuePlace: string;
  permanentAddress: string;
  transferDate: string;
  transferRecordNumber: string;
}
interface apartment {
  plotNumber: string;
  mapNumber: string;
  address: string;
  area: number;
  purpose: string;
  name: string;
  floorArea: number;
  typeOfHousing: string;
  typeOfOwnership: string;
  ownershipTerm: string;
  notes: string;
  sharedFacilities: string;
  certificateNumber: string;
  certificateBookNumber: string;
  issuingAuthority: string;
  issueDate: string;
  expirationDate: string;
  originOfUsage: string;
  metadata: {
    parkingSpace: string;
    floor: number;
    view: string;
    renovationStatus: string;
  };
}
interface Vehicle {
  assetType: string;
  title: string;
  ownershipType: string;
  proposedValue: number;
  documents: [];
  // application: {id: appId},
  ownerInfo: {
    fullName: string;
    dayOfBirth: string;
    idCardNumber: string;
    idIssueDate: string;
    idIssuePlace: string;
    permanentAddress: string;
  };
  transferInfo: {
    fullName: string;
    dayOfBirth: string;
    idCardNumber: string;
    idIssueDate: string;
    idIssuePlace: string;
    permanentAddress: string;
    transferDate: string;
    transferRecordNumber: string;
  };
  apartment: {
    plotNumber: string;
    mapNumber: string;
    address: string;
    area: number;
    purpose: string;
    name: string;
    floorArea: number;
    typeOfHousing: string;
    typeOfOwnership: string;
    ownershipTerm: string;
    notes: string;
    sharedFacilities: string;
    certificateNumber: string;
    certificateBookNumber: string;
    issuingAuthority: string;
    issueDate: string;
    expirationDate: string;
    originOfUsage: string;
    metadata: {
      parkingSpace: string;
      floor: number;
      view: string;
      renovationStatus: string;
    };
  };
}

interface Land {
  assetType: string;
  title: string;
  ownershipType: string;
  proposedValue: number;
  documents: [];
  // application: {id: appId},
  ownerInfo: {
    fullName: string;
    dayOfBirth: string;
    idCardNumber: string;
    idIssueDate: string;
    idIssuePlace: string;
    permanentAddress: string;
  };
  transferInfo: {
    fullName: string;
    dayOfBirth: string;
    idCardNumber: string;
    idIssueDate: string;
    idIssuePlace: string;
    permanentAddress: string;
    transferDate: string;
    transferRecordNumber: string;
  };
  apartment: {
    plotNumber: string;
    mapNumber: string;
    address: string;
    area: number;
    purpose: string;
    name: string;
    floorArea: number;
    typeOfHousing: string;
    typeOfOwnership: string;
    ownershipTerm: string;
    notes: string;
    sharedFacilities: string;
    certificateNumber: string;
    certificateBookNumber: string;
    issuingAuthority: string;
    issueDate: string;
    expirationDate: string;
    originOfUsage: string;
    metadata: {
      parkingSpace: string;
      floor: number;
      view: string;
      renovationStatus: string;
    };
  };
}

interface Other {
  assetType: string;
  title: string;
  ownershipType: string;
  proposedValue: number;
  documents: [];
  // application: {id: appId},
  ownerInfo: {
    fullName: string;
    dayOfBirth: string;
    idCardNumber: string;
    idIssueDate: string;
    idIssuePlace: string;
    permanentAddress: string;
  };
  transferInfo: {
    fullName: string;
    dayOfBirth: string;
    idCardNumber: string;
    idIssueDate: string;
    idIssuePlace: string;
    permanentAddress: string;
    transferDate: string;
    transferRecordNumber: string;
  };
  apartment: {
    plotNumber: string;
    mapNumber: string;
    address: string;
    area: number;
    purpose: string;
    name: string;
    floorArea: number;
    typeOfHousing: string;
    typeOfOwnership: string;
    ownershipTerm: string;
    notes: string;
    sharedFacilities: string;
    certificateNumber: string;
    certificateBookNumber: string;
    issuingAuthority: string;
    issueDate: string;
    expirationDate: string;
    originOfUsage: string;
    metadata: {
      parkingSpace: string;
      floor: number;
      view: string;
      renovationStatus: string;
    };
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
