import React, { useEffect, useState } from "react";
import {
  useGetUsersQuery,
  usePaginationUsersMutation,
  useSearchUsersMutation,
} from "../../redux/feature/users/userApiSlice";
import {
  Button,
  Checkbox,
  Pagination,
  Spinner,
  Table,
  TextInput,
} from "flowbite-react";
import UserRow from "./UserRow";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaSearch } from "react-icons/fa";

function UserList() {
  const navigator = useNavigate();
  const [pageNo, setPageNo] = useState(1);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  
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
      ? ids.map((userId) => <UserRow key={userId} userId={userId} />)
      : null;

    const handleBtnAddNewClicked = () => {
      navigator("/dash/users/new");
    };

    const handlePageChange = async (page) => {
      setPageNo(page);
      await paginationUsers({ pageNo: page });
    };

    const handleBtnSearch = async () => {
      if (search.trim()) {
        const result = await searchUsers({ query: search });

        setTotalPages(result.data.totalPages);
      } else {
        const result = await paginationUsers({ pageNo });
        setTotalPages(result.data.totalPages);
      }
    };

    content = (
      <div className="overflow-x-auto p-4 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div className="flex gap-2 justify-center items-center">
            <TextInput
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ID, Name, Email, Phone"
            />
            <Button
              onClick={handleBtnSearch}
              className="bg-primary flex justify-center items-center hover:bg-primary-hover ring-transparent h-10 w-28 sm:w-14"
            >
              {isSearching ? (
                <Spinner color="purple" size="xs" />
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
        <div className="overflow-x-auto">
          <Table striped>
            <Table.Head>
              <Table.HeadCell className="p-4">
                <Checkbox />
              </Table.HeadCell>
              <Table.HeadCell>FullName</Table.HeadCell>
              <Table.HeadCell>Email</Table.HeadCell>
              <Table.HeadCell>Phone_Number</Table.HeadCell>
              <Table.HeadCell>Roles</Table.HeadCell>
              <Table.HeadCell>CreatedAt</Table.HeadCell>
              <Table.HeadCell>Disabled</Table.HeadCell>
              <Table.HeadCell>Action</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">{tableContent}</Table.Body>
          </Table>
        </div>
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
