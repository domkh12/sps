import { createSlice } from "@reduxjs/toolkit";

const clientInfoSlice = createSlice({
  name: "clientInfo",
  initialState: {
    pageNo: 1,
    pageSize: 5,
  },
  reducers: {
    setPageNoClientInfo(state, action) {
      state.pageNo = action.payload;
    },
    setPageSizeClientInfo(state, action) {
      state.pageSize = action.payload;
    },
  },
});

export const {
  setPageNoClientInfo,
  setPageSizeClientInfo,
} = clientInfoSlice.actions;

export default clientInfoSlice.reducer;
