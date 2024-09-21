import { configureStore } from "@reduxjs/toolkit";
import languageReducer from "../feature/translate/languageSlice.js";
import authReducer from "../feature/auth/authSlice.js";
import parkingReducer from "../feature/parking/parkingSlice.js";

const store = configureStore({
  reducer: {
    language: languageReducer,
    auth: authReducer,
    parking: parkingReducer,
  },
});

export default store;
