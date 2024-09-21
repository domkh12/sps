import React, { useState } from "react";
import { Button, Checkbox, Label, Modal, TextInput } from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";
import { onCloseModal } from "../../redux/feature/parking/parkingSlice";

function AddParking() {
  const openModal = useSelector((state) => state.parking.setOpenModal);
  const dispatch = useDispatch();
  const handleCloseModal = () => {
    dispatch(onCloseModal(false));
  };
  return (
    <Modal
      show={openModal}
      onClose={handleCloseModal}
      popup
      className="z-[9999] pt-[10%]"
    >
      <Modal.Header className="text-xl px-5 py-5">Add new parking</Modal.Header>
      <hr />
      <Modal.Body className="px-5 pt-3">
        <div className="grid grid-cols-2 gap-5">
          <div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="base" value="Parking name" />
              </div>
              <TextInput id="base" type="text" sizing="md" />
            </div>

            <div>
              <div className="mb-2 block">
                <Label htmlFor="base" value="Total Slot" />
              </div>
              <TextInput id="base" type="text" sizing="md" />
            </div>

            <div>
              <div className="mb-2 block">
                <Label htmlFor="base" value="Latitude" />
              </div>
              <TextInput id="base" type="text" sizing="md" />
            </div>
          </div>

          <div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="base" value="Longitude" />
              </div>
              <TextInput id="base" type="text" sizing="md" />
            </div>
           
          </div>
        </div>
      </Modal.Body>
      <hr />
      <Modal.Footer className="px-5">
        <Button className="bg-blue-700">Save</Button>
        <Button color="gray" onClick={handleCloseModal}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default AddParking;
