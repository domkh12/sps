import { createSlice } from "@reduxjs/toolkit";

const mapViewSlice = createSlice({
  name: "mapView",
  initialState: {
    isOpenDrawerDetail: false,
    isStatisticesDrawerOpen: false,
    selectFirstLabel : "",
    isSelectFirstLabel : true
  },
  reducers: {
    toggleDrawerDetail(state, action) {
      state.isOpenDrawerDetail = action.payload;
    },
    toggleStatisticesDrawer(state, action) {
      state.isStatisticesDrawerOpen = action.payload;
    },
    setSelectFirstLabel(state, action) {
      state.selectFirstLabel = action.payload;
    },
    setIsSelectFistLabel(state, action) {
      state.isSelectFirstLabel = action.payload;
    }
  },
});

export const {
  toggleDrawerDetail,
  toggleStatisticesDrawer,
  setSelectFirstLabel,
  setIsSelectFistLabel,
} = mapViewSlice.actions;

export default mapViewSlice.reducer;
