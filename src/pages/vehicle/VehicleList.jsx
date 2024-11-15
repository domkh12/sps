import React, { useEffect, useRef, useState } from "react";
import { Button, Table, TextInput, useThemeMode } from "flowbite-react";
import VehicleRow from "./VehicleRow";
import { useGetVehicleQuery } from "../../redux/feature/vehicles/vehicleApiSlice";
import { IoClose } from "react-icons/io5";
import { FaPlus, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  PiCaretDownThin,
  PiCaretLeftThin,
  PiCaretLineLeftThin,
  PiCaretLineRightThin,
  PiCaretRightThin,
} from "react-icons/pi";
import {
  setIsLoadingBar,
  setIsPaginationSuccess,
} from "../../redux/feature/actions/actionSlice";
import {
  increasePageNo,
  decreasePageNo,
  resetPageNo,
  setPageSize,
  setTotalPages,
  lastPageNo,
} from "../../redux/feature/vehicles/vehicleSlice";

function VehicleList() {
  const [search, setSearch] = useState("");
  const dispatch = useDispatch();
  const navigator = useNavigate();
  const { mode } = useThemeMode();
  const isScrolling = useSelector((state) => state.action.isScrolling);
  const pageNo = useSelector((state) => state.vehicles.pageNo);
  const pageSize = useSelector((state) => state.vehicles.pageSize);
  const totalPages = useSelector((state) => state.vehicles.totalPages);
  const [isPageSizeOpen, setIsPageSizeOpen] = useState(false);
  const pageSizeRef = useRef(null);

  const {
    data: vehicles,
    isLoading,
    isSuccess,
    isError,
    refetch,
    isFetching,
    error,
  } = useGetVehicleQuery(
    { pageNo, pageSize },
    {
      pollingInterval: 300000,
      refetchOnMountOrArgChange: true,
    }
  );

  useEffect(() => {
    if (isFetching) {
      dispatch(setIsLoadingBar(true));
    } else {
      dispatch(setIsLoadingBar(false));
    }
  }, [isFetching]);

  useEffect(() => {
    refetch();
    setIsPageSizeOpen(false);
    dispatch(setIsPaginationSuccess(true));
  }, [pageNo, pageSize, refetch]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pageSizeRef.current && !pageSizeRef.current.contains(event.target)) {
        setIsPageSizeOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isSuccess) {
      dispatch(setTotalPages(vehicles.totalPages));     
    }
  }, [vehicles, totalPages, pageNo]);

  const toggleDropdown = () => {
    setIsPageSizeOpen((prev) => !prev);
  };

  const handleClearSearch = async () => {
    setSearch("");
  };

  const handleBtnSearch = async () => {};

  const handleBtnAddNewClicked = () => {
    navigator("/dash/vehicles/new");
  };

  const handleNextPagination = async () => {
    dispatch(increasePageNo());
    dispatch(setIsPaginationSuccess(true));
  };

  const handleBackPagination = async () => {
    dispatch(decreasePageNo());
    dispatch(setIsPaginationSuccess(true));
  };

  const handleResetPagination = async () => {
    dispatch(resetPageNo());
    dispatch(setIsPaginationSuccess(true));
  };

  const handleLastPagination = async () => {
    dispatch(lastPageNo());
    dispatch(setIsPaginationSuccess(true));
  };

  const handleSetPageSize = (size) => {
    if ([10, 30, 50].includes(size)) {
      dispatch(setPageSize(size));
    } else {
      console.error("Invalid page size:", size);
    }
  };

  const calculateItemRange = () => {
    const startItem = (pageNo - 1) * pageSize + 1;
    const endItem = Math.min(pageNo * pageSize, vehicles.totalElements);
    return `${startItem}-${endItem}`;
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
    const { ids, totalPages, totalElements } = vehicles;

    const tableContent = ids?.length
      ? ids.map((vehicleId) => (
          <VehicleRow key={vehicleId} vehicleId={vehicleId} />
        ))
      : null;
   
    content = (
      <div className="flex flex-col w-full pb-16">
        <h1 className="text-2xl font-medium dark:text-gray-50 py-4 px-8">
          Vehicles List
        </h1>

        <table className="w-full">
          <thead
            className={`dark:bg-[#282828] ${isScrolling ? "shadow-md" : ""}`}
          >
            <tr className="p-0 w-full">
              <th className="h-20" colSpan={6}>
                <div className="flex justify-between">
                  <div className="flex items-center gap-2 justify-start ">
                    <div className="relative">
                      <TextInput
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="PlateNumber, Owner, Owner Phone"
                        style={{
                          backgroundColor: mode === "dark" ? "#161616" : "",
                          color: mode === "dark" ? "#f2f2f2" : "#161616",
                          fontWeight: "400",
                        }}
                      />
                      {search && (
                        <button
                          onClick={handleClearSearch}
                          className="absolute right-3 top-5 transform -translate-y-1/2"
                        >
                          <IoClose className="dark:text-[#f2f2f2] text-lg" />
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
            <tr className="border-0 dark:text-white text-gray-500">
              <th>Vehicle</th>
              <th>License Plate Number</th>
              <th>Owner</th>
              <th className="text-right">Owner PhoneNumber</th>
              <th className="text-right">Date</th>
              <th className="text-right">Action</th>
            </tr>
          </thead>
          <tbody>{tableContent}</tbody>
          <tfoot>
            <tr>
              <td colSpan={7} className="py-2 px-8">
                <div className="flex justify-end items-center gap-4">
                  <div className="text-gray-500">
                    <p>Rows per page: </p>
                  </div>
                  <div className="relative" ref={pageSizeRef}>
                    <button
                      className="hover:bg-gray-200 p-2 rounded-lg flex justify-center items-center gap-4"
                      onClick={toggleDropdown}
                    >
                      <span className="text-gray-900 ml-3">{pageSize}</span>
                      <PiCaretDownThin className="h-5 w-5" />
                    </button>
                    {isPageSizeOpen && (
                      <div className="w-full h-28 absolute bottom-0 left-0 rounded-lg bg-gray-50 shadow-md border-[1px] flex flex-col justify-between items-center py-2">
                        <button
                          className="hover:bg-gray-200 w-full py-1 h-full"
                          onClick={() => handleSetPageSize(10)}
                        >
                          10
                        </button>
                        <button
                          className="hover:bg-gray-200 w-full py-1 h-full"
                          onClick={() => handleSetPageSize(30)}
                        >
                          30
                        </button>
                        <button
                          className="hover:bg-gray-200 w-full py-1 h-full"
                          onClick={() => handleSetPageSize(50)}
                        >
                          50
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="text-gray-500 text-sm">
                    <p>
                      {calculateItemRange()} of about {totalPages}
                    </p>
                  </div>
                  <button
                    className={`p-2 rounded-full ${
                      pageNo === 1
                        ? "opacity-50 cursor-default"
                        : "hover:bg-gray-200 "
                    }`}
                    disabled={pageNo === 1}
                    onClick={handleResetPagination}
                  >
                    <PiCaretLineLeftThin className="h-5 w-5" />
                  </button>
                  <button
                    className={`p-2 rounded-full ${
                      pageNo === 1
                        ? "opacity-50 cursor-default"
                        : "hover:bg-gray-200 "
                    }`}
                    disabled={pageNo === 1}
                    onClick={handleBackPagination}
                  >
                    <PiCaretLeftThin className="h-5 w-5" />
                  </button>

                  <button
                    className={`p-2 rounded-full ${
                      totalPages === pageNo
                        ? "opacity-50 cursor-default"
                        : "hover:bg-gray-200 "
                    }`}
                    onClick={handleNextPagination}
                    disabled={totalPages == pageNo}
                  >
                    <PiCaretRightThin className="h-5 w-5" />
                  </button>

                  <button
                    className={`p-2 rounded-full ${
                      totalPages === pageNo
                        ? "opacity-50 cursor-default"
                        : "hover:bg-gray-200 "
                    }`}
                    onClick={handleLastPagination}
                    disabled={totalPages == pageNo}
                  >
                    <PiCaretLineRightThin className="h-5 w-5" />
                  </button>
                </div>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    );
  }

  return content;
}

export default VehicleList;
