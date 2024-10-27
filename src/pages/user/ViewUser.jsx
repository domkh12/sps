import React from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { selectUserById } from "../../redux/feature/users/userApiSlice";
import { Button, Label } from "flowbite-react";
import { TbUser } from "react-icons/tb";
import { LuCalendarDays } from "react-icons/lu";
import { BsGenderAmbiguous } from "react-icons/bs";
import { IoCallOutline } from "react-icons/io5";
import userPlaceHolder from "/images/userPlaceHolder.svg";
import { FaEdit } from "react-icons/fa";

function ViewUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useSelector((state) => selectUserById(state, id));
  var handleEdit = () => navigate(`/dash/users/${id}`);
  console.log(user);
  return (
    <>
      <h1>User Details</h1>

      <img src={user.profileImage || userPlaceHolder} alt="" />

      <Button
        onClick={handleEdit}
        className="bg-primary hover:bg-primary-hover ring-transparent"
      >
        <FaEdit /> Edit
      </Button>

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
    </>
  );
}

export default ViewUser;
