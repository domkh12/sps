import { createSlice } from "@reduxjs/toolkit";
import { setClearBranchFilter } from "../site/siteSlice";

const companySlice = createSlice({
  name: "companies",
  initialState: {
    companyNames: [{}],
    companiesData: [{}],
    companyFilter: [],
    idCompanyToDelete: "",
    isQuickEditCompanyOpen: false,
    companyDataForQuickEdit: {},
    pageNo: 1,
    pageSize: 5,
    companySearchKeywords: ""
  },
  reducers: {
    setCompanySearchKeywords(state, action) {
        state.companySearchKeywords = action.payload;
    },
    setPageNoCompany(state, action) {
        state.pageNo = action.payload;
    },
    setPageSizeCompany(state, action) {
        state.pageSize = action.payload;
    },
    setCompanyDataForQuickEdit(state, action) {
        state.companyDataForQuickEdit = action.payload;
    },
    setIsQuickEditCompanyOpen(state, action) {
      state.isQuickEditCompanyOpen = action.payload;
    },
    setIdCompanyToDelete(state, action) {
      state.idCompanyToDelete = action.payload;
    },
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
  setCompanySearchKeywords,
  setPageNoCompany,
  setPageSizeCompany,
  setCompanyDataForQuickEdit,
  setIsQuickEditCompanyOpen,
  setIdCompanyToDelete,
  setCompanyNames,
  setCompaniesData,
  setCompanyFilter,
  setClearCompanyFilter,
} = companySlice.actions;

export default companySlice.reducer;
