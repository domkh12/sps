import { createSlice } from "@reduxjs/toolkit";

const actionSlice = createSlice({
  name: "action",
  initialState: {
    isCollapsed: false,
  },
  reducers: {
    toggleCollapsed(state, action) {
      state.isCollapsed = !state.isCollapsed;
    },
  },
});

export const { toggleCollapsed } = actionSlice.actions;
export default actionSlice.reducer;
