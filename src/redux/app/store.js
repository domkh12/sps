import { configureStore } from "@reduxjs/toolkit";
import languageReducer from "../feature/translate/languageSlice.js";
import authReducer from "../feature/auth/authSlice.js";
import actionReducer from "../feature/actions/actionSlice.js";
import { apiSlice } from "./api/apiSlice.js";
import userReducer from  "../feature/users/userSlice.js";


const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    language: languageReducer,
    auth: authReducer,
    users: userReducer,
    action: actionReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true
});

export default store;
