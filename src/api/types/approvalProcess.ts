export interface ApprovalProcessMetadata {
  note?: string;
  amount?: number;
  purpose?: string;
  metadata?: Record<string, any>;
  application?: {
    id: string;
  };
  borrowerType?: string;
  loanSecurityType?: string;
  loanCollateralTypes?: string[];
  loanTerm?: number;
  assignees?: any;
  ownCapital?: number;
  interestRate?: number;
  monthlyIncome?: number;
  repaymentPlan?: string;
  proposedLoanAmount?: number;
  totalCapitalRequirement?: number;
  id?: null;
  files?: any[];
  jobTitle?: string;
  hasMarried?: boolean;
  companyName?: string;
  monthlyDebt?: number;
  totalIncome?: number;
  monthlySaving?: number;
  companyAddress?: string;
  monthlyExpense?: number;
  monthlyLoanPayment?: number;
}

export interface ApprovalProcess {
  id: string;
  createdAt: string;
  updatedAt: string;
  lastModifiedBy: string;
  createdBy: string;
  status: string;
  type: string;
  referenceIds: any;
  approvedAt: string | null;
  metadata: ApprovalProcessMetadata;
  application: {
    id: string;
  };
  deleted: boolean;
}

export interface ApprovalProcessListResponse {
  content: ApprovalProcess[]; // Changed from ApprovalProcess to ApprovalProcess[]
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  sorts: any[];
}
