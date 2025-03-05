import { createSlice } from "@reduxjs/toolkit";

const siteSlice = createSlice({
  name: "sites",

  // initial data
  initialState: {
    pageNo: 1,
    pageSize: 5,
    changedSite: false,
    sites: [],
    sitesForChange: [{}],
    isQuickEditBranchOpen: false,
    branchForQuickEdit: {},
    branchTypeFilter: [],
    searchKeywords: "",
    isSiteToDelete: "",
  },

  // function
  reducers: {
    setIdSiteToDelete: (state, action) => {
      state.isSiteToDelete = action.payload;
    },
    setPageSizeBranch: (state, action) => {
      state.pageSize = action.payload;
    },
    setPageNoBranch: (state, action) => {
      state.pageNo = action.payload;
    },
    setSites: (state, action) => {
      state.sites = action.payload;
    },
    setChangedSite: (state, action) => {
      state.changedSite = !state.changedSite;
    },
    setSitesForChange: (state, action) => {
      state.sitesForChange = action.payload;
    },
    setIsQuickEditBranchOpen: (state, action) => {
      state.isQuickEditBranchOpen = action.payload;
    },
    setBranchForQuickEdit: (state, action) => {
      state.branchForQuickEdit = action.payload;
    },
    setBranchTypeFilter: (state, action) => {
      state.branchTypeFilter = action.payload;
    },
    setSearchKeywords: (state, action) => {
      state.searchKeywords = action.payload;
    },
    setClearBranchFilter: (state, action) => {
      state.searchKeywords = "";
      state.branchTypeFilter = [];
    },
  },
});

export const {
  setIdSiteToDelete,
  setPageNoBranch,
  setPageSizeBranch,
  setSites,
  setChangedSite,
  setSitesForChange,
  setIsQuickEditBranchOpen,
  setBranchForQuickEdit,
  setBranchTypeFilter,
  setSearchKeywords,
  setClearBranchFilter,
} = siteSlice.actions;

export default siteSlice.reducer;
