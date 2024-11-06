import { createSlice } from "@reduxjs/toolkit";

const actionSlice = createSlice({
  name: "action",
  initialState: {
    isCollapsed: false,
    isLoadingBar: false,
    isPaginationSuccess: false,
  },
  reducers: {
    toggleCollapsed(state, action) {
      state.isCollapsed = !state.isCollapsed;
    },
    setIsLoadingBar(state, action) {
      state.isLoadingBar = action.payload;
    },
    setIsPaginationSuccess(state, action) {
      state.isPaginationSuccess = action.payload;
    },
  },
});

export const { toggleCollapsed, setIsLoadingBar, setIsPaginationSuccess } =
  actionSlice.actions;
export default actionSlice.reducer;
