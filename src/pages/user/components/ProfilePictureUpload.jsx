import React, { useState } from "react";
import { FaCamera, FaRegUserCircle } from "react-icons/fa";
import userPlaceHolder from "/images/userPlaceHolder.svg";
import { Button, Spinner } from "flowbite-react";
import { WiCloudUp } from "react-icons/wi";
import { FaRegCircleUser } from "react-icons/fa6";
import { TbUserCircle } from "react-icons/tb";
import {
  PiUserCircleFill,
  PiUserCircleLight,
  PiUserCirclePlusLight,
} from "react-icons/pi";

function ProfilePictureUpload({ setProfileImageFile, imageUri }) {
  const [image, setImage] = useState(imageUri || userPlaceHolder);
  const [uploading, setUploading] = useState(false);
  const [alert, setAlert] = useState("");

  const handleFileChange = (event) => {
    const files = event.target.files || [];
    if (!files.length || !window.FileReader) {
      return;
    }

    if (files[0].size > 2 * 1024 * 1024) {
      setAlert("File size exceeds 2MB.");
      setTimeout(() => setAlert(""), 3000);
      return;
    }

    if (/^image/.test(files[0].type)) {
      const reader = new FileReader();
      reader.readAsDataURL(files[0]);
      reader.onloadend = () => {
        setUploading(true);
        setImage(reader.result);
        setProfileImageFile(files[0]);

        setTimeout(() => {
          setUploading(false);
          const random = Math.random();
          if (random < 0.9) {
            setAlert("Profile image updated successfully");
          } else {
            setImage(userPlaceHolder);
            setAlert(
              "There was an error while uploading! Please try again later."
            );
          }
          setTimeout(() => setAlert(""), 3000);
        }, 1500);
      };
    } else {
      setAlert("Please choose a valid image.");
      setTimeout(() => setAlert(""), 3000);
    }
  };

  const content = (
    <div className="flex flex-col items-center w-full justify-center sm:items-center sm:justify-center">
      <div className="relative rounded-full w-36 h-36 overflow-hidden mb-5 flex justify-start items-start sm:items-center sm:justify-center">
        <img
          id="profilePic"
          className="w-full h-full object-cover"
          src={image}
          alt="Profile"
        />

        <input
          className="uploadProfileInput opacity-0 absolute inset-0"
          type="file"
          name="profile_pic"
          id="newProfilePhoto"
          accept="image/*"
          onChange={handleFileChange}
        />
        <label
          htmlFor="newProfilePhoto"
          className={`upload-file-block absolute inset-0 flex flex-col items-center justify-center bg-gray-700 bg-opacity-70 text-white transition-opacity duration-200 opacity-0 ${
            uploading ? "opacity-100" : ""
          } hover:opacity-100 cursor-pointer`}
        >
          {uploading ? (
            <Spinner color="purple" />
          ) : (
            <div className="text-center">
              <div className="mb-2">
                <i className="fa fa-camera fa-2x"></i>
              </div>
              <div className="text-uppercase">
                <FaCamera className="mx-auto" />
                Update <br /> Profile Photo
              </div>
            </div>
          )}
        </label>
      </div>
      {alert && <small className="dark:text-gray-50">{alert}</small>}
      <Button
        className="mt-2 bg-primary hover:bg-primary-hover focus:ring-0 text-white"
        onClick={() => document.getElementById("newProfilePhoto").click()}
      >
        <p className="flex justify-start items-center gap-2">
          <WiCloudUp className="text-2xl" />
          <span> Upload Profile</span>
        </p>
      </Button>
    </div>
  );
  return content;
}

export default ProfilePictureUpload;
