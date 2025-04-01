import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface User {
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

interface UserState {
  userData: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  userData: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserData: (state, action: PayloadAction<User>) => {
      state.userData = action.payload;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearUser: state => {
      state.userData = null;
      state.loading = false;
      state.error = null;
    },
  },
});

export const {setUserData, setLoading, setError, clearUser} = userSlice.actions;
export default userSlice.reducer;
