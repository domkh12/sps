import { Button, Chip } from "@mui/material";
import { FaTrashCan } from "react-icons/fa6";
import {
  clearFilter,
  setClearSearchQuery,
  setClearStatusFilter,
} from "../redux/feature/users/userSlice";
import { useSelector } from "react-redux";

function FilterChipsComponent({
  statusFilter = "",
  searchQuery,
  roleFilter,
  branchFilter,
  signUpMethodFilter,
  vehicleTypeFilter,
  roleFetched,
  branchFetched,
  signUpMethodsFetched,
  vehicleTypeFetched,
  dispatch,
  handleRoleChange,
  handleBranchChange,
  handleMethodChange,
  handleVehicleTypeChange,
  clearFilter,
  clearSearch,
  t,
}) {
  const resultFound = useSelector((state) => state.users.resultFound);
  const isFiltered = useSelector((state) => state.action.isFiltered);

  return (
    <>
      {isFiltered && (
        <div className="pl-[20px] pb-[20px]">
          <p>
            <span className="font-bold">{resultFound}</span>
            <span className="text-light-gray text-sm">{`${"\u00a0"}result found`}</span>
          </p>

          <div className="flex items-center gap-5  mt-3">
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
