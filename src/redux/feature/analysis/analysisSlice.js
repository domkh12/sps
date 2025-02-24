import { createSlice } from "@reduxjs/toolkit";

const analysisSlice = createSlice({
  name: "analysis",
  initialState: {
    totalCountAnalysis: {},
  },
  reducers: {
    setTotalCountAnalysis(state, action) {
      state.totalCountAnalysis = action.payload;
    },
  },
});

export const { setTotalCountAnalysis } = analysisSlice.actions;

export default analysisSlice.reducer;
