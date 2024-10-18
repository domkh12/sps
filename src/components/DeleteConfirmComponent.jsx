import { Button, Modal } from "flowbite-react";
import React from "react";
import { BsTrash3Fill } from "react-icons/bs";

function DeleteConfirmComponent({ isOpen, onClose, handleConfirmDelete }) {
  return (
    <>
      <Modal dismissible show={isOpen} onClose={onClose}>
        <Modal.Header className="bg-red-600">
          <p className="flex gap-2 text-gray-200">
            {" "}
            <BsTrash3Fill />
            <span>Confirm Deletion</span>
          </p>
        </Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
              Are you want to Delete?
            </p>
          </div>
          <div className="flex gap-2 justify-end">
            <Button color="gray" onClick={onClose}>
              Cancel
            </Button>
            <Button className="bg-red-600" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default DeleteConfirmComponent;
