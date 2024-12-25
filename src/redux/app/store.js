import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../feature/auth/authSlice.js";
import actionReducer from "../feature/actions/actionSlice.js";
import { apiSlice } from "./api/apiSlice.js";
import userReducer from "../feature/users/userSlice.js";
import vehicleReducer from "../feature/vehicles/vehicleSlice.js";
import parkingDetailReducer from "../feature/parking/parkingDetailSlice.js";
import roleReducer from "../feature/role/roleSlice.js";
import { setupListeners } from "@reduxjs/toolkit/query";
import translationReducer from "../feature/translate/translationSlice.js";
import parkingReducer from "../feature/parking/parkingSlice.js";

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    users: userReducer,
    action: actionReducer,
    vehicles: vehicleReducer,
    parking: parkingReducer,
    parkingDetail: parkingDetailReducer,
    role: roleReducer,
    translation: translationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: false,
});

setupListeners(store.dispatch);
export default store;
