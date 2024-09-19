import { configureStore } from "@reduxjs/toolkit";
import languageReducer from "../feature/translate/languageSlice.js";
import authReducer from "../feature/auth/authSlice.js";

const store = configureStore({
  reducer: {
    language: languageReducer,
    auth: authReducer,
  },
});

export default store;
