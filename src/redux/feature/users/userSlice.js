import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "users",
  initialState: {
    uuid: "",
    status: "",
    pageNo: 1,
    pageSize: 10,
    totalPages: 0,
    user: {},
    userActive: {},
    isLoadingUser: false,
  },
  reducers: {
    setIsLoadingUser(state, action) {
      state.isLoadingUser = action.payload;
    },
    setUuid: (state, action) => {
      state.uuid = action.payload;
    },
    setUserActive: (state, action) => {
      state.userActive = action.payload;
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
    lastPageNo(state, action) {
      console.log(state.totalPages);
      state.pageNo = state.totalPages;
    },
    setPageSize(state, action) {
      state.pageSize = action.payload;
    },
    setTotalPages(state, action) {
      state.totalPages = action.payload;
    },
    setUser(state, action) {
      state.user = action.payload;
    },
  },
});

export const {
  setIsLoadingUser,
  setUuid,
  setStatus,
  setUserActive,
  increasePageNo,
  decreasePageNo,
  resetPageNo,
  setPageSize,
  setTotalPages,
  lastPageNo,
  setUser,
} = userSlice.actions;

export default userSlice.reducer;
