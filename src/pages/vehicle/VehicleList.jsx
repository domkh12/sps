import React, { useState } from "react";
import { Button, Table, TextInput } from "flowbite-react";
import VehicleRow from "./VehicleRow";
import { useGetVehicleQuery } from "../../redux/feature/vehicles/vehicleApiSlice";
import { IoClose } from "react-icons/io5";
import { FaPlus, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function VehicleList() {
  const [search, setSearch] = useState("");
  const navigator = useNavigate();

  const {
    data: vehicles,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetVehicleQuery();

  const handleClearSearch = async () => {
    setSearch("");
  };

  const handleBtnSearch = async () => {};

  const handleBtnAddNewClicked = () => {
    navigator("/dash/vehicles/new");
  };

  let content;

  if (isLoading)
    content = (
      <div className="p-5">
        <div className="animate-pulse h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-7"></div>

        <div className="flex justify-between items-center">
          <div className="flex gap-3">
            <div className="animate-pulse h-10 bg-gray-200 rounded-lg dark:bg-gray-700 w-48 mb-4"></div>
            <div className="animate-pulse h-10 bg-gray-200 rounded-lg dark:bg-gray-700 w-32 mb-4"></div>
          </div>
          <div className="animate-pulse h-10 bg-gray-200 rounded-lg dark:bg-gray-700 w-48 mb-4"></div>
        </div>
      </div>
    );

  if (isError) {
    content = <p>Error: {error?.data?.message}</p>;
  }

  if (isSuccess) {
    const { ids } = vehicles;

    const tableContent = ids?.length
      ? ids.map((vehicleId) => (
          <VehicleRow key={vehicleId} vehicleId={vehicleId} />
        ))
      : null;

    content = (
      <div className="flex flex-col w-full">
        <h1 className="text-2xl font-medium dark:text-gray-100 py-4 px-8">
          Vehicles List
        </h1>

        <table className="w-full">
          <thead>
            <tr className="p-0 w-full">
              <th className="h-20" colSpan={6}>
                <div className="flex justify-between">
                  <div className="flex items-center gap-2 justify-start ">
                    <div className="relative">
                      <TextInput
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="PlateNumber, Owner, Owner Phone"
                      />
                      {search && (
                        <button
                          onClick={handleClearSearch}
                          className="absolute right-3 top-5 transform -translate-y-1/2"
                        >
                          <IoClose />
                        </button>
                      )}
                    </div>
                    <Button
                      onClick={handleBtnSearch}
                      className="bg-primary flex justify-center items-center hover:bg-primary-hover ring-transparent h-10 w-28 sm:w-14"
                    >
                      <FaSearch className="mr-2 sm:mr-0" />{" "}
                      <span className="sm:hidden">Search</span>{" "}
                    </Button>
                  </div>
                  <Button
                    className="bg-primary flex justify-center items-center hover:bg-primary-hover ring-transparent h-10"
                    onClick={handleBtnAddNewClicked}
                  >
                    <FaPlus className="mr-2 sm:mr-0" />
                    <span className="sm:hidden">Create Vehicle</span>
                  </Button>
                </div>
              </th>
            </tr>
            <tr className="border-0">
              <th>Vehicle</th>
              <th>License Plate Number</th>
              <th>Owner</th>
              <th className="text-right">Owner PhoneNumber</th>
              <th className="text-right">Date</th>
              <th className="text-right">Action</th>
            </tr>            
          </thead>
          <tbody>{tableContent}</tbody>
        </table>
      </div>
    );
  }

  return content;
}

export default VehicleList;
