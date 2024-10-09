import React, { useState } from "react";
import { Button, Checkbox, Table } from "flowbite-react";
import { FaTrashCan } from "react-icons/fa6";

function ParkingTableRow({ parking, onDeleteClick }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
      <Table.Cell className="p-4">
        <Checkbox />
      </Table.Cell>
      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
        {parking.parkingName}
      </Table.Cell>
      <Table.Cell>{parking.slotQty}</Table.Cell>
      <Table.Cell>0</Table.Cell>
      <Table.Cell>{`${parking.latitude || "N/a"}, ${
        parking.longitude || "N/a"
      }`}</Table.Cell>
      <Table.Cell>
        <Button
          onClick={() => onDeleteClick(parking.uuid)}
          className="bg-red-600 focus:ring-4 focus:ring-red-300"
        >
          <FaTrashCan className="mr-2 h-5 w-5" />
          Delete
        </Button>
      </Table.Cell>
    </Table.Row>
  );
}

export default ParkingTableRow;
