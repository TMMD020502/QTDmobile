export interface LoanPlanMetadata {
  [key: string]: string | number | boolean;
}

export interface LoanPlanApplication {
  id: string;
}

export interface CreateLoanPlanRequest {
  totalCapitalRequirement: number;
  ownCapital: number;
  proposedLoanAmount: number;
  monthlyIncome: number;
  repaymentPlan: string;
  note: string;
  loanTerm: number;
  interestRate: number | undefined;
  metadata: LoanPlanMetadata;
  application: LoanPlanApplication;
}

interface Approver {
  id: string;
  userId: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  roles: string[];
}

interface Approval {
  id: string;
  comment: string | null;
  status: string;
  approver: Approver;
}

interface RoleApproval {
  role: string;
  requiredCount: number;
  currentApprovals: Approval[];
  status: string;
}

interface LoanPlanMetadataResponse extends CreateLoanPlanRequest {
  loanNeeds: string;
  assignees: null;
}

interface LoanPlanResult {
  id: string;
  createdAt: string;
  updatedAt: string;
  lastModifiedBy: string;
  createdBy: string;
  status: string;
  type: string;
  referenceId: null;
  approvedAt: null;
  approvals: null;
  groupApprovals: any[];
  roleApprovals: RoleApproval[];
  metadata: LoanPlanMetadataResponse;
  application: LoanPlanApplication;
  deleted: boolean;
}

export interface LoanPlanResponse {
  code: number;
  message: string;
  result: LoanPlanResult;
}
