import { createSlice } from "@reduxjs/toolkit";
import { setClearBranchFilter } from "../site/siteSlice";

const citySlice = createSlice({
  name: "city",
  initialState: {
    cityData: [{}],
    cityFilter: []
  },
  reducers: {
    setCityData(state, action) {
      state.cityData = action.payload;
    },
    setCityFilter(state, action) {
      state.cityFilter = action.payload;
    }
  },
  extraReducers: (builder) => {
      builder.addCase(setClearBranchFilter, (state) => {
        state.cityFilter = [];
      });
    },
});

export const { setCityData, setCityFilter } = citySlice.actions;

export default citySlice.reducer;
