export type BorrowerType = 'INDIVIDUAL' | 'ORGANIZATION';
export type LoanSecurityType = 'MORTGAGE' | 'UNSECURED' | 'PLEDGE' | 'NONE';
export type LoanCollateralType = 'VEHICLE' | 'LAND' | 'APARTMENT' | 'OTHER';

export interface LoanRequestBody {
  purpose: string;
  amount: number;
  borrowerType: BorrowerType;
  asset: string;
  loanSecurityType: LoanSecurityType;
  loanCollateralTypes: LoanCollateralType[];
  note: string;
  metadata?: Record<string, string>;
  application: {
    id: string;
  };
}
