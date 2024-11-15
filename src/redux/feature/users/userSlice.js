import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "users",
  initialState: {
    uuid: "",
    status: "",
    pageNo: 1,
    pageSize: 30, 
    totalPages: 0
  },
  reducers: {
    setUuid: (state, action) => {
      state.uuid = action.payload;
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    },
    increasePageNo(state, action) {
      state.pageNo += 1;
    },
    decreasePageNo(state, action) {
      state.pageNo -= 1;
    },
    resetPageNo(state, action) {
      state.pageNo = 1;
    },
    lastPageNo(state, action){
      console.log(state.totalPages)
      state.pageNo = state.totalPages
    },
    setPageSize(state, action){
      state.pageSize = action.payload
    },
    setTotalPages(state, action){      
      state.totalPages = action.payload
    }
  },
});

export const {
  setUuid,
  setStatus,
  increasePageNo,
  decreasePageNo,
  resetPageNo,
  setPageSize,
  setTotalPages,
  lastPageNo
} = userSlice.actions;

export default userSlice.reducer;
