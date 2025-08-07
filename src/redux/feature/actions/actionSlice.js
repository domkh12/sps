import { createSlice } from "@reduxjs/toolkit";

const actionSlice = createSlice({
  name: "action",
  initialState: {
    isCollapsed: false,
    isLoadingBar: false,
    isPaginationSuccess: false,
    isScrolling: false,
    isLoadingSnackBar: false,
    captionSnackBar: "",
    isOpenSnackBar: false,
    isErrorSnackbar: false,
    isOpenConfirmDelete: false,
    isFiltered: false,
    isOpenDrawerProfiles: false,
    isOpenSidebarDrawer: false,
    isSettingDrawerOpen: false,
  },
  reducers: {
    setIsSettingDrawerOpen(state, action) {
      state.isSettingDrawerOpen = action.payload;
    },
    toggleCollapsed(state, action) {
      state.isCollapsed = !state.isCollapsed;
    },
    setIsLoadingBar(state, action) {
      state.isLoadingBar = action.payload;
    },
    setIsPaginationSuccess(state, action) {
      state.isPaginationSuccess = action.payload;
    },
    setIsScrolling(state, action) {
      state.isScrolling = action.payload;
    },
    setIsLoadingSnackBar(state, action) {
      state.isLoadingSnackBar = action.payload;
    },
    setCaptionSnackBar(state, action) {
      state.captionSnackBar = action.payload;
    },
    setIsOpenSnackBar(state, action) {
      state.isOpenSnackBar = action.payload;
    },
    setErrorSnackbar(state, action) {
      state.isErrorSnackbar = action.payload;
    },
    setIsOpenConfirmDelete(state, action) {
      state.isOpenConfirmDelete = action.payload;
    },
    setIsFiltered(state, action) {
      state.isFiltered = action.payload;
    },
    setIsOpenDrawerProfiles(state, action) {
      state.isOpenDrawerProfiles = action.payload;
    },
    setIsOpenSidebarDrawer(state, action) {
      state.isOpenSidebarDrawer = action.payload;
    },
  },
});

export const {
  setIsSettingDrawerOpen,
  setIsOpenSidebarDrawer,
  toggleCollapsed,
  setIsLoadingBar,
  setIsPaginationSuccess,
  setIsScrolling,
  setIsLoadingSnackBar,
  setCaptionSnackBar,
  setIsOpenSnackBar,
  setErrorSnackbar,
  setIsOpenConfirmDelete,
  setIsFiltered,
  setIsOpenDrawerProfiles,
} = actionSlice.actions;

export default actionSlice.reducer;
