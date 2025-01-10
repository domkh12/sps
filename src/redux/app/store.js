import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../feature/auth/authSlice.js";
import actionReducer from "../feature/actions/actionSlice.js";
import { apiSlice } from "./api/apiSlice.js";
import userReducer from "../feature/users/userSlice.js";
import vehicleReducer from "../feature/vehicles/vehicleSlice.js";
import parkingDetailReducer from "../feature/parking/parkingDetailSlice.js";
import { setupListeners } from "@reduxjs/toolkit/query";
import translationReducer from "../feature/translate/translationSlice.js";
import parkingReducer from "../feature/parking/parkingSlice.js";
import siteReducer from "../feature/site/siteSlice.js";
import companiesReducer from "../feature/company/companySlice.js";
import cityReducer from "../feature/city/citySlice.js";
import siteTypeReducer from "../feature/siteType/siteTypeSlice.js";

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    users: userReducer,
    action: actionReducer,
    vehicles: vehicleReducer,
    parking: parkingReducer,
    parkingDetail: parkingDetailReducer,
    translation: translationReducer,
    sites: siteReducer,
    companies: companiesReducer,
    city: cityReducer,
    siteType: siteTypeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});

setupListeners(store.dispatch);
export default store;
