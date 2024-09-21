import React, { useEffect, useState } from "react";
import { Breadcrumb, Button, Checkbox, Table } from "flowbite-react";
import { FaChartLine, FaEdit, FaEye, FaPlus, FaTrash } from "react-icons/fa";
import AddParking from "./AddParking";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteParkingByUuid,
  fetchParkingData,
  onOpenModal,
} from "../../redux/feature/parking/parkingSlice";
import { HiHome } from "react-icons/hi2";
import { Link } from "react-router-dom";
import DeletedSuccess from "./DeletedSuccess";
import DeleteConfirmModal from "./DeleteConfirmModal";
import SearchParking from "./SearchParking";

function ListParking() {
  const { parkingData, pagination, loading, error } = useSelector(
    (state) => state.parking
  );
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [parkingToDelete, setParkingToDelete] = useState(null);
  const [showDeletedSuccess, setShowDeletedSuccess] = useState(false);
  console.table(parkingData);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const dispatch = useDispatch();

  const handleOpenModal = () => {
    dispatch(onOpenModal(true));
  };
  useEffect(() => {
    dispatch(fetchParkingData({ pageNo: 1, pageSize: 20 }));
  }, [dispatch]);

  const handleDropdownDotsHorizontal = (uuid) => {
    setActiveDropdown(activeDropdown === uuid ? null : uuid);
  };

  const handleDeleteClick = (uuid) => {
    setParkingToDelete(uuid);
    setIsDeleteModalOpen(true);
    setActiveDropdown(null); // Close the dropdown
  };

  const handleConfirmDelete = () => {
    if (parkingToDelete) {
      dispatch(deleteParkingByUuid(parkingToDelete)).then(() => {
        // Refresh the parking data after successful deletion
        dispatch(fetchParkingData({ pageNo: 1, pageSize: 20 }));
        setShowDeletedSuccess(true);
        setTimeout(() => setShowDeletedSuccess(false), 3000);
      });
    }
    setIsDeleteModalOpen(false);
    setParkingToDelete(null);
  };

  return (
    <>
      <Breadcrumb aria-label="Default breadcrumb example">
        <Breadcrumb.Item>
          <Link
            to="/admin/dashboard"
            className="text-gray-800 dark:text-gray-300"
          >
            <HiHome className="inline-block mr-2 text-gray-800 dark:text-gray-300" />
            Home
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Parking</Breadcrumb.Item>
        <Breadcrumb.Item>Parking List</Breadcrumb.Item>
      </Breadcrumb>
      <div className="w-full flex justify-between py-5">
        <SearchParking/>
        <Button className="bg-blue-600" onClick={handleOpenModal}>
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
            <Table.HeadCell>Geographic</Table.HeadCell>
            <Table.HeadCell>
              <span className="sr-only">Edit</span>
            </Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y text-lg">
            {parkingData.map((parking) => (
              <Table.Row
                key={parking.uuid}
                className="bg-white dark:border-gray-700 dark:bg-gray-800"
              >
                <Table.Cell className="p-4">
                  <Checkbox />
                </Table.Cell>
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  {parking.parkingName}
                </Table.Cell>
                <Table.Cell>{parking.slotQty}</Table.Cell>
                <Table.Cell>0</Table.Cell>
                <Table.Cell>{`${parking.latitude}, ${parking.longitude}`}</Table.Cell>
                <Table.Cell>
                  <button
                    id={`dropdownMenuIconHorizontalButton-${parking.uuid}`}
                    data-dropdown-toggle={`dropdownDotsHorizontal-${parking.uuid}`}
                    onClick={() => handleDropdownDotsHorizontal(parking.uuid)}
                    className="inline-flex items-center p-2 text-sm font-medium text-center text-gray-900 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none dark:text-white focus:ring-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                    type="button"
                  >
                    <svg
                      className="w-5 h-5"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 16 3"
                    >
                      <path d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" />
                    </svg>
                  </button>

                  <div
                    id={`dropdownDotsHorizontal-${parking.uuid}`}
                    className={`z-10 ${
                      activeDropdown === parking.uuid ? "block" : "hidden"
                    } absolute bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600`}
                  >
                    <ul
                      className="py-2 text-sm text-gray-700 dark:text-gray-200"
                      aria-labelledby="dropdownMenuIconHorizontalButton"
                    >
                      <li>
                        <a
                          href="#"
                          className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                        >
                          <FaEdit className="inline-block mr-2 text-blue-500" />{" "}
                          Edit
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                        >
                          <FaEye className="inline-block mr-2 text-green-500" />{" "}
                          Preview
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                        >
                          <FaChartLine className="inline-block mr-2 text-yellow-500" />{" "}
                          Earnings
                        </a>
                      </li>
                    </ul>
                    <div className="py-2">
                      <button
                        onClick={() => handleDeleteClick(parking.uuid)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white w-full text-left"
                      >
                        <FaTrash className="inline-block mr-2 text-red-500" />{" "}
                        Delete
                      </button>
                    </div>
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
        <AddParking />
        {showDeletedSuccess && <DeletedSuccess />}
      </div>
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}

export default ListParking;
