export interface Application {
  id: string;
  createdAt: string;
  updatedAt: string;
  lastModifiedBy: string;
  createdBy: string;
  amount: number | null;
  loanProcessors: any[];
  startDate: string | null;
  loanSecurityType: string | null;
  status: 'CREATING' | 'SIGNED' | 'CANCEL';
  dueDate: string | null;
  interestRate: number | null;
  loanTerm: number | null;
  amountPaid: number | null;
  currentOutstandingDebt: number | null;
  customer: {
    id: string;
  };
  purpose: string | null;
  borrowerType: string | null;
  metadata: any | null;
  deleted: boolean;
}

export interface ApplicationsListResponse {
  content: Application[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  sorts: any[];
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  result: T;
}
