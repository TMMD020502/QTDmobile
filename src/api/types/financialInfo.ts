interface FileData {
  uri: string;
  name: string | null;
  type: string;
}
export interface CreateFinancialInfoRequest {
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
  application: {
    id: string;
  };
}

export interface FinancialInfoResponse {
  code: number;
  success: boolean;
  message: string;
}
