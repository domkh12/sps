import { createSlice } from "@reduxjs/toolkit";

const parkingSlice = createSlice({
  name: "parking",
  initialState: {
    parking: {},
    labels: {},
    idParkingToDelete: "",
    isOpenQuickEditParkingSpace: false,
    parkingSpaceToEdit: {},
    searchParkingSpace: "",
    branchFilter: [],
    pageNo: 1,
    pageSize: 5,
    idParkingSpaceToDelete: "",
  },
  reducers: {
    setIdParkingSpaceToDelete: (state, action) => {
      state.idParkingSpaceToDelete = action.payload;
    },
    setParking: (state, action) => {
      state.parking = action.payload;
    },
    setLabels: (state, action) => {
      state.labels = action.payload;
    },
    setIdParkingToDelete: (state, action) => {
      state.idParkingToDelete = action.payload;
    },
    clearParking: (state, action) => {
      state.parking = {};
    },
    setIsOpenQuickEditParkingSpace: (state, action) => {
      state.isOpenQuickEditParkingSpace = action.payload;
    },
    setParkingSpaceToEdit: (state, action) => {
      state.parkingSpaceToEdit = action.payload;
    },
    setSearchParkingSpace: (state, action) => {
      state.searchParkingSpace = action.payload;
    },
    setParkingFromWB: (state, action) => {
      state.parking = { ...state.parking, ...action.payload };
    },
    setClearParkingFilter: (state, action) => {
      state.searchParkingSpace = "";
      state.branchFilter = [];
    },
    setPageNoParking: (state, action) => {
      state.pageNo = action.payload;
    },
    setPageSizeParking: (state, action) => {
      state.pageSize = action.payload;
    },
    setBranchFilterParking: (state, action) => {
      state.branchFilter = action.payload;
    },
  },
});

export const {
  setIdParkingSpaceToDelete,
  setPageSizeParking,
  setPageNoParking,
  setClearParkingFilter,
  setParking,
  setLabels,
  setIdParkingToDelete,
  clearParking,
  setIsOpenQuickEditParkingSpace,
  setParkingSpaceToEdit,
  setSearchParkingSpace,
  setParkingFromWB,
  setBranchFilterParking,
} = parkingSlice.actions;

export default parkingSlice.reducer;
