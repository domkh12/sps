import { createSlice } from "@reduxjs/toolkit";
import { setClearBranchFilter } from "../site/siteSlice";

const companySlice = createSlice({
  name: "companies",
  initialState: {
    companyNames: [{}],
    companiesData: [{}],
    companyFilter: [],
  },
  reducers: {
    setCompanyNames(state, action) {
      state.companyNames = action.payload;
    },
    setCompaniesData(state, action) {
      state.companiesData = action.payload;
    },
    setCompanyFilter(state, action) {
      state.companyFilter = action.payload;
    },
    setClearCompanyFilter(state, action) {
      state.companyFilter = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(setClearBranchFilter, (state) => {
      state.companyFilter = [];
    });
  },
});

export const {
  setCompanyNames,
  setCompaniesData,
  setCompanyFilter,
  setClearCompanyFilter,
} = companySlice.actions;

export default companySlice.reducer;
