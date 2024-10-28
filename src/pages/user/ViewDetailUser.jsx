import React, { useState } from "react";
import { Button, Card, Label, Modal } from "flowbite-react";
import { TbUser } from "react-icons/tb";
import { LuCalendarDays, LuEye } from "react-icons/lu";
import { BsGenderAmbiguous } from "react-icons/bs";
import { IoCallOutline } from "react-icons/io5";
import userPlaceHolder from "/images/userPlaceHolder.svg";
import { FaCamera, FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function ViewDetailUser({ user }) {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  const handleImageClick = () => {
    setSelectedImage(user.profileImage || userPlaceHolder);
    setIsModalOpen(true);
  };
  console.log("selectedImage", selectedImage);
  const handleEdit = () => navigate(`/dash/users/${user.uuid}`);
  return (
    <>
      <h1>User Details</h1>
      <div className="flex justify-center items-center"> 
        <Card className="h-full">
          <div
            className="relative rounded-full w-36 h-36 overflow-hidden mb-5 flex justify-start items-start sm:items-center sm:justify-center"
            onClick={handleImageClick}
          >
            <img
              src={user.profileImage || userPlaceHolder}
              alt=""
              className="h-36 w-36 rounded-full object-cover object-center"
            />
            <label
              htmlFor="newProfilePhoto"
              className={`upload-file-block absolute inset-0 flex flex-col items-center justify-center bg-gray-700 bg-opacity-70 text-white transition-opacity duration-200 opacity-0 hover:opacity-100 cursor-pointer`}
            >
              <div className="text-center">
                <div className="mb-2">
                  <i className="fa fa-camera fa-2x"></i>
                </div>
                <div>
                  <LuEye className="mx-auto" />
                </div>
              </div>
            </label>
          </div>
        </Card>
        <Card>
          <div className="flex justify-between items-center">
            <Button
              onClick={handleEdit}
              className="bg-primary hover:bg-primary-hover ring-transparent"
            >
              <FaEdit className="mr-2" />
              <span>Edit</span>
            </Button>
            <Modal show={isModalOpen} onClick={() => setIsModalOpen(false)}>
              <Modal.Body onClick={(e) => e.stopPropagation()}>
                <img
                  src={selectedImage}
                  alt="Preview"
                  className="w-full h-auto"
                />
              </Modal.Body>
            </Modal>
          </div>

          <div className="flex justify-center items-center gap-1">
            <div className="w-4 h-[1px] bg-gray-600"></div>
            <p className="whitespace-nowrap dark:text-gray-200">
              Contact Information
            </p>
            <div className="w-full h-[1px] bg-gray-600"></div>
          </div>

          <Label className="flex gap-2 mb-2 justify-start items-center">
            <span className="flex gap-2">
              <IoCallOutline />
              Phone Number :
            </span>
            <span className="text-primary font-medium text-base">
              {user.phoneNumber}
            </span>
          </Label>

          <div className="flex justify-center items-center gap-1">
            <div className="w-4 h-[1px] bg-gray-600"></div>
            <p className="whitespace-nowrap dark:text-gray-200">
              Personal Information
            </p>
            <div className="w-full h-[1px] bg-gray-600"></div>
          </div>

          <Label className="flex gap-2 mb-2 justify-start items-center">
            <span className="flex gap-2">
              <TbUser />
              First Name :
            </span>
            <span className="text-primary font-medium text-base">
              {user.firstName}
            </span>
          </Label>

          <Label className="flex gap-2 mb-2 justify-start items-center">
            <span className="flex gap-2">
              <TbUser />
              Last Name :
            </span>
            <span className="text-primary font-medium text-base">
              {user.lastName}
            </span>
          </Label>

          <Label className="flex gap-2 mb-2 justify-start items-center">
            <span className="flex gap-2">
              <TbUser />
              Full Name :
            </span>
            <span className="text-primary font-medium text-base">
              {user.fullName}
            </span>
          </Label>

          <Label className="flex gap-2 mb-2 justify-start items-center">
            <span className="flex gap-2">
              <LuCalendarDays />
              Full Name :
            </span>
            <span className="text-primary font-medium text-base">
              {user.dateOfBirth}
            </span>
          </Label>

          <Label className="flex gap-2 mb-2 justify-start items-center">
            <span className="flex gap-2">
              <BsGenderAmbiguous />
              Gender :
            </span>
            <span className="text-primary font-medium text-base">
              {user.gender}
            </span>
          </Label>
        </Card>
      </div>
    </>
  );
}

export default ViewDetailUser;
