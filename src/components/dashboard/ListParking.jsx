import React, { useState } from "react";
import { Button, Checkbox, Table } from "flowbite-react";
import { FaPlus } from "react-icons/fa";
import AddParking from "./AddParking";

function ListParking() {
  const [openModal, setOpenModal] = useState(false);

  const setIsOpenModalFun = () => {
    setOpenModal(true);
  };

  return (
    <>
      <div className="w-full flex justify-end">
        <Button className="bg-blue-600" onClick={setIsOpenModalFun}>
          <FaPlus className="mr-2 h-5 w-5" />
          Add Parking
        </Button>
      </div>
      <div className="overflow-x-auto">
        <Table hoverable>
          <Table.Head>
            <Table.HeadCell className="p-4">
              <Checkbox />
            </Table.HeadCell>
            <Table.HeadCell>Parking Name</Table.HeadCell>
            <Table.HeadCell>Total Slot</Table.HeadCell>
            <Table.HeadCell>Available Slot</Table.HeadCell>
            <Table.HeadCell>
              <span className="sr-only">Edit</span>
            </Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y text-lg">
            <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
              <Table.Cell className="p-4">
                <Checkbox />
              </Table.Cell>
              <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                B01
              </Table.Cell>
              <Table.Cell>20</Table.Cell>
              <Table.Cell>10</Table.Cell>
              <Table.Cell>
                <a
                  href="#"
                  className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
                >
                  Edit
                </a>
              </Table.Cell>
            </Table.Row>
            <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
              <Table.Cell className="p-4">
                <Checkbox />
              </Table.Cell>
              <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                B02
              </Table.Cell>
              <Table.Cell>30</Table.Cell>
              <Table.Cell>4</Table.Cell>
              <Table.Cell>
                <a
                  href="#"
                  className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
                >
                  Edit
                </a>
              </Table.Cell>
            </Table.Row>
            <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
              <Table.Cell className="p-4">
                <Checkbox />
              </Table.Cell>
              <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                B03
              </Table.Cell>
              <Table.Cell>40</Table.Cell>
              <Table.Cell>5</Table.Cell>
              <Table.Cell>
                <a
                  href="#"
                  className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
                >
                  Edit
                </a>
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
        <AddParking openModal={openModal} setOpenModal={setOpenModal} />
      </div>
    </>
  );
}

export default ListParking;
