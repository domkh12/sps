import { createSlice } from "@reduxjs/toolkit";

const siteTypeSlice = createSlice({
  name: "siteType",
  initialState: {
    siteTypeData: [{}],
    isQuickEditBranchTypeOpen: false,
    uuidForQuickEditBranchType: "",
    uuidForDeleteBranchType: "",
    isOpenQuickCreateBranchType: false,
  },
  reducers: {
    setIsOpenQuickCreateBranchType(state, action) {
      state.isOpenQuickCreateBranchType = action.payload;
    },
    setUuidForDeleteBranchType(state, action) {
      state.uuidForDeleteBranchType = action.payload;
    },
    setUuidForQuickEditBranchType(state, action) {
      state.uuidForQuickEditBranchType = action.payload;
    },
    setIsOpenQuickEditBranchType(state, action) {
      state.isQuickEditBranchTypeOpen = action.payload;
    },
    setSiteTypeData(state, action) {
      state.siteTypeData = action.payload;
    },
  },
});

export const { 
  setIsOpenQuickCreateBranchType,
  setUuidForDeleteBranchType,
  setUuidForQuickEditBranchType,
  setIsOpenQuickEditBranchType,
  setSiteTypeData
 } = siteTypeSlice.actions;

export default siteTypeSlice.reducer;
