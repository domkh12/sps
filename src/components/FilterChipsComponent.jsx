import { Button, Chip } from "@mui/material";
import { FaTrashCan } from "react-icons/fa6";
import {
  clearFilter,
  setClearSearchQuery,
  setClearStatusFilter,
} from "../redux/feature/users/userSlice";
import { useDispatch, useSelector } from "react-redux";

function FilterChipsComponent({
  statusFilter = "",
  searchQuery,
  roleFilter,
  branchFilter,
  signUpMethodFilter,
  companyFilter,
  vehicleTypeFilter,
  roleFetched,
  companyFetched,
  branchFetched,
  signUpMethodsFetched,
  vehicleTypeFetched,
  handleRoleChange,
  handleBranchChange,
  handleMethodChange,
  handleVehicleTypeChange,
  clearFilter,
  clearSearch,
  resultFound,
  isFiltered,
  handleCompanyChange,
  cityFetched,
  cityFilter,
  handleCityChange,
  branchTypeFetched,
  branchTypeFilter,
  handleBranchTypeChange,
}) {
  const dispatch = useDispatch();
  return (
    <>
      {isFiltered && (
        <div className="pl-[20px] pb-[20px]">
          <p>
            <span className="font-bold">{resultFound}</span>
            <span className="text-light-gray text-sm">{`${"\u00a0"}result found`}</span>
          </p>

          <div className="flex items-center gap-5  mt-3">
            {branchTypeFilter?.length > 0 ? (
              <div className="p-2 rounded-[7px] border-dashed border w-fit flex items-center">
                <span className="font-medium mr-2">{`Branch${"\u00a0"}Type:${"\u00a0"}`}</span>
                <div className="flex gap-3">
                  {branchTypeFilter?.map((branchType) => {
                    const matchedBranchType = branchTypeFetched?.find(
                      (fetchedBranchType) =>
                        fetchedBranchType.uuid === branchType
                    );
                    const branchTypeName = matchedBranchType
                      ? matchedBranchType.name
                      : branchType;
                    return (
                      <Chip
                        key={branchType}
                        size="small"
                        sx={{ borderRadius: "8px" }}
                        label={branchTypeName}
                        onDelete={() =>
                          handleBranchTypeChange(
                            branchTypeFilter.filter((b) => b !== branchType)
                          )
                        }
                      />
                    );
                  })}
                </div>
              </div>
            ) : null}

            {cityFilter?.length > 0 ? (
              <div className="p-2 rounded-[7px] border-dashed border w-fit flex items-center">
                <span className="font-medium mr-2">{`City:${"\u00a0"}`}</span>
                <div className="flex gap-3">
                  {cityFilter?.map((city) => {
                    const matchedCity = cityFetched?.find(
                      (fetchedCity) => fetchedCity.uuid === city
                    );
                    const cityName = matchedCity ? matchedCity.name : city;
                    return (
                      <Chip
                        key={city}
                        size="small"
                        sx={{ borderRadius: "8px" }}
                        label={cityName}
                        onDelete={() =>
                          handleCityChange(cityFilter.filter((b) => b !== city))
                        }
                      />
                    );
                  })}
                </div>
              </div>
            ) : null}

            {companyFilter?.length > 0 ? (
              <div className="p-2 rounded-[7px] border-dashed border w-fit flex items-center">
                <span className="font-medium mr-2">
                  {`Company:${"\u00a0"}`}
                </span>
                <div className="flex gap-3">
                  {companyFilter?.map((company) => {
                    const matchedCompany = companyFetched?.find(
                      (fetchedCompany) => fetchedCompany.uuid === company
                    );
                    const companyName = matchedCompany
                      ? matchedCompany.companyName
                      : company;
                    return (
                      <Chip
                        key={company}
                        size="small"
                        sx={{ borderRadius: "8px" }}
                        label={companyName}
                        onDelete={() =>
                          handleCompanyChange(
                            companyFilter.filter((b) => b !== company)
                          )
                        }
                      />
                    );
                  })}
                </div>
              </div>
            ) : null}

            {statusFilter !== "" ? (
              <div className="p-2 rounded-[7px] border-dashed border w-fit">
                <div>
                  <span className="font-medium mr-2">Status:</span>
                  <Chip
                    size="small"
                    sx={{ borderRadius: "8px" }}
                    label={statusFilter}
                    onDelete={() => dispatch(setClearStatusFilter())}
                  />
                </div>
              </div>
            ) : null}

            {searchQuery !== "" ? (
              <div className="p-2 rounded-[7px] border-dashed border w-fit">
                <div>
                  <span className="font-medium mr-2">Keyword:</span>
                  <Chip
                    size="small"
                    sx={{ borderRadius: "8px" }}
                    label={searchQuery}
                    onDelete={clearSearch}
                  />
                </div>
              </div>
            ) : null}

            {roleFilter?.length > 0 ? (
              <div className="p-2 rounded-[7px] border-dashed border w-fit flex items-center">
                <span className="font-medium mr-2">Role:</span>
                <div className="flex gap-3">
                  {roleFilter.map((role) => {
                    const matchedRole = roleFetched.data?.find(
                      (fetchedRole) => fetchedRole.uuid === role
                    );
                    const roleName = matchedRole ? matchedRole.name : role; // Use fetched name if match found
                    return (
                      <Chip
                        key={role}
                        size="small"
                        sx={{ borderRadius: "8px" }}
                        label={roleName} //Display fetched name or original role
                        onDelete={() =>
                          handleRoleChange(roleFilter.filter((r) => r !== role))
                        }
                      />
                    );
                  })}
                </div>
              </div>
            ) : null}

            {vehicleTypeFilter?.length > 0 ? (
              <div className="p-2 rounded-[7px] border-dashed border w-fit flex items-center">
                <span className="font-medium mr-2">
                  {`Vehicle${"\u00a0"}Type:${"\u00a0"}`}
                </span>
                <div className="flex gap-3">
                  {vehicleTypeFilter.map((vehicleType) => {
                    const matchedVehicleType = vehicleTypeFetched?.find(
                      (fetchedVehicleType) =>
                        fetchedVehicleType.uuid === vehicleType
                    );
                    const vehicleTypeName = matchedVehicleType
                      ? matchedVehicleType.name
                      : vehicleType;
                    return (
                      <Chip
                        key={vehicleType}
                        size="small"
                        sx={{ borderRadius: "8px" }}
                        label={vehicleTypeName}
                        onDelete={() =>
                          handleVehicleTypeChange(
                            vehicleTypeFilter.filter((b) => b !== vehicleType)
                          )
                        }
                      />
                    );
                  })}
                </div>
              </div>
            ) : null}

            {branchFilter?.length > 0 ? (
              <div className="p-2 rounded-[7px] border-dashed border w-fit flex items-center">
                <span className="font-medium mr-2">Branch:</span>
                <div className="flex gap-3">
                  {branchFilter.map((branch) => {
                    const matchedBranch = branchFetched?.find(
                      (fetchedBranch) => fetchedBranch.uuid === branch
                    );
                    const branchName = matchedBranch
                      ? matchedBranch.siteName
                      : branch;
                    return (
                      <Chip
                        key={branch}
                        size="small"
                        sx={{ borderRadius: "8px" }}
                        label={branchName} //Display fetched name or original role
                        onDelete={() =>
                          handleBranchChange(
                            branchFilter.filter((b) => b !== branch)
                          )
                        }
                      />
                    );
                  })}
                </div>
              </div>
            ) : null}

            {signUpMethodFilter?.length > 0 ? (
              <div className="p-2 rounded-[7px] border-dashed border w-fit flex items-center">
                <span className="font-medium mr-2">{`Sign\u00a0up\u00a0method:`}</span>
                <div className="flex gap-3">
                  {signUpMethodFilter.map((signUpMethod) => {
                    const matchedSignUpMethod = signUpMethodsFetched.data?.find(
                      (fetchedSignUpMethod) =>
                        fetchedSignUpMethod.uuid === signUpMethod
                    );
                    const signUpMethodName = matchedSignUpMethod
                      ? matchedSignUpMethod.name
                      : signUpMethod; // Use fetched name if match found
                    return (
                      <Chip
                        key={signUpMethod}
                        size="small"
                        sx={{ borderRadius: "8px" }}
                        label={signUpMethodName} //Display fetched name or original role
                        onDelete={() =>
                          handleMethodChange(
                            signUpMethodFilter.filter((s) => s !== signUpMethod)
                          )
                        }
                      />
                    );
                  })}
                </div>
              </div>
            ) : null}

            <Button
              onClick={clearFilter}
              sx={{ borderRadius: "8px" }}
              color="error"
              startIcon={<FaTrashCan />}
            >
              Clear
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

export default FilterChipsComponent;
