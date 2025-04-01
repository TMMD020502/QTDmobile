export interface User {
  address: {
    cityProvince: string;
    country: string;
    detail: string | null;
    district: string;
    streetAddress: string;
    wardOrCommune: string;
  };
  code: number | null;
  createdAt: string;
  createdBy: string;
  deleted: boolean;
  email: string;
  enabled: boolean;
  firstName: string;
  id: string;
  identityInfo: {
    backPhotoUrl: string;
    dateOfBirth: string;
    ethnicity: string;
    expirationDate: string;
    frontPhotoUrl: string;
    fullName: string;
    gender: string;
    identifyId: string;
    issueDate: string;
    issuingAuthority: string;
    legalDocType: string;
    nationality: string;
    passPortType: string | null;
    permanentAddress: string;
    placeOfBirth: string;
    religion: string;
  };
  lastModifiedBy: string;
  lastName: string;
  phone: string;
  signaturePhoto: string;
  updatedAt: string;
  username: string;
}


