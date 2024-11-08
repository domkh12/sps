import { useState } from "react";
import { FaUserAlt } from "react-icons/fa";
import { FaXmarksLines } from "react-icons/fa6";
import { IoMdImages } from "react-icons/io";
import { LiaImageSolid } from "react-icons/lia";
import {
  PiCaretLeftThin,
  PiCarThin,
  PiImageThin,
  PiPenThin,
  PiUserThin,
  PiXThin,
} from "react-icons/pi";
import { useNavigate } from "react-router-dom";

function ViewVehicleDetail({ vehicle }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigator = useNavigate();

  const handleImageClick = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleBtnBackClicked = () => {
    navigator("/dash/vehicles");
  };

  const handleBtnEditClicked = () => {
    navigator(`/dash/vehicles/${vehicle.uuid}`);
  };

  return (
    <div>
      <h1 className="text-2xl px-8 py-5 font-medium">Vehicle Detail</h1>
      <div className="flex justify-center items-center gap-1">
        <div className="w-8 h-[1px] bg-gray-600"></div>
        <p className="whitespace-nowrap dark:text-gray-200">
          Vehicle Information
        </p>
        <div className="w-full h-[1px] bg-gray-600"></div>
      </div>

      <div className="grid grid-cols-2">
        <div className="flex flex-col gap-5 pl-8 pt-5">
          <p className="flex justify-start items-center gap-3">
            <FaXmarksLines className="font-thin h-5 w-5" />
            <span>License Plate Number :</span>
            <span className="text-lg text-primary">{vehicle.numberPlate}</span>
          </p>

          <p className="flex justify-start items-center gap-3">
            <FaXmarksLines className="font-thin h-5 w-5" />
            <span>License Plate Name Kh :</span>
            <span className="text-lg text-primary">
              {vehicle.licensePlateKhName}
            </span>
          </p>

          <p className="flex justify-start items-center gap-3">
            <FaXmarksLines className="font-thin h-5 w-5" />
            <span>License Plate Name Eng :</span>
            <span className="text-lg text-primary">
              {vehicle.licensePlateEngName}
            </span>
          </p>

          <p className="flex justify-start items-center gap-3">
            <PiCarThin className="h-5 w-5" />
            <span>Vehicle Type :</span>
            <span className="text-lg text-primary">
              {vehicle.vehicleType.name}
            </span>
          </p>

          <p className="flex justify-start items-center gap-3">
            <PiCarThin className="font-thin h-5 w-5" />
            <span>Vehicle Make :</span>
            <span className="text-lg text-primary">{vehicle.vehicleMake}</span>
          </p>

          <p className="flex justify-start items-center gap-3">
            <PiCarThin className="font-thin h-5 w-5" />
            <span>Vehicle Model :</span>
            <span className="text-lg text-primary">{vehicle.vehicleModel}</span>
          </p>
        </div>

        <div className="flex flex-col gap-8 pt-5">
          <div className="flex flex-col w-[325px] md:w-full h-[150px] mb-5">
            <span className="mb-2">Preview</span>
            <div className="p-2 h-full shrink-0 bg-gradient-to-b from-blue-700 via-blue-600 to-blue-500 rounded-lg shadow-lg ">
              <div className="h-full grid grid-rows-12 grid-cols-1 justify-center items-center text-center py-2 rounded-md bg-gray-50 shadow-inner">
                <p className="text-blue-600 text-lg row-span-3">
                  {vehicle.licensePlateKhName || "xxxxx"}
                </p>
                <span className="text-blue-600 text-3xl row-span-6">
                  {vehicle.numberPlate || "xx-xxxx"}
                </span>
                <div className="h-[2px] rounded-full bg-blue-600 row-span-1 mx-3"></div>
                <p className="text-red-600 text-sm row-span-2">
                  {vehicle.licensePlateEngName || "xxxxx"}
                </p>
              </div>
            </div>
          </div>

          {vehicle.image ? (
            <div>
              <span className="mb-2">Image</span>
              <div
                className="relative flex w-[325px] h-[187px] cursor-pointer flex-col overflow-hidden rounded-lg bg-clip-border shadow-sm transition-opacity hover:opacity-90"
                onClick={handleImageClick}
              >
                <img
                  alt="nature"
                  className="h-full w-full object-cover object-center"
                  src={vehicle.image}
                />
              </div>
              {isDialogOpen && (
                <div
                  className="fixed inset-0 z-[999] grid h-screen w-screen place-items-center bg-black bg-opacity-60  backdrop-blur-sm transition-opacity duration-300"
                  onClick={handleCloseDialog}
                >
                  <div
                    className="relative m-4 w-2/4 rounded-lg bg-white shadow-sm"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <div className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-3">
                        <img
                          alt={vehicle.user.fullName}
                          src={vehicle.user.profileImage}
                          className="relative inline-block h-9 w-9 rounded-full object-cover object-center"
                        />
                        <div className="-mt-px flex flex-col">
                          <p className="text-sm text-slate-800 font-medium">
                            {vehicle.user.firstName +
                              " " +
                              vehicle.user.lastName}
                          </p>
                          <p className="text-xs font-normal text-slate-500">
                            {vehicle.user.fullName}
                          </p>
                        </div>
                      </div>

                      <button
                        className="hover:bg-gray-200 rounded-full p-2"
                        onClick={handleCloseDialog}
                      >
                        <PiXThin className="h-7 w-7" />
                      </button>
                    </div>
                    <div className="relative border-b border-t border-b-blue-gray-100 border-t-blue-gray-100 p-0 font-sans text-base font-light leading-relaxed text-blue-gray-500 antialiased bg-black">
                      <img
                        alt="nature"
                        className="h-[30rem] w-full object-contain object-center"
                        src={vehicle.image}
                      />
                    </div>
                    <div className="flex shrink-0 flex-wrap items-center justify-between p-4 text-blue-gray-500"></div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <div
                className="relative flex w-[325px] h-[187px] cursor-pointer flex-col overflow-hidden rounded-lg bg-clip-border shadow-sm transition-opacity hover:opacity-90 bg-gray-200 justify-center items-center"
                onClick={handleImageClick}
              >
                <IoMdImages className="h-24 w-24 text-gray-400" />
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex justify-center items-center gap-1 py-5">
        <div className="w-8 h-[1px] bg-gray-600"></div>
        <p className="whitespace-nowrap dark:text-gray-200">
          Owner Information
        </p>
        <div className="w-full h-[1px] bg-gray-600"></div>
      </div>

      <div className="grid grid-cols-2">
        <div className="flex flex-col gap-5 pl-8 pt-5">
          <p className="flex justify-start items-center gap-3">
            <PiUserThin className="font-thin h-5 w-5" />
            <span>First Name :</span>
            <span className="text-lg text-primary">
              {vehicle.user.firstName}
            </span>
          </p>

          <p className="flex justify-start items-center gap-3">
            <PiUserThin className="font-thin h-5 w-5" />
            <span>Last Name :</span>
            <span className="text-lg text-primary">
              {vehicle.user.lastName}
            </span>
          </p>

          <p className="flex justify-start items-center gap-3">
            <PiUserThin className="font-thin h-5 w-5" />
            <span>Full name :</span>
            <span className="text-lg text-primary">
              {vehicle.user.fullName}
            </span>
          </p>

          <p className="flex justify-start items-center gap-3">
            <PiCarThin className="font-thin h-5 w-5" />
            <span>Gender :</span>
            <span className="text-lg text-primary">
              {vehicle.user.gender.fullNameEnglish}
            </span>
          </p>

          <p className="flex justify-start items-center gap-3">
            <PiCarThin className="h-5 w-5" />
            <span>Date of Birth :</span>
            <span className="text-lg text-primary">
              {vehicle.user.dateOfBirth}
            </span>
          </p>

          <p className="flex justify-start items-center gap-3">
            <PiCarThin className="font-thin h-5 w-5" />
            <span>Email :</span>
            <span className="text-lg text-primary">{vehicle.user.email}</span>
          </p>

          <p className="flex justify-start items-center gap-3">
            <PiCarThin className="font-thin h-5 w-5" />
            <span>Role :</span>
            <span className="text-lg text-primary">
              {vehicle.user.roleNames.join(", ")}
            </span>
          </p>

          <p className="flex justify-start items-center gap-3">
            <PiCarThin className="font-thin h-5 w-5" />
            <span>Phone Number :</span>
            <span className="text-lg text-primary">
              {vehicle.user.phoneNumber}
            </span>
          </p>
        </div>

        <div className="flex flex-col gap-8">
          {vehicle.user.profileImage ? (
            <>
              <div className="flex flex-col w-[325px] md:w-full h-auto mb-5">
                <span className="mb-2">Profile Image</span>
                <div className="bg-black h-[25rem]">
                  <img
                    src={vehicle.user.profileImage}
                    alt=""
                    className="object-cover object-center h-[25rem]"
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="w-[325px] h-[25rem] mb-5">
                <span className="mb-2">Profile Image</span>
                <div className=" bg-gray-200 rounded-lg h-full w-full mx-auto grid justify-center items-center">
                  <FaUserAlt className="h-24 w-24 text-gray-400" />
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex justify-start items-center gap-5 p-8">
        <button className="px-4 py-2  border border-primary rounded-lg text-primary hover:bg-gray-200 flex justify-center items-center gap-2"
        onClick={handleBtnBackClicked}
        >
          <PiCaretLeftThin className="h-5 w-5" />
          Back
        </button>

        <button className="px-4 py-2 border border-primary rounded-lg text-gray-50  hover:bg-primary-hover bg-primary flex justify-center items-center gap-2"
        onClick={handleBtnEditClicked}
        >
          <PiPenThin className="h-5 w-5" />
          Edit
        </button>
      </div>
    </div>
  );
}

export default ViewVehicleDetail;
