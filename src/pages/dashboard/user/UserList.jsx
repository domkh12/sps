import React from "react";
import { useGetUsersQuery } from "../../../redux/feature/users/userApiSlice";
import { Button, Checkbox, Table } from "flowbite-react";
import UserRow from "./UserRow";
import { Outlet, useNavigate } from "react-router-dom";
import { MdOutlineAdd } from "react-icons/md";

function UserList() {
  const navigator = useNavigate();

  const {
    data: users,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetUsersQuery();

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

    content = (
      <div className="overflow-x-auto p-4 flex flex-col gap-4">
        <div className="flex justify-end">
          <Button
              className="bg-primary w-[8vw] hover:bg-primary-hover ring-transparent"
              onClick={handleBtnAddNewClicked}
            >
              Add New
            </Button>
        </div>        
        <Table>
          <Table.Head className="overflow-auto">
            <Table.HeadCell className="p-4">
              <Checkbox />
            </Table.HeadCell>
            <Table.HeadCell>FullName</Table.HeadCell>
            <Table.HeadCell>Email</Table.HeadCell>
            <Table.HeadCell>Phone Number</Table.HeadCell>
            <Table.HeadCell>Roles</Table.HeadCell>
            <Table.HeadCell>CreatedAt</Table.HeadCell>
            <Table.HeadCell>Action</Table.HeadCell>
          </Table.Head>
          <Table.Body>{tableContent}</Table.Body>
        </Table>
      </div>
    );
  }

  return content;
}

export default UserList;
