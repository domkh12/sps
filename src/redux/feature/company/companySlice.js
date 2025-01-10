import { createSlice } from "@reduxjs/toolkit";

const companySlice = createSlice({
  name: "companies",
  initialState: {
    companyNames: [{}],
    companiesData: [{}],
  },
  reducers: {
    setCompanyNames(state, action) {
      state.companyNames = action.payload;
    },
    setCompaniesData(state, action) {
      state.companiesData = action.payload;
    },
  },
});

export const { setCompanyNames, setCompaniesData } = companySlice.actions;

export default companySlice.reducer;
