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


function Prefetch() {
  const { isManager, isAdmin } = useAuth();

  useEffect(() => {
    if (isManager) {
      store.dispatch(sitesApiSlice.util.prefetch("getSites", "sitesList", { force: true }));
      store.dispatch(companiesApiSlice.util.prefetch("getCompany","companiesList", {force: true}));
      store.dispatch(cityApiSlice.util.prefetch("getAllCities", "citiesList", {force: true }));
      store.dispatch(companyTypeApiSlice.util.prefetch("getCompanyType", "companyTypeList", {force: true }));
      store.dispatch(companiesApiSlice.util.prefetch("getAllCompanies", "companyNameList", {force: true}));
      store.dispatch(siteTypeApiSlice.util.prefetch("getAllSiteTypes", "siteTypeList", {force: true}));
    }

    if (isManager || isAdmin) {
      store.dispatch(parkingDetailApiSlice.util.prefetch("getAllParkingDetail", "parkingDetailList", { force: true }));
      store.dispatch(parkingApiSlice.util.prefetch("getParkingSpaces", "parkingSpacesList", {force: true,}));
      store.dispatch(userApiSlice.util.prefetch("getUsers", "usersList", { force: true }));
      store.dispatch(vehicleApiSlice.util.prefetch("getVehicles", "vehiclesList", {force: true,}));
    }
  }, []);

  return <Outlet />;
}

export default Prefetch;
