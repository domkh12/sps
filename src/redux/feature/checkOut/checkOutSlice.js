import { createSlice } from "@reduxjs/toolkit";

const checkOutSlice = createSlice({
  
  name: "checkOut",

  initialState: {
    pageNoCheckOut: 1,
    pageSizeCheckOut: 5,
    keywords: "",
    dateFrom: "",
    dateTo: "",
    isRefetchCheckOut: false,
  },

  reducers: {
    setIsRefetchCheckOut(state, action){
      state.isRefetchCheckOut = action.payload;
    },
    setDateToCheckOut(state, action){
      state.dateTo = action.payload;
    },
    setDateFromCheckOut(state, action){
      state.dateFrom = action.payload;
    },
    setKeywordsCheckOut(state, action){
      state.keywords = action.payload;
    },
    setPageNoCheckOut(state, action) {
      state.pageNoCheckOut = action.payload;
    },
    setPageSizeCheckOut(state, action) {
      state.pageSizeCheckOut = action.payload;
    },
  },
});

export const {
    setIsRefetchCheckOut,
    setDateFromCheckOut,
    setDateToCheckOut,
    setKeywordsCheckOut,
    setPageNoCheckOut,
    setPageSizeCheckOut,
} = checkOutSlice.actions;

export default checkOutSlice.reducer;
