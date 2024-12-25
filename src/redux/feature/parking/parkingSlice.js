import { createSlice } from "@reduxjs/toolkit";

const parkingSlice = createSlice({
  name: "parking",
  initialState: {
    parking: {},
    labels: {},
  },
  reducers: {
    setParking: (state, action) => {
      state.parking = action.payload;
    },
    setLabels: (state, action) => {      
      state.labels = action.payload;
    },
  },
});

export const { setParking, setLabels } = parkingSlice.actions;

export default parkingSlice.reducer;
