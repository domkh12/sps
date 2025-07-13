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
import mapViewReducer from "../feature/mapView/mapViewSlice.js";
import analysisReducer from "../feature/analysis/analysisSlice.js";
import appReducer from "../feature/app/appSlice.js";
import companyTypeReducer from "../feature/companyType/companyTypeSlice.js";
import themeReducer from "../feature/theme/themeSlice.js";
import slotReducer from "../feature/slot/slotSlice.js"
import licensePlateProvinceReducer from "../feature/licensePlateProvince/licensePlateProvinceSlice.js";
import licensePlateTypeReducer from "../feature/licensePlateType/licensePlateTypeSlice.js";
import vehicleTypeReducer from "../feature/vehicleType/vehicleTypeSlice.js";
import genderReducer from "../feature/gender/genderSlice.js";

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    theme: themeReducer,
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
    mapView: mapViewReducer,
    analysis: analysisReducer,
    app: appReducer,
    companyType: companyTypeReducer,
    slot: slotReducer,
    licensePlateProvince: licensePlateProvinceReducer,
    licensePlateType: licensePlateTypeReducer,
    vehicleType: vehicleTypeReducer,
    gender: genderReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }).concat(apiSlice.middleware),
  devTools: false,
});

setupListeners(store.dispatch);
export default store;
