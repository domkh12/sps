import { Box, Tab } from "@mui/material";
import { TabContext, TabList } from "@mui/lab";
import SelectComponent from "./SelectComponent";
import SearchComponent from "./SearchComponent";
import TableActionMenuComponent from "./TableActionMenuComponent";
import { useSelector } from "react-redux";
import useTranslate from "../hook/useTranslate";

function FilterBarComponent({
  parkingSpaceFetched,
  statusFilter,
  branchFilter,
  vehicleTypeFilter,
  cityFilter,
  branchTypeFilter,
  companyFilter,
  roleFetched,
  signUpMethodsFetched,
  branchFetched,
  vehicleTypeFetched,
  companyFetched,
  cityFetched,
  branchTypeFetched,
  handleRoleChange,
  handleMethodChange,
  handleBranchChange,
  handleSearchChange,
  handleVehicleTypeChange,
  handleBranchTypeChange,
  handleCityChange,
  handleCompanyChange,
  searchQuery,
  activeCount,
  pendingCount,
  bannedCount,
  totalElements,
  handleChange,
  showTabs = true,
  companyTypeFetched,
  companyTypeFilter,
  handleCompanyTypeChange,
}) {
  const roleFilter = useSelector((state) => state.users.roleFilter);
  const signUpMethodFilter = useSelector(
    (state) => state.users.signUpMethodFilter
  );  

  const { t } = useTranslate();
  return (
    <>
      {showTabs && (
        <TabContext value={statusFilter}>
          <Box sx={{ borderBottom: 1, borderColor: "divider", px: "20px" }}>
            <TabList onChange={handleChange} aria-label="tabs">
              <Tab
                icon={
                  <>
                    <div className="px-[10px] py-[4px] rounded-[5px] ml-2 bg-black">
                      <p className="text-white text-center">{totalElements}</p>
                    </div>
                  </>
                }
                iconPosition="end"
                sx={{ p: 0, minWidth: 0, mr: 5, textTransform: "none" }}
                disableRipple
                label="All"
                value=""
              />
              <Tab
                icon={
                  <>
                    <div
                      className={`px-[10px] py-[4px] rounded-[5px] ml-2 ${
                        statusFilter === "Active"
                          ? "bg-green-400 bg-opacity-100"
                          : "bg-green-400 bg-opacity-20"
                      } `}
                    >
                      <p
                        className={`text-center ${
                          statusFilter === "Active"
                            ? "text-white"
                            : "text-green-400"
                        }`}
                      >
                        {activeCount}
                      </p>
                    </div>
                  </>
                }
                iconPosition="end"
                sx={{ p: 0, minWidth: 0, mr: 5, textTransform: "none" }}
                disableRipple
                label="Active"
                value="Active"
              />
              <Tab
                icon={
                  <>
                    <div
                      className={`px-[10px] py-[4px] rounded-[5px] ml-2 ${
                        statusFilter === "Pending"
                          ? "bg-yellow-400 bg-opacity-100"
                          : "bg-yellow-400 bg-opacity-20"
                      } `}
                    >
                      <p
                        className={`text-center ${
                          statusFilter === "Pending"
                            ? "text-white "
                            : "text-yellow-400 "
                        }`}
                      >
                        {pendingCount}
                      </p>
                    </div>
                  </>
                }
                iconPosition="end"
                sx={{ p: 0, minWidth: 0, mr: 5, textTransform: "none" }}
                disableRipple
                label="Pending"
                value="Pending"
              />
              <Tab
                icon={
                  <>
                    <div
                      className={`px-[10px] py-[4px] rounded-[5px] ml-2 ${
                        statusFilter === "Banned"
                          ? "bg-red-500 bg-opacity-100"
                          : "bg-red-500 bg-opacity-20"
                      } `}
                    >
                      <p
                        className={`${
                          statusFilter === "Banned"
                            ? "text-white"
                            : "text-red-500"
                        }  text-center`}
                      >
                        {bannedCount}
                      </p>
                    </div>
                  </>
                }
                iconPosition="end"
                sx={{ p: 0, minWidth: 0, mr: 5, textTransform: "none" }}
                disableRipple
                label="Banned"
                value="Banned"
              />
            </TabList>
          </Box>
        </TabContext>
      )}

      <div className={`p-[20px] gap-[16px] flex flex-col lg:flex-row`}>

        {companyTypeFetched && (
            <SelectComponent
              label={t("companyType")}
              labelId="company_type_label"
              id="company_type"
              options={companyTypeFetched}
              onChange={handleCompanyTypeChange}
              optionLabelKey="name"
              width60={true}
              value={companyTypeFilter}
            />
        )}

        {parkingSpaceFetched && (
          <SelectComponent
            label={t("parkingSpace")}
            labelId="parking_space_label"
            id="parking_space"
            options={parkingSpaceFetched?.data}
            onChange={handleRoleChange}
            optionLabelKey="label"
            width60={true}
            value={roleFilter}
          />
        )}

        {roleFetched && (
          <SelectComponent
            label={t("role")}
            labelId="role_label"
            id="role"
            options={roleFetched?.data}
            onChange={handleRoleChange}
            optionLabelKey="name"
            width60={true}
            value={roleFilter}
          />
        )}

        {companyFetched && (
          <SelectComponent
            label={t("company")}
            labelId="company_label"
            id="company"
            options={companyFetched}
            onChange={handleCompanyChange}
            optionLabelKey="companyName"
            width60={true}
            value={companyFilter}
          />
        )}

        {cityFetched && (
          <SelectComponent
            label={t("city")}
            labelId="city_label"
            id="city"
            options={cityFetched}
            onChange={handleCityChange}
            optionLabelKey="name"
            width60={true}
            value={cityFilter}
          />
        )}

        {branchTypeFetched && (
          <SelectComponent
            label={t("branchType")}
            labelId="branchType_label"
            id="branchType"
            options={branchTypeFetched}
            onChange={handleBranchTypeChange}
            optionLabelKey="name"
            width60={true}
            value={branchTypeFilter}
          />
        )}

        {signUpMethodsFetched && (
          <SelectComponent
            label={t("signUpMethod")}
            labelId="signUpMehod_label"
            id="sighUpMethod"
            options={signUpMethodsFetched?.data}
            onChange={handleMethodChange}
            optionLabelKey="name"
            width60={true}
            value={signUpMethodFilter}
          />
        )}

        {vehicleTypeFetched && (
          <SelectComponent
            label={t("vehicleType")}
            labelId="vehicleType_label"
            id="vehicleType"
            options={vehicleTypeFetched?.data}
            onChange={handleVehicleTypeChange}
            optionLabelKey="name"
            width60={true}
            value={vehicleTypeFilter}
          />
        )}

        {branchFetched && (
          <SelectComponent
            label={t("branch")}
            labelId="branch_label"
            id="branch"
            options={branchFetched}
            onChange={handleBranchChange}
            optionLabelKey="siteName"
            width60={true}
            value={branchFilter}
          />
        )}

        <div className="flex items-center gap-3 w-full">
          <SearchComponent
            onSearchChange={handleSearchChange}
            value={searchQuery}
          />
          <TableActionMenuComponent />
        </div>
      </div>
    </>
  );
}

export default FilterBarComponent;
