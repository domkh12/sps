import React, { useEffect, useState } from "react";
import { Button, Checkbox, Pagination, Table } from "flowbite-react";
import { FaPlus } from "react-icons/fa";
import AddParking from "./AddParking";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteParkingByUuid,
  fetchParkingData,
  onOpenModal,
  searchParking,
} from "../../redux/feature/parking/parkingSlice";
import DeletedSuccess from "./DeletedSuccess";
import DeleteConfirmModal from "./DeleteConfirmModal";
import SearchParking from "./SearchParking";
import ParkingTableRow from "./ParkingTableRow";

function ListParking() {
  const { parkingData, pagination } = useSelector((state) => state.parking);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [parkingToDelete, setParkingToDelete] = useState(null);
  const [showDeletedSuccess, setShowDeletedSuccess] = useState(false);
  const [searchName, setSearchName] = useState("");

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchParkingData({ pageNo: 1, pageSize: 10 }));
  }, [dispatch]);

  const handleDeleteClick = (uuid) => {
    setParkingToDelete(uuid);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (parkingToDelete) {
      dispatch(deleteParkingByUuid(parkingToDelete)).then(() => {
        // dispatch(fetchParkingData({ pageNo: 1, pageSize: 10 }));
        setShowDeletedSuccess(true);
        setTimeout(() => setShowDeletedSuccess(false), 3000);
      });
    }
    setIsDeleteModalOpen(false);
    setParkingToDelete(null);
  };

  const handleSearch = (name) => {
    setSearchName(name);
    if (name) {
      dispatch(searchParking({ name: name, pageNo: 1, pageSize: 10 }));
    } else {
      dispatch(fetchParkingData({ pageNo: 1, pageSize: 10 }));
    }
  };

  return (
    <>
      <div className="w-full flex justify-between p-5 md:px-2">
        <SearchParking onSearch={handleSearch} />
        <Button
          className="bg-blue-600 whitespace-nowrap"
          onClick={() => dispatch(onOpenModal(true))}
        >
          <FaPlus className="md:mr-0 mr-2 h-5 w-5" />
          <span className="inline md:hidden">Add Parking</span>
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
              <ParkingTableRow
                key={parking.uuid}
                parking={parking}
                onDeleteClick={handleDeleteClick}
              />
            ))}
          </Table.Body>
        </Table>
        <div className="flex justify-between items-center px-5 py-5">
          <span className="text-sm text-gray-700 dark:text-gray-400">
            Showing{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              1
            </span>{" "}
            to{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              10
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              {pagination.totalPages}
            </span>{" "}
            Entries
          </span>
          <Pagination
            currentPage={pagination.number + 1}
            totalPages={pagination.totalPages}
            onPageChange={(pageNo) =>
              dispatch(fetchParkingData({ pageNo, pageSize: 10 }))
            }
          />
        </div>
        <AddParking />
        {showDeletedSuccess && <DeletedSuccess />}
      </div>
      {showDeletedSuccess && <DeletedSuccess />}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}

export default ListParking;
