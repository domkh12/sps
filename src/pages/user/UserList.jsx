import React, { useEffect, useState } from "react";
import {
  useGetUsersQuery,
  usePaginationUsersMutation,
  useSearchUsersMutation,
} from "../../redux/feature/users/userApiSlice";
import { Button, Pagination, Spinner, Table, TextInput } from "flowbite-react";
import UserRow from "./UserRow";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaSearch } from "react-icons/fa";
import UserNotFound from "./components/UserNotFound";
import { IoClose } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { setIsPaginationSuccess } from "../../redux/feature/actions/actionSlice";

function UserList() {
  const navigator = useNavigate();
  const dispatch = useDispatch();
  const [pageNo, setPageNo] = useState(1);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const uuid = useSelector((state) => state.users.uuid);
  const status = useSelector((state) => state.users.status);

  const {
    data: users,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetUsersQuery();

  const [paginationUsers, {}] = usePaginationUsersMutation();
  const [searchUsers, { isLoading: isSearching }] = useSearchUsersMutation();

  useEffect(() => {
    if (isSuccess) {
      setTotalPages(users.totalPages);
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

    const handlePageChange = async (page) => {
      setPageNo(page);
      await paginationUsers({ pageNo: page });
      dispatch(setIsPaginationSuccess(true));
    };

    const handleBtnSearch = async () => {
      if (search.trim()) {
        await searchUsers({ query: search });
      } else {
        await paginationUsers({ pageNo });
      }
    };

    const handleClearSearch = async () => {
      setSearch("");
      await paginationUsers({ pageNo });
    };

    const spinnerTheme = {
      color: {
        primary: "fill-primary",
      },
    };

    content = (
      <div className="flex flex-col ">
        <div>
          <h1 className="text-2xl font-medium dark:text-gray-100 py-4 px-8">
            Users List
          </h1>
        </div>
        <table>
          <thead className="w-full dark:bg-[#282828]">
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
        </table>
        {totalPages > 0 && (
          <div className={`flex justify-center items-center`}>
            <Pagination
              currentPage={pageNo}
              onPageChange={handlePageChange}
              totalPages={totalPages}
            />
          </div>
        )}
      </div>
    );
  }

  return content;
}

export default UserList;
