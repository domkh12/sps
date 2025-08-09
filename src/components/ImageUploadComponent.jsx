import {Typography, useColorScheme} from "@mui/material";
import { useRef, useState } from "react";
import { BsCameraFill } from "react-icons/bs";
import useTranslate from "../hook/useTranslate";

function ImageUploadComponent({
  profileImageFile,
  setProfileImageFile,
  profileUrl,
}) {
  const profileRef = useRef(null);
  const [profileImageURL, setProfileImageURL] = useState(profileUrl || "");
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState(null);
  const { t } = useTranslate();
  const { mode } = useColorScheme();
  const isError = !!error;

  const handleClick = () => {
    profileRef.current.click();
  };

  const formatFileSize = (size) => {
    if (size) {
      return (size / 1024).toFixed(2) + " KB";
    }
    return null;
  };

  const handleImageChange = (event) => {
    setError(null);
    const file = event.target.files[0];
    setImageFile(file);
    if (!file) return;
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
    const maxSize = 3 * 1024 * 1024;
    if (!allowedTypes.includes(file.type)) {
      setError(t("fileTypeValidation"));
      return;
    }
    if (file.size > maxSize) {
      setError(t("fileSizeValidation"));
      return;
    }

    setProfileImageFile(file);
    const imageURL = URL.createObjectURL(file);
    setProfileImageURL(imageURL);
  };

  return (
    <>
      <div
        className={`${isError && "border-[#f44336]"} relative p-[6px] border border-dashed rounded-[16px] group`}
      >
        <div
          className={`bg-gray bg-opacity-5 w-full h-[160px] rounded-[16px] overflow-hidden flex justify-center items-center`}
        >
          {profileImageURL && (
            <>
              <img
                src={profileImageURL}
                alt="profile"
                className="object-cover w-full h-full"
              />
              <button
                onClick={handleClick}
                className={`absolute group-hover:block bg-black top-[6px] w-[97%] h-[160px] opacity-0 hover:bg-opacity-60 hover:opacity-100 rounded-[16px] `}
                type="button"
              >
                <div className="flex justify-center items-center flex-col gap-2">
                  <BsCameraFill className=" text-white w-7 h-7 " />
                  <span className="text-white text-sm">Upload photo</span>
                </div>
              </button>
            </>
          )}
        </div>
        {!profileImageFile && profileImageURL === "" && (
          <button
            onClick={handleClick}
            className={`absolute group-hover:block top-[6px] w-[97%] h-[160px]  rounded-[16px] ${isError ? "bg-[#F8DDDD] bg-opacity-100 hover:bg-opacity-80 " : "bg-black bg-opacity-10 hover:bg-opacity-5 "}`}
            type="button"
          >
            <div className="flex justify-center items-center flex-col gap-2 ">
              <BsCameraFill
                className={`${isError ? "text-[#f44336] text-opacity-100" : `${mode === "dark" ? "text-white" : "text-black"} text-opacity-40`} w-7 h-7 `}
              />
              <span
                className={`${isError ? "text-[#f44336] text-opacity-100" : `${mode === "dark" ? "text-white" : "text-black"} text-opacity-40`}  text-sm`}
              >
                Upload photo
              </span>
            </div>
          </button>
        )}

        <input
          type="file"
          ref={profileRef}
          className="hidden"
          onChange={handleImageChange}
          accept="image/jpeg, image/jpg, image/png, image/gif"
        />
      </div>
      <div className="flex justify-center items-center my-4">
        <Typography
          variant="caption"
          className=" text-opacity-60 text-center w-[170px]"
        >
          {t("imageValidation")}
        </Typography>
      </div>
      {isError ? (
        <div className="bg-[#f44336] rounded-[12px] text-wrap bg-opacity-15 border-[#f44336] border border-dashed p-[12px] w-full">
          <Typography variant="body2">
            {imageFile &&
              `./${imageFile.name} - ${formatFileSize(imageFile.size)}`}
          </Typography>
          <Typography variant="body2">{error}</Typography>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}

export default ImageUploadComponent;
