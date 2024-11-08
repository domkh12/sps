import React, { useEffect, useRef, useState } from "react";
import {
  useGetUsersQuery,
  useSearchUsersMutation,
} from "../../redux/feature/users/userApiSlice";
import { Button, Pagination, Spinner, Table, TextInput } from "flowbite-react";
import UserRow from "./UserRow";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaSearch } from "react-icons/fa";
import UserNotFound from "./components/UserNotFound";
import { IoClose } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import {
  PiCaretDownThin,
  PiCaretLeftThin,
  PiCaretLineLeftThin,
  PiCaretRightThin,
} from "react-icons/pi";
import {
  decreasePageNo,
  increasePageNo,
  resetPageNo,
  setPageSize,
  setTotalPages,
} from "../../redux/feature/users/userSlice";
import {
  setIsLoadingBar,
  setIsPaginationSuccess,
} from "../../redux/feature/actions/actionSlice";

function UserList() {
  const navigator = useNavigate();
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const totalPages = useSelector((state) => state.users.totalPages);
  const uuid = useSelector((state) => state.users.uuid);
  const status = useSelector((state) => state.users.status);
  const isScrolling = useSelector((state) => state.action.isScrolling);
  const pageNo = useSelector((state) => state.users.pageNo);
  const pageSize = useSelector((state) => state.users.pageSize);
  const [isPageSizeOpen, setIsPageSizeOpen] = useState(false);
  const pageSizeRef = useRef(null);  
  console.log(
    "pageNo",pageNo
  )
  const {
    data: users,
    isLoading,
    isSuccess,
    isError,
    error,
    refetch,
    isFetching,
  } = useGetUsersQuery(
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

  const toggleDropdown = () => {
    setIsPageSizeOpen((prev) => !prev);
  };

  console.log("isFetching", isFetching);

  const [searchUsers, { isLoading: isSearching }] = useSearchUsersMutation();

  useEffect(() => {
    if (isSuccess) {
      dispatch(setTotalPages(users.totalPages));
    }
  }, [users]);

  let content;

  if (isLoading) content = <p>Loading...</p>;

  if (isError) {
    content = <p>Error: {error?.data?.message}</p>;
  }

  if (isSuccess) {
    const { ids } = users;
    const tableContent = ids?.length
      ? ids.map((userId) => (
          <UserRow key={userId} userId={userId} uuid={uuid} status={status} />
        ))
      : null;
    const handleBtnAddNewClicked = () => {
      navigator("/dash/users/new");
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

    const handleBtnSearch = async () => {
      if (search.trim()) {
        await searchUsers({ query: search });
      } else {
        refetch();
      }
    };

    const handleClearSearch = async () => {
      setSearch("");
      refetch();
    };

    const spinnerTheme = {
      color: {
        primary: "fill-primary",
      },
    };

    content = (
      <div className="flex flex-col pb-16">
        <div>
          <h1 className="text-2xl font-medium dark:text-gray-100 py-4 px-8">
            Users List
          </h1>
        </div>
        <table>
          <thead
            className={`w-full dark:bg-[#282828] ${
              isScrolling ? "shadow-md transition-all duration-100" : ""
            }`}
          >
            <tr className="p-0 w-full">
              <th colSpan={7} className="h-20">
                <div className="flex justify-between items-center">
                  <div className="flex justify-start items-center gap-3">
                    <div className="relative">
                      <TextInput
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="ID, Name, Email, Phone"
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
                      {isSearching ? (
                        <Spinner
                          theme={spinnerTheme}
                          color="primary"
                          size="xs"
                        />
                      ) : (
                        <>
                          {" "}
                          <FaSearch className="mr-2 sm:mr-0" />{" "}
                          <span className="sm:hidden">Search</span>{" "}
                        </>
                      )}
                    </Button>
                  </div>

                  <Button
                    className="bg-primary flex justify-center items-center hover:bg-primary-hover ring-transparent h-10"
                    onClick={handleBtnAddNewClicked}
                  >
                    <FaPlus className="mr-2 sm:mr-0" />
                    <span className="sm:hidden">Add New</span>
                  </Button>
                </div>
              </th>
            </tr>
            <tr className="border-0 dark:text-white text-gray-500">
              <th>FullName</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Roles</th>
              <th className="text-right">Date</th>
              <th className="text-right">Status</th>
              <th className="text-right">Action</th>
            </tr>
          </thead>
          {tableContent ? <tbody>{tableContent}</tbody> : <UserNotFound />}
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
                          onClick={() => dispatch(setPageSize(10))}
                        >
                          10
                        </button>
                        <button
                          className="hover:bg-gray-200 w-full py-1 h-full"
                          onClick={() => dispatch(setPageSize(30))}
                        >
                          30
                        </button>
                        <button
                          className="hover:bg-gray-200 w-full py-1 h-full"
                          onClick={() => dispatch(setPageSize(50))}
                        >
                          50
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="text-gray-500 text-sm">
                    <p>of about {totalPages}</p>
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
                    className="hover:bg-gray-200 p-2 rounded-full"
                    onClick={handleNextPagination}
                  >
                    <PiCaretRightThin className="h-5 w-5" />
                  </button>
                </div>
              </td>
            </tr>
          </tfoot>
        </table>
        {/* {totalPages > 0 && (
          <div className={`flex justify-center items-center`}>
            <Pagination
              currentPage={pageNo}
              onPageChange={handlePageChange}
              totalPages={totalPages}
            />
          </div>
        )} */}
      </div>
    );
  }

  return content;
}

export default UserList;
