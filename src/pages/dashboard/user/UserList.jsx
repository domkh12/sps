import React from "react";
import { useGetUsersQuery } from "../../../redux/feature/users/userApiSlice";
import { Checkbox, Table } from "flowbite-react";
import UserRow from "./UserRow";

function UserList() {
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

    content = (
      <div className="overflow-x-auto">
        <Table>
          <Table.Head>
            <Table.HeadCell className="p-4">
              <Checkbox />
            </Table.HeadCell>
            <Table.HeadCell>FullName</Table.HeadCell>
            <Table.HeadCell>Email</Table.HeadCell>
            <Table.HeadCell>PhoneNumber</Table.HeadCell>
            <Table.HeadCell>Roles</Table.HeadCell>
            <Table.HeadCell>CreatedAt</Table.HeadCell>
          </Table.Head>
          <Table.Body>{tableContent}</Table.Body>
        </Table>
      </div>
    );
  }

  return content;
}

export default UserList;
