import React from "react";
import { Checkbox, Table } from "flowbite-react";
import { Avatar } from "flowbite-react";
import { RiUserAddFill } from "react-icons/ri";
import { Button } from "flowbite-react";
function User() {
  
  return (
    <div className="overflow-x-auto">
      <Button gradientMonochrome="purple" ><RiUserAddFill className="mr-2 h-5 w-5"/>Add Employee</Button>
     
      <Table hoverable>
        <Table.Head>
          <Table.HeadCell className="p-4">
            <Checkbox />
          </Table.HeadCell>
          <Table.HeadCell>Staff ID</Table.HeadCell>
          <Table.HeadCell>Name</Table.HeadCell>
          <Table.HeadCell>Photo</Table.HeadCell>
          <Table.HeadCell>Gender</Table.HeadCell>
          <Table.HeadCell>Adress</Table.HeadCell>
          <Table.HeadCell>Phone Number</Table.HeadCell>
          <Table.HeadCell>Email</Table.HeadCell>
          <Table.HeadCell>Date Of Birth</Table.HeadCell>
          <Table.HeadCell>Action</Table.HeadCell>
          <Table.HeadCell>
            <span className="sr-only">Edit</span>
          </Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
            <Table.Cell className="p-4">
              <Checkbox />
            </Table.Cell>
            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
            NPIC-0001
            </Table.Cell>
            <Table.Cell>EI CHAN UDOM</Table.Cell>
            <Table.Cell><Avatar img="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSN5kyGXRsJTnCvfM371Ycg8u7k9viw1gW-g&s" alt="avatar of Jese" rounded /></Table.Cell>
            <Table.Cell>Male</Table.Cell>
            <Table.Cell>Phnom Penh</Table.Cell>
            <Table.Cell>0123654789</Table.Cell>
            <Table.Cell>Email</Table.Cell>
            <Table.Cell>21/02/2003</Table.Cell>
            <Table.Cell>
              <a href="#" className="font-medium text-cyan-600 hover:underline dark:text-cyan-500">
                Edit
              </a>
            </Table.Cell>
          </Table.Row>
          <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
            <Table.Cell className="p-4">
              <Checkbox />
            </Table.Cell>
            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
            NPIC-0002
            </Table.Cell>
            <Table.Cell>Nai Kong</Table.Cell>
            <Table.Cell> <Avatar img="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQh0gQnaMzL3UHAIbUCQi-DeExFsXLwH-N0MA&s" alt="avatar of Jese" rounded /></Table.Cell>
            <Table.Cell>Male</Table.Cell>
            <Table.Cell>Phnom Penh</Table.Cell>
            <Table.Cell>0123654789</Table.Cell>
            <Table.Cell>kong@gmail.com</Table.Cell>
            <Table.Cell>03/12/2003</Table.Cell>
            <Table.Cell>
              <a href="#" className="font-medium text-cyan-600 hover:underline dark:text-cyan-500">
                Edit
              </a>
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    </div>
  );
}

export default User;
