import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import store from "./../../redux/app/store";
import { userApiSlice } from "../../redux/feature/users/userApiSlice";
import useAuth from "../../hook/useAuth";
import { vehicleApiSlice } from "../../redux/feature/vehicles/vehicleApiSlice";
import { sitesApiSlice } from "../../redux/feature/site/siteApiSlice";
import { parkingApiSlice } from "../../redux/feature/parking/parkingApiSlice";
import { parkingDetailApiSlice } from "../../redux/feature/parking/parkingDetailApiSlice";
import { companiesApiSlice } from "../../redux/feature/company/companyApiSlice";
import { cityApiSlice } from "../../redux/feature/city/cityApiSlice";
import {companyTypeApiSlice} from "../../redux/feature/companyType/CompanyTypeApiSlice.js";
import {siteTypeApiSlice} from "../../redux/feature/siteType/siteTypeApiSlice.js";
import {slotApiSlice} from "../../redux/feature/slot/slotApiSlice.js";
import {authApiSlice} from "../../redux/feature/auth/authApiSlice.js";
import {licensePlateProvinceApiSlice} from "../../redux/feature/licensePlateProvince/licensePlateProvinceApiSlice.js";
import { licensePlateTypeApiSlice } from "../../redux/feature/licensePlateType/licensePlateTypeApiSlice.js";
import { vehicleTypeApiSlice } from "../../redux/feature/vehicleType/vehicleTypeApiSlice.js";
import { genderApiSlice } from "../../redux/feature/gender/genderApiSlice.js";
import {parkingSlotDetailApiSlice} from "../../redux/feature/parkingSlotDetail/parkingSlotDetailApiSlice.js";
import { checkInApiSlice } from "../../redux/feature/checkIn/checkInApiSlice.js";
import {checkOutApiSlice} from "../../redux/feature/checkOut/checkOutApiSlice.js";
import {analysisApiSlice} from "../../redux/feature/analysis/analysisApiSlice.js";
import {Paper} from "@mui/material";


function Prefetch() {
  const { isManager, isAdmin } = useAuth();

  useEffect(() => {

    if (isManager || isAdmin) {
      store.dispatch(authApiSlice.util.prefetch("getUserProfile", "userProfile", { force: true }));
      store.dispatch(analysisApiSlice.util.prefetch("getAnalysis", "analysisList", { force: true }));
      store.dispatch(userApiSlice.util.prefetch("get2faStatus", "get2faStatusList", { force: true }));
    }

    if (isManager) {
      store.dispatch(parkingDetailApiSlice.util.prefetch("getAllParkingDetail", "parkingSlotDetailList", { force: true }));
      store.dispatch(parkingApiSlice.util.prefetch("getParkingSpaces", "parkingSpacesList", {force: true,}));
      store.dispatch(userApiSlice.util.prefetch("getUsers", "usersList", { force: true }));
      store.dispatch(vehicleApiSlice.util.prefetch("getVehicles", "vehiclesList", { force: true }));
      store.dispatch(sitesApiSlice.util.prefetch("getSites", "sitesList", { force: true }));
      store.dispatch(sitesApiSlice.util.prefetch("getListBranch", "branchList", { force: true }));
    }

    if (isAdmin) {
      store.dispatch(checkOutApiSlice.util.prefetch("getCheckOut", "checkOutList", { force: true }));
      store.dispatch(checkInApiSlice.util.prefetch("getCheckIn", "checkInList", { force: true }));
      store.dispatch(parkingSlotDetailApiSlice.util.prefetch("getParkingSlotDetail", "parkingSlotDetailList", { force: true }));
      store.dispatch(sitesApiSlice.util.prefetch("getSites", "sitesList", { force: true }));
      store.dispatch(companiesApiSlice.util.prefetch("getCompany","companiesList", {force: true}));
      store.dispatch(cityApiSlice.util.prefetch("getAllCities", "citiesList", {force: true }));
      store.dispatch(companyTypeApiSlice.util.prefetch("getCompanyType", "companyTypeList", {force: true }));
      store.dispatch(companiesApiSlice.util.prefetch("getAllCompanies", "companyNameList", {force: true}));
      store.dispatch(siteTypeApiSlice.util.prefetch("getAllSiteTypes", "siteTypeList", {force: true}));
      store.dispatch(slotApiSlice.util.prefetch("getSlots", "slotsList", { force: true }));
      store.dispatch(sitesApiSlice.util.prefetch("getListBranch", "branchList", { force: true }));
      store.dispatch(vehicleTypeApiSlice.util.prefetch("getAllVehicleTypes", "vehicleTypeList", { force: true }));
      store.dispatch(licensePlateProvinceApiSlice.util.prefetch("getAllLicensePlateProvinces", "licensePlateProvinceList", { force: true }));
      store.dispatch(licensePlateTypeApiSlice.util.prefetch("getAllLicensePlateTypes", "licensePlateTypeList", { force: true }));
      store.dispatch(userApiSlice.util.prefetch("getAllFullNameUsers", "fullNameUsersList", { force: true }));
      store.dispatch(userApiSlice.util.prefetch("getAllRoles", "roleList", { force: true }));
      store.dispatch(genderApiSlice.util.prefetch("getAllGenders", "genderList", { force: true }));
      store.dispatch(userApiSlice.util.prefetch("getAllSignUpMethods", "signUpMethodList", { force: true }));
    }
  }, []);

  return <Paper elevation={0}><Outlet /></Paper>;
}

export default Prefetch;
