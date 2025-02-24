import { createSlice } from "@reduxjs/toolkit";

const parkingDetailSlice = createSlice({
  name: "parkingDetail",
  initialState: {
    parkingLotDetail : {}
  },
  reducers: {
    setParkingLotDetail: (state, action) => {
      state.parkingLotDetail = action.payload;
    }
  },
});

export const { setParkingLotDetail } = parkingDetailSlice.actions;

export default parkingDetailSlice.reducer;
