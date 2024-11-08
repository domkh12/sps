import { useEffect, useRef, useState } from "react";
import { RiImageAddLine } from "react-icons/ri";
import { Label } from "flowbite-react";
import { LuImagePlus } from "react-icons/lu";
import { GoDownload } from "react-icons/go";

function ImageUpload({ setImageFile, imageUri }) {
  const [image, setImage] = useState(imageUri);
  const [uploading, setUploading] = useState(false);
  const [alert, setAlert] = useState("");
  const [toggleImageDropdown, setToggleImageDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setToggleImageDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleFileChange = (event) => {
    const files = event.target.files || [];
    if (!files.length || !window.FileReader) {
      return;
    }

    if (files[0].size > 2 * 1024 * 1024) {
      setAlert("File size exceeds 2MB.");
      setToggleImageDropdown(false);
      setTimeout(() => setAlert(""), 3000);
      return;
    }

    if (/^image/.test(files[0].type)) {
      const reader = new FileReader();
      reader.readAsDataURL(files[0]);
      reader.onloadend = () => {
        setUploading(true);
        setImage(reader.result);
        setImageFile(files[0]);
        setToggleImageDropdown(false);
        setTimeout(() => {
          setUploading(false);
          const random = Math.random();
          if (random < 0.9) {
            setAlert("Profile image updated successfully");
          } else {
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

  const handleChangeClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const downloadImage = () => {
    if (imageUri) {
      // Open the imageUri in a new tab
      window.open(imageUri, "_blank");
      setToggleImageDropdown(false);
    } else if (image) {
      // Use the original filename of the uploaded image
      const uploadedFile = fileInputRef.current.files[0];
      const filename = uploadedFile ? uploadedFile.name : "uploaded_image";
      // Download the recently uploaded image
      const link = document.createElement("a");
      link.href = image;
      link.download = filename; // Specify a default filename for the uploaded image
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);    
      setToggleImageDropdown(false);  
    }
  };

  const content = (
    <div className="relative flex flex-col group w-[325px]">
      <Label className="mb-2">Image</Label>
      <div className="w-[325px] h-[187px] hover:border-gray-500 shrink-0 border-2 overflow-hidden rounded-lg border-gray-400 border-dashed p-1 group">
        {image ? (
          <img
            id="profilePic"
            className="w-full h-full object-contain bg-black rounded-lg"
            src={image}
            alt="Profile"
          />
        ) : (
          <div className="w-full h-full flex flex-col gap-2 items-center justify-center text-gray-700 group-hover:text-gray-500 rounded-lg">            
             <LuImagePlus className="text-2xl "/>
            No image available
          </div>
        )}
        <input
          ref={fileInputRef}
          className="uploadProfileInput opacity-0 absolute inset-0 cursor-pointer"
          type="file"
          name="profile_pic"
          id="vehicleImage"
          accept="image/*"
          onChange={handleFileChange}
          style={{ pointerEvents: image ? "none" : "auto" }}
        />
        {image && (
          <button
            className="inline-flex group-hover:opacity-100 opacity-0 absolute top-10 right-3 items-center p-2 bg-gray-100 text-sm font-medium text-center text-gray-900 rounded-full hover:bg-gray-200 focus:outline-none dark:text-white focus:ring-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700"
            type="button"
            onClick={() => setToggleImageDropdown(!toggleImageDropdown)}
          >
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 4 15"
            >
              <path d="M3.5 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 6.041a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 5.959a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
            </svg>
          </button>
        )}

        {toggleImageDropdown && image ? (
          <div
            ref={dropdownRef}
            className="z-10 transition-all inline-block absolute top-10 -right-32 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600"
          >
            <ul
              className="py-2 text-sm text-gray-700 dark:text-gray-200"
              aria-labelledby="dropdownMenuIconButton"
            >
              <li>
                <Label
                  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer"
                  onClick={handleChangeClick}
                >
                  <span className="flex justify-start gap-3">
                    <LuImagePlus />
                    Change
                  </span>
                </Label>
              </li>
              <li>
                <Label
                  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer"
                  onClick={downloadImage}
                >
                  <span className="flex justify-start gap-3">
                    <GoDownload />
                    Download
                  </span>
                </Label>
              </li>
            </ul>
          </div>
        ) : null}
      </div>
      {alert && (
        <small className="dark:text-gray-50 mt-2">{alert}</small>
      )}
    </div>
  );
  return content;
}

export default ImageUpload;
