import React, { useState } from "react";
import { Button, Card, Label, Modal } from "flowbite-react";
import { TbUser } from "react-icons/tb";
import { LuCalendarDays, LuEye } from "react-icons/lu";
import { BsGenderAmbiguous } from "react-icons/bs";
import {
  IoCallOutline,
  IoMailOutline,
  IoReturnDownBackOutline,
} from "react-icons/io5";
import userPlaceHolder from "/images/userPlaceHolder.svg";
import { FaCamera, FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function ViewDetailUser({ user }) {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [roles, setRoles] = useState(user.roleNames);

  const handleImageClick = () => {
    setSelectedImage(user.profileImage || userPlaceHolder);
    setIsModalOpen(true);
  };

  const handleEdit = () => navigate(`/dash/users/${user.uuid}`);
  const handleBack = () => navigate(`/dash/users`);
  return (
    <>
      <h1 className="text-2xl font-medium dark:text-gray-100 p-5">
        User Details
      </h1>
      <div className="grid grid-cols-4 md:grid-rows-2 pb-5 gap-x-5 mx-5 md:grid-cols-1 md:gap-y-5">
        <Card className="flex justify-center items-center md:col-span-4 ">
          <div
            className="relative rounded-full w-36 h-36 overflow-hidden mb-5 flex justify-start items-start sm:items-center sm:justify-center mx-auto"
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
          <Label className="flex gap-2 mb-2 justify-start items-center">
            <span className="flex gap-2">
              <TbUser />
              Username :
            </span>
            <span className="text-primary font-medium text-base">
              {user.fullName}
            </span>
          </Label>

          <Label className="flex gap-2 mb-2 justify-start items-center">
            <span className="flex gap-2">
              <IoMailOutline />
              Email :
            </span>
            <span className="text-primary font-medium text-base">
              {user.email}
            </span>
          </Label>

          <Label className="flex gap-2 mb-2 justify-start items-center">
            <span className="flex gap-2">
              <TbUser />
              Role :
            </span>
            <span className="text-primary font-medium text-base">
              {roles.join(", ")}
            </span>
          </Label>
        </Card>
        <Card className="col-span-3 relative md:col-span-4">
          <div className="flex gap-5 absolute top-5 right-5">
            <Button
              onClick={handleBack}
              className="border border-primary text-primary ring-transparent"
            >
              <IoReturnDownBackOutline className="mr-2" />
              <span>Back</span>
            </Button>
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
          <div className="absolute top-[4.5rem] left-0 w-full">
            <div className="flex justify-center items-center gap-1">
              <div className="w-10 h-[0.5px] bg-gray-600"></div>
              <p className="whitespace-nowrap dark:text-gray-200">
                Contact Information
              </p>
              <div className="w-full h-[0.5px] bg-gray-600"></div>
            </div>

            <div className="grid grid-cols-2 px-10 py-5 items-center justify-center gap-y-3">
              <Label className="flex gap-2 justify-start items-center">
                <span className="flex gap-2">
                  <IoMailOutline />
                  Email :
                </span>
                <span className="text-primary font-medium text-base">
                  {user.email}
                </span>
              </Label>

              <Label className="flex gap-2 justify-start items-center">
                <span className="flex gap-2">
                  <IoCallOutline />
                  Phone Number :
                </span>
                <span className="text-primary font-medium text-base">
                  {user.phoneNumber}
                </span>
              </Label>
            </div>

            <div className="flex justify-center items-center gap-1">
              <div className="w-10 h-[0.5px] bg-gray-600"></div>
              <p className="whitespace-nowrap dark:text-gray-200">
                Personal Information
              </p>
              <div className="w-full h-[0.5px] bg-gray-600"></div>
            </div>

            <div className="grid grid-cols-2 px-10 py-5 items-center justify-center gap-y-3">
              <Label className="flex gap-2 justify-start items-center">
                <span className="flex gap-2">
                  <TbUser />
                  First Name :
                </span>
                <span className="text-primary font-medium text-base">
                  {user.firstName}
                </span>
              </Label>

              <Label className="flex gap-2 justify-start items-center">
                <span className="flex gap-2">
                  <TbUser />
                  Last Name :
                </span>
                <span className="text-primary font-medium text-base">
                  {user.lastName}
                </span>
              </Label>

              <Label className="flex gap-2 justify-start items-center">
                <span className="flex gap-2">
                  <TbUser />
                  Full Name :
                </span>
                <span className="text-primary font-medium text-base">
                  {user.fullName}
                </span>
              </Label>

              <Label className="flex gap-2 justify-start items-center">
                <span className="flex gap-2">
                  <LuCalendarDays />
                  Full Name :
                </span>
                <span className="text-primary font-medium text-base">
                  {user.dateOfBirth}
                </span>
              </Label>

              <Label className="flex gap-2 justify-start items-center">
                <span className="flex gap-2">
                  <BsGenderAmbiguous />
                  Gender :
                </span>
                <span className="text-primary font-medium text-base">
                  {user.gender}
                </span>
              </Label>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}

export default ViewDetailUser;
