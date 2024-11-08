import React, { useState } from "react";
import { Button, Card, Label, Modal, ModalHeader } from "flowbite-react";
import { TbAccessibleOff, TbUser } from "react-icons/tb";
import { LuCalendarDays, LuEye } from "react-icons/lu";
import { BsGenderAmbiguous } from "react-icons/bs";
import {
  IoCallOutline,
  IoMailOutline,
  IoReturnDownBackOutline,
} from "react-icons/io5";
import userPlaceHolder from "/images/userPlaceHolder.svg";
import { FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { PiCellSignalFullThin } from "react-icons/pi";

function ViewDetailUser({ user }) {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [roles, setRoles] = useState(user.roleNames);
  console.log(user)

  const handleImageClick = () => {
    setSelectedImage(user.profileImage || userPlaceHolder);
    setIsModalOpen(true);
  };

  const handleEdit = () => navigate(`/dash/users/${user.uuid}`);
  const handleBack = () => navigate(`/dash/users`);

  const Cardtheme = {
    root: {
      base: "flex rounded-lg border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800",
      children: "flex h-full flex-col justify-center gap-4 p-0", // Changed p-6 to p-0
      horizontal: {
        off: "flex-col",
        on: "flex-col md:max-w-xl md:flex-row",
      },
      href: "hover:bg-gray-100 dark:hover:bg-gray-700",
    },
    img: {
      base: "",
      horizontal: {
        off: "rounded-t-lg",
        on: "h-96 w-full rounded-t-lg object-cover md:h-auto md:w-48 md:rounded-none md:rounded-l-lg",
      },
    },
  };

  return (
    <>
      <h1 className="text-2xl font-medium dark:text-gray-100 p-5">
        User Details
      </h1>
      <div className="flex [@media(max-width:1150px)]:flex-col pb-5 gap-5 mx-5 overflow-auto">
        <Card
          className="flex p-5 justify-center items-center grow-0 shrink-0 overflow-auto"
          theme={Cardtheme}
        >
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
          <div>
            <Label className="flex gap-2 mb-2 justify-start items-center">
              <span className="flex gap-2 text-nowrap">
                <TbUser />
                Username :
              </span>
              <span className="text-primary font-medium text-base">
                {user.fullName}
              </span>
            </Label>

            <Label className="flex gap-2 mb-2 justify-start items-center">
              <span className="flex gap-2 text-nowrap">
                <IoMailOutline />
                Email :
              </span>
              <span className="text-primary font-medium text-base">
                {user.email}
              </span>
            </Label>

            <Label className="flex gap-2 mb-2 justify-start items-center">
              <span className="flex gap-2 text-nowrap">
                <TbUser />
                Role :
              </span>
              <span className="text-primary font-medium text-base">
                {roles.join(", ")}
              </span>
            </Label>
          </div>
          <Modal
            show={isModalOpen}
            onClick={() => setIsModalOpen(false)}
            popup
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Modal.Header />
            <Modal.Body>
              <div onClick={(e) => e.stopPropagation()}>
                <img
                  src={selectedImage}
                  alt="Preview"
                  className="w-full h-auto"
                />
              </div>
            </Modal.Body>
          </Modal>
        </Card>
        <Card className="grow overflow-auto" theme={Cardtheme}>
          <div className="flex gap-5 justify-end items-center pt-5 px-5">
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
          </div>
          <div className="w-full">
            <div className="flex justify-center items-center gap-1">
              <div className="w-10 h-[0.5px] bg-gray-600"></div>
              <p className="whitespace-nowrap dark:text-gray-200">
                Contact Information
              </p>
              <div className="w-full h-[0.5px] bg-gray-600"></div>
            </div>

            <div className="grid grid-cols-2 [@media(max-width:1150px)]:grid-cols-1 place-content-stretch px-10 py-5 items-center gap-3">
              <Label className="flex gap-2 justify-start items-center text-nowrap">
                <span className="flex gap-2 text-nowrap">
                  <IoMailOutline />
                  Email :
                </span>
                <span className="text-primary font-medium text-base">
                  {user.email}
                </span>
              </Label>

              <Label className="flex gap-2 justify-start items-center text-nowrap">
                <span className="flex gap-2 text-nowrap">
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

            <div className="grid grid-cols-2 [@media(max-width:1150px)]:grid-cols-1 place-content-stretch gap-3 px-10 py-5 items-center">
              <Label className="flex gap-2 justify-start items-center">
                <span className="flex gap-2 text-nowrap">
                  <TbUser />
                  First Name :
                </span>
                <span className="text-primary font-medium text-base">
                  {user.firstName}
                </span>
              </Label>

              <Label className="flex gap-2 justify-start items-center">
                <span className="flex gap-2 text-nowrap">
                  <TbUser />
                  Last Name :
                </span>
                <span className="text-primary font-medium text-base">
                  {user.lastName}
                </span>
              </Label>

              <Label className="flex gap-2 justify-start items-center text-nowrap">
                <span className="flex gap-2 text-nowrap">
                  <TbUser />
                  Full Name :
                </span>
                <span className="text-primary font-medium text-base">
                  {user.fullName}
                </span>
              </Label>

              <Label className="flex gap-2 justify-start items-center text-nowrap">
                <span className="flex gap-2 text-nowrap">
                  <LuCalendarDays />
                  Date of Birth :
                </span>
                <span className="text-primary font-medium text-base">
                  {user.dateOfBirth}
                </span>
              </Label>

              <Label className="flex gap-2 justify-start items-center text-nowrap">
                <span className="flex gap-2 text-nowrap">
                  <BsGenderAmbiguous />
                  Gender :
                </span>
                <span className="text-primary font-medium text-base">
                  {user.gender.fullNameEnglish}
                </span>
              </Label>

              <Label className="flex gap-2 justify-start items-center text-nowrap">
                <span className="flex gap-2 text-nowrap">
                  <TbAccessibleOff />
                  Deleted :
                </span>
                <span className="text-primary font-medium text-base">
                {user.isDeleted ? "Yes" : "No"}
                </span>
              </Label>

              <Label className="flex gap-2 justify-start items-center text-nowrap">
                <span className="flex gap-2 justify-start items-center text-nowrap">
                  <PiCellSignalFullThin className="h-4 w-4" />
                  Active :
                </span>
                <span className="text-primary font-medium text-base">
                {user.status}
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
