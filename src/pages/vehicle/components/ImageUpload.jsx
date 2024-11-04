import { useState } from "react";
import { RiImageAddLine } from "react-icons/ri";
import { Label } from "flowbite-react";

function ImageUpload({ setImageFile, imageUri }) {
  const [image, setImage] = useState(imageUri);
  const [uploading, setUploading] = useState(false);
  const [alert, setAlert] = useState("");
  const [toggleImageDropdown, setToggleImageDropdown] = useState(false);

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
        setImageFile(files[0]);

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

  const content = (
    <div className="flex flex-col">
      <Label className="mb-2">Image</Label>
      <div className="relative w-[325px] h-[187px] hover:border-gray-800 shrink-0 border-2 group overflow-hidden rounded-lg border-gray-400 border-dashed p-1">
        {image ? (
          <>
            <img
              id="profilePic"
              className="w-full h-full object-contain bg-black rounded-lg"
              src={image}
              alt="Profile"
            />
            <input
              className="uploadProfileInput opacity-0 absolute inset-0 cursor-pointer"
              type="file"
              name="profile_pic"
              id="newProfilePhoto"
              accept="image/*"
              onChange={handleFileChange}
            />
            <button
              className="inline-flex group-hover:opacity-100 opacity-0 absolute top-1 right-1 items-center p-2 bg-gray-100 text-sm font-medium text-center text-gray-900 rounded-full hover:bg-gray-200 focus:outline-none dark:text-white focus:ring-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700"
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
            {toggleImageDropdown ? (
              <>
                <div className="z-10 transition-all inline-block absolute top-11 right-0 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600">
                  <ul
                    className="py-2 text-sm text-gray-700 dark:text-gray-200"
                    aria-labelledby="dropdownMenuIconButton"
                  >
                    <li>
                      <a
                        href="#"
                        className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                      >
                        Dashboard
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                      >
                        Settings
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                      >
                        Earnings
                      </a>
                    </li>
                  </ul>
                  <div className="py-2">
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                    >
                      Separated link
                    </a>
                  </div>
                </div>
              </>
            ) : (
              <></>
            )}
          </>
        ) : (
          <>
            {" "}
            {alert ? (
              <small className="dark:text-gray-50">{alert}</small>
            ) : (
              <>
                <label
                  htmlFor="newProfilePhoto"
                  className="h-full flex justify-center items-center bg-gray-50 rounded-md dark:bg-gray-800"
                >
                  <div className="text-center text-gray-500">
                    <div className="text-uppercase">
                      <RiImageAddLine className="mx-auto mb-2" />
                      Upload Image
                    </div>
                  </div>
                  <input
                    className="uploadProfileInput opacity-0 absolute inset-0 cursor-pointer"
                    type="file"
                    name="profile_pic"
                    id="newProfilePhoto"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </label>
              </>
            )}
          </>
        )}
        
      </div>
      {alert && <small className="dark:text-gray-50 text-red-600">{alert}</small>}
    </div>
  );
  return content;
}

export default ImageUpload;
