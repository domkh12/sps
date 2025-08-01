import { createSlice } from "@reduxjs/toolkit";

const checkInSlice = createSlice({

  name: "checkIn",

  initialState: {
    pageNoCheckIn: 1,
    pageSizeCheckIn: 5,
    keywords: "",
    dateFrom: "",
    dateTo: "",
    isRefetchCheckIn: false,
  },

  reducers: {
    setIsRefetchCheckIn(state, action){
      state.isRefetchCheckIn = action.payload;
    },
    setDateToCheckIn(state, action){
      state.dateTo = action.payload;
    },
    setDateFromCheckIn(state, action){
      state.dateFrom = action.payload;
    },
    setKeywordsCheckIn(state, action){
      state.keywords = action.payload;
    },
    setPageNoCheckIn(state, action) {
      state.pageNoCheckIn = action.payload;
    },
    setPageSizeCheckIn(state, action) {
      state.pageSizeCheckIn = action.payload;
    },
  },
});

export const {
    setIsRefetchCheckIn,
    setDateFromCheckIn,
    setDateToCheckIn,
    setKeywordsCheckIn,
    setPageNoCheckIn,
    setPageSizeCheckIn,
} = checkInSlice.actions;

export default checkInSlice.reducer;
