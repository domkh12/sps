import { createSlice } from "@reduxjs/toolkit";
import { setClearBranchFilter } from "../site/siteSlice";

const citySlice = createSlice({
  name: "city",
  initialState: {
    cityData: [{}],
    cityFilter: [],
    isOpenQuickEditCity: false,
    uuidForQuickEditCity: "",
    uuidCityForDelete: "",
    isOpenQuickCreateCity: false
  },
  reducers: {
    setIsOpenQuickCreateCity(state, action){
        state.isOpenQuickCreateCity = action.payload;
    },
    setUuidCityForDelete(state, action) {
        state.uuidCityForDelete = action.payload;
    },
    setUuidForQuickEditCity(state, action) {
      state.uuidForQuickEditCity = action.payload;
    },
    setIsOpenQuickEditCity(state, action) {
      state.isOpenQuickEditCity = action.payload;
    },
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

export const {
  setIsOpenQuickCreateCity,
  setUuidCityForDelete,
  setUuidForQuickEditCity,
  setIsOpenQuickEditCity, setCityData,
  setCityFilter
} = citySlice.actions;

export default citySlice.reducer;
