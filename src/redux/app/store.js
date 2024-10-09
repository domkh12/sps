import { configureStore } from "@reduxjs/toolkit";
import languageReducer from "../feature/translate/languageSlice.js";
import authReducer from "../feature/auth/authSlice.js";
import parkingReducer from "../feature/parking/parkingSlice.js";
import actionReducer from "../feature/actions/ActionSlice.js";
import parkinSlotReducer from  "../feature/parking/parkingSlotSlice.js";
import { apiSlice } from "./api/apiSlice.js";


const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    language: languageReducer,
    auth: authReducer,
    parking: parkingReducer,
    action: actionReducer,
    parkingSlot:  parkinSlotReducer,    
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true
});

export default store;
