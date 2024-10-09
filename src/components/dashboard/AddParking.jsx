import React, { useState } from "react";
import { Button, Label, Modal, TextInput } from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";
import { createParking, onCloseModal } from "../../redux/feature/parking/parkingSlice";

function AddParking() {
  const openModal = useSelector((state) => state.parking.setOpenModal);
  const dispatch = useDispatch();
  const [parkingName, setParkingName] = useState("");
  const [slotQty, setSlotQty] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  const handleCloseModal = () => {
    dispatch(onCloseModal(false));
  };
  

  const handleSave = () => {
    dispatch(createParking({ parkingName, slotQty, latitude, longitude }));     
    handleCloseModal();
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
                <Label htmlFor="parkingName" value="Parking name" />
              </div>
              <TextInput
                id="parkingName"
                type="text"
                sizing="md"
                value={parkingName}
                onChange={(e) => setParkingName(e.target.value)}
              />
            </div>

            <div>
              <div className="mb-2 block">
                <Label htmlFor="slotQty" value="Total Slot" />
              </div>
              <TextInput
                id="slotQty"
                type="text"
                sizing="md"
                value={slotQty}
                onChange={(e) => setSlotQty(e.target.value)}
              />
            </div>

            <div>
              <div className="mb-2 block">
                <Label htmlFor="latitude" value="Latitude" />
              </div>
              <TextInput
                id="latitude"
                type="text"
                sizing="md"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
              />
            </div>
          </div>

          <div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="longitude" value="Longitude" />
              </div>
              <TextInput
                id="longitude"
                type="text"
                sizing="md"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
              />
            </div>
          </div>
        </div>
      </Modal.Body>
      <hr />
      <Modal.Footer className="px-5">
        <Button className="bg-blue-700" onClick={handleSave}>
          Save
        </Button>
        <Button color="gray" onClick={handleCloseModal}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default AddParking;
