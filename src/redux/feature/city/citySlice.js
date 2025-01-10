import { createSlice } from "@reduxjs/toolkit";

const citySlice = createSlice({
  name: "city",
  initialState: {
    cityData: [{}],
  },
  reducers: {
    setCityData(state, action) {
      state.cityData = action.payload;
    },
  },
});

export const { setCityData } = citySlice.actions;

export default citySlice.reducer;
