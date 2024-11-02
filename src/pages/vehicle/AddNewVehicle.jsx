import {
  Button,
  Checkbox,
  Label,
  Modal,
  Radio,
  TextInput,
  useThemeMode,
} from "flowbite-react";
import { Form, Formik } from "formik";
import { IoReturnDownBackOutline } from "react-icons/io5";
import { LuCar, LuRectangleHorizontal, LuSave } from "react-icons/lu";
import { MdOutlineColorLens } from "react-icons/md";
import { PiCarThin } from "react-icons/pi";
import { TbUser } from "react-icons/tb";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import ImageUpload from "./components/ImageUpload";
import { FaChevronDown } from "react-icons/fa";
import { useSelector } from "react-redux";
import { selectAllFullNameUsers } from "../../redux/feature/users/userApiSlice";
import { FiUserPlus } from "react-icons/fi";
import { useEffect, useRef, useState } from "react";
import { selectAllVehicleTypes } from "../../redux/feature/vehicles/vehicleTypeApiSlice";
import { useAddNewVehicleMutation } from "../../redux/feature/vehicles/vehicleApiSlice";
import { toast } from "react-toastify";
import { useUploadImageMutation } from "../../redux/feature/uploadImage/uploadImageApiSlice";

function AddNewVehicle() {
  const navigator = useNavigate();
  const { mode } = useThemeMode();
  const usersState = useSelector((state) => selectAllFullNameUsers(state));
  const vehicleTypes = useSelector((state) => selectAllVehicleTypes(state));
  const [toggleOwner, setToggleOwner] = useState(false);
  const [toggleVehicleType, setToggleVehicleType] = useState(false);
  const ownerRef = useRef(null);
  const vehicleTypeRef = useRef(null);
  const [selectedUsers, setSelectedUsers] = useState();
  const [selectedVehicleType, setSelectedVehicleType] = useState();
  const [imageFile, setImageFile] = useState(null);
  console.log(imageFile);
  const [addNewVehicle, { isSuccess, isLoading, isError, error }] =
    useAddNewVehicleMutation();

  const [uploadImage] = useUploadImageMutation();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ownerRef.current && !ownerRef.current.contains(event.target)) {
        setToggleOwner(false);
      }
      if (
        vehicleTypeRef.current &&
        !vehicleTypeRef.current.contains(event.target)
      ) {
        setToggleVehicleType(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isSuccess) {
      navigator("/dash/vehicles");

      toast.success("Success", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  }, [isSuccess, navigator]);

  useEffect(() => {
    if (isError) {
      toast.error(`${error?.data?.error?.description}`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  }, [isError]);

  const validationSchema = Yup.object().shape({
    plateNameKh: Yup.string()
      .matches(/^[\u1780-\u17FF\s]+$/, "Only Khmer characters are allowed")
      .required("License Plate Kh Name is required"),
    plateNameEng: Yup.string()
      .matches(/^[A-Za-z\s]+$/, "Only English characters are allowed")
      .required("License Plate Eng Name is required"),
    plateNumber: Yup.string()
      .min(2, "Plate Number must be at least 2 characters")
      .max(20, "Plate Number cannot exceed 20 characters")
      .required("License Plate Number is required"),
    type: Yup.string().required("Vehicle Type is required"),
    owner: Yup.string().required("Owner is required"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const formData = new FormData();
      let profileImageUri = null;
      if (imageFile) {
        formData.append("file", imageFile);
        const uploadResponse = await uploadImage(formData).unwrap();
        profileImageUri = uploadResponse.uri;
      }

      await addNewVehicle({
        numberPlate: values.plateNumber,
        licensePlateKhName: values.plateNameKh,
        licensePlateEngName: values.plateNameEng,
        vehicleMake: values.make,
        vehicleModel: values.model,
        color: values.color,
        userId: selectedUsers,
        vehicleTypeId: selectedVehicleType,
        image: profileImageUri,
      });
    } catch (error) {
    } finally {
      setSubmitting(false);
    }
  };

  const handleBtnBackClicked = () => {
    navigator("/dash/vehicles");
  };
  
  const content = (
    <>
      <h2 className="text-2xl font-medium  dark:text-gray-100 p-5">
        Create Vehicle
      </h2>
      <Formik
        initialValues={{
          plateNumber: "",
          plateNameKh: "",
          plateNameEng: "",
          color: "#000000",
          make: "",
          model: "",
          type: "",
          owner: "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({
          values,
          touched,
          errors,
          handleChange,
          handleBlur,
          setFieldValue,
        }) => {
          return (
            <Form className="flex flex-col gap-y-5 pb-8">
              <div className="flex justify-center items-center gap-1">
                <div className="w-4 h-[1px] bg-gray-600"></div>
                <p className="whitespace-nowrap dark:text-gray-200">
                  Vehicle Information
                </p>
                <div className="w-full h-[1px] bg-gray-600"></div>
              </div>
              <div className="grid lg:grid-cols-1 gap-x-5 px-5">
                <div className="grid gap-5">
                  <section className="grid grid-cols-2 gap-x-10 gap-y-5 lg:grid-cols-1">
                    <div className="grid grid-cols-1 gap-5 justify-between">
                      <div>
                        <Label className="flex gap-2 mb-2">
                          <LuRectangleHorizontal />
                          License Plate Number
                          <span className="text-red-600">*</span>
                        </Label>
                        <TextInput
                          placeholder="Enter Plate Number"
                          style={{
                            backgroundColor:
                              mode === "dark" ? "#1f2937" : "#f9fafb",
                            color: mode === "dark" ? "white" : "#1f2937",
                          }}
                          id="plateNumber"
                          name="plateNumber"
                          type="text"
                          autoComplete="off"
                          value={values.plateNumber}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          color={
                            errors.plateNumber && touched.plateNumber
                              ? "failure"
                              : "default"
                          }
                        />
                        {errors.plateNumber && touched.plateNumber && (
                          <small className="text-red-600">
                            {errors.plateNumber}
                          </small>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-5">
                        <div>
                          <Label className="flex gap-2 mb-2">
                            <LuRectangleHorizontal />
                            License Plate Kh Name
                            <span className="text-red-600">*</span>
                          </Label>
                          <TextInput
                            placeholder="Enter Plate Kh Name"
                            style={{
                              backgroundColor:
                                mode === "dark" ? "#1f2937" : "#f9fafb",
                              color: mode === "dark" ? "white" : "#1f2937",
                            }}
                            id="plateNameKh"
                            name="plateNameKh"
                            type="text"
                            autoComplete="off"
                            value={values.plateNameKh}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            color={
                              errors.plateNameKh && touched.plateNameKh
                                ? "failure"
                                : "default"
                            }
                          />
                          {errors.plateNameKh && touched.plateNameKh && (
                            <small className="text-red-600">
                              {errors.plateNameKh}
                            </small>
                          )}
                        </div>
                        <div>
                          <Label className="flex gap-2 mb-2">
                            <LuRectangleHorizontal className="#f9fafb" />
                            License Plate Eng Name
                            <span className="text-red-600">*</span>
                          </Label>
                          <TextInput
                            placeholder="Enter Plate Eng Name"
                            style={{
                              backgroundColor:
                                mode === "dark" ? "#1f2937" : "#f9fafb",
                              color: mode === "dark" ? "white" : "#1f2937",
                            }}
                            id="plateNameEng"
                            name="plateNameEng"
                            type="text"
                            autoComplete="off"
                            value={values.plateNameEng}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            color={
                              errors.plateNameEng && touched.plateNameEng
                                ? "failure"
                                : "default"
                            }
                          />
                          {errors.plateNameEng && touched.plateNameEng && (
                            <small className="text-red-600">
                              {errors.plateNameEng}
                            </small>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col w-[325px] md:w-full h-[150px] mb-5">
                      <Label className="mb-2">Preview</Label>
                      <div className="p-2 h-full shrink-0 bg-gradient-to-b from-blue-700 via-blue-600 to-blue-500 rounded-lg shadow-lg ">
                        <div className="h-full grid grid-rows-12 grid-cols-1 justify-center items-center text-center py-2 rounded-md bg-gray-50 shadow-inner">
                          <p className="text-blue-600 text-lg row-span-3">
                            {values.plateNameKh || "xxxxx"}
                          </p>
                          <span className="text-blue-600 text-3xl row-span-6">
                            {values.plateNumber || "xx-xxxx"}
                          </span>
                          <div className="h-[2px] rounded-full bg-blue-600 row-span-1 mx-3"></div>
                          <p className="text-red-600 text-sm row-span-2">
                            {values.plateNameEng || "xxxxx"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </section>
                  <section className="grid grid-cols-2 gap-x-10 gap-y-5 lg:grid-cols-1">
                    <div className="grid gap-y-5">
                      <div>
                        <Label className="flex gap-2 mb-2">
                          <TbUser />
                          Owner
                          <span className="text-red-600">*</span>
                        </Label>
                        <div
                          className="relative ring-transparent"
                          ref={ownerRef}
                        >
                          <div onClick={() => setToggleOwner(!toggleOwner)}>
                            <TextInput
                              placeholder="Select Owner"
                              value={
                                usersState.find(
                                  (user) => user.uuid === values.owner
                                )?.fullName || ""
                              }
                              style={{
                                backgroundColor:
                                  mode === "dark" ? "#1f2937" : "#f9fafb",
                                cursor: "pointer",
                              }}
                              color={
                                errors.owner && touched.owner
                                  ? "failure"
                                  : "default"
                              }
                              readOnly={true}
                            />
                            <span>
                              <FaChevronDown className="absolute top-3 right-3 cursor-pointer dark:text-gray-300" />
                            </span>
                          </div>
                          {errors.owner && touched.owner && (
                            <small className="text-red-600">
                              {errors.owner}
                            </small>
                          )}
                          {toggleOwner ? (
                            <>
                              {" "}
                              <div className="absolute top-0 left-0 w-full rounded-lg z-10 hover:border-black dark:hover:border-gray-400  bg-gray-50 border border-gray-500 dark:bg-gray-800">
                                <div>
                                  <div className="p-3">
                                    <input                                    
                                      style={{
                                        backgroundColor:
                                          mode === "dark"
                                            ? "#1f2937"
                                            : "#f9fafb",
                                        cursor: "pointer",
                                      }}
                                      placeholder="Search"
                                      className=" hover:border-black dark:hover:border-gray-400 border border-gray-500 focus:outline-blue-600 w-full p-2 rounded-lg"
                                    />
                                  </div>
                                  <div className="overflow-auto h-[18.2rem] w-full">
                                    {usersState.map((user) => (
                                      <div
                                        key={user.uuid}
                                        className="px-3 flex justify-start hover:bg-gray-300 cursor-pointer items-center py-2 gap-3"
                                        onClick={() =>
                                          setFieldValue("owner", user.uuid)
                                        }
                                      >
                                        <Radio
                                          id={user.owner}
                                          name={user.owner}
                                          className="focus:ring-transparent"
                                          onChange={() =>
                                            setFieldValue("owner", user.uuid)
                                          }
                                          checked={values.owner === user.uuid}
                                        />
                                        <Label htmlFor={user.fullName}>
                                          {user.fullName}
                                        </Label>
                                      </div>
                                    ))}
                                  </div>
                                  <div className="w-full p-3 border-t border-t-gray-400 ">
                                    <Label className="  text-blue-600">
                                      <span className="flex  justify-start w-32  gap-3  cursor-pointer hover:underline">
                                        <FiUserPlus />
                                        Add User
                                      </span>
                                    </Label>
                                  </div>
                                </div>
                              </div>
                            </>
                          ) : (
                            <></>
                          )}
                        </div>
                      </div>
                      <div>
                        <Label className="flex gap-2 mb-2">
                          <PiCarThin />
                          Vehicle Type
                          <span className="text-red-600">*</span>
                        </Label>
                        <div
                          className="relative ring-transparent"
                          ref={vehicleTypeRef}
                        >
                          <div
                            onClick={() =>
                              setToggleVehicleType(!toggleVehicleType)
                            }
                          >
                            <TextInput

                              value={vehicleTypes.find(
                                  (type) => type.uuid === values.type
                                )?.name || ""}
                              placeholder="Select Vehicle Type"
                              style={{
                                backgroundColor:
                                  mode === "dark" ? "#1f2937" : "#f9fafb",
                                cursor: "pointer",
                              }}
                              color={
                                errors.type && touched.type
                                  ? "failure"
                                  : "default"
                              }
                              readOnly={true}
                            />
                            <span>
                              <FaChevronDown className="absolute top-3 right-3 cursor-pointer dark:text-gray-300" />
                            </span>
                          </div>
                          {errors.type && touched.type && (
                            <small className="text-red-600">
                              {errors.type}
                            </small>
                          )}
                          {toggleVehicleType ? (
                            <>
                              {" "}
                              <div className="absolute top-0 left-0 w-full rounded-lg z-10 hover:border-black dark:hover:border-gray-400  bg-gray-50 border border-gray-500 dark:bg-gray-800">
                                <div>
                                  <div className="p-3">
                                    <input
                                      style={{
                                        backgroundColor:
                                          mode === "dark"
                                            ? "#1f2937"
                                            : "#f9fafb",
                                        cursor: "pointer",
                                      }}
                                      placeholder="Search"
                                      className=" hover:border-black dark:hover:border-gray-400 border border-gray-500 focus:outline-blue-600 w-full p-2 rounded-lg"
                                    />
                                  </div>
                                  <div className="overflow-auto h-48 w-full">
                                    {vehicleTypes.map((type) => (
                                      <div
                                        key={type.uuid}
                                        className="px-3 flex justify-start items-center py-2 gap-3 hover:bg-gray-300 cursor-pointer"
                                        onClick={() =>
                                          setFieldValue("type", type.uuid)
                                        }
                                      >
                                        <Radio
                                          id={type.name}
                                          name={type.name}
                                          className="focus:ring-transparent"
                                          onChange={() =>
                                            setFieldValue("type", type.uuid)
                                          }
                                          checked={values.type === type.uuid}
                                        />
                                        <Label htmlFor={type.name}>
                                          {type.name}
                                        </Label>
                                      </div>
                                    ))}
                                  </div>
                                  <div className="w-full p-3 border-t border-t-gray-400 ">
                                    <Label className="  text-blue-600">
                                      <span className="flex  justify-start w-40  gap-3  cursor-pointer hover:underline">
                                        <LuCar />
                                        Add Vehicle Type
                                      </span>
                                    </Label>
                                  </div>
                                </div>
                              </div>
                            </>
                          ) : (
                            <></>
                          )}
                        </div>
                      </div>
                      <div>
                        <Label className="flex gap-2 mb-2">
                          <PiCarThin />
                          Vehicle Make (Toyota, Ford)
                        </Label>
                        <TextInput
                          placeholder="Enter Vehicle Make"
                          style={{
                            backgroundColor:
                              mode === "dark" ? "#1f2937" : "#f9fafb",
                            color: mode === "dark" ? "white" : "#1f2937",
                          }}
                          id="make"
                          name="make"
                          type="text"
                          autoComplete="off"
                          value={values.make}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          color="default"
                        />
                      </div>
                      <div>
                        <Label className="flex gap-2 mb-2">
                          <PiCarThin />
                          Vehicle Model (Camry, Mustang)
                        </Label>
                        <TextInput
                          placeholder="Enter Vehicle Model"
                          style={{
                            backgroundColor:
                              mode === "dark" ? "#1f2937" : "#f9fafb",
                            color: mode === "dark" ? "white" : "#1f2937",
                          }}
                          id="model"
                          name="model"
                          type="text"
                          autoComplete="off"
                          value={values.model}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          color="default"
                        />
                      </div>
                      <div>
                        <Label className="flex gap-2 mb-2">
                          <MdOutlineColorLens />
                          Vehicle Color
                        </Label>
                        <div className="relative w-full">
                          <TextInput
                            type="text"
                            id="color"
                            name="color"
                            placeholder="Select Color"
                            className="w-full"
                            value={values.color}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            style={{
                              backgroundColor:
                                mode === "dark" ? "#1f2937" : "#f9fafb",
                              color: values.color,
                              borderColor: values.color,
                            }}
                            color={"default"}
                          />

                          <input
                            type="color"
                            id="colorCodeSelection"
                            className="absolute top-2 right-2"
                            value={values.color}
                            onChange={(e) => {
                              setFieldValue("color", e.target.value);
                            }}
                            onBlur={handleBlur}
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <ImageUpload setImageFile={setImageFile} />
                    </div>
                  </section>
                </div>
              </div>

              <div className="flex gap-4 px-5">
                <Button
                  className="bg-transparent focus:ring-0 border border-primary text-primary dark:text-gray-50"
                  onClick={handleBtnBackClicked}
                >
                  <IoReturnDownBackOutline className="mr-2" /> Back
                </Button>
                <Button
                  type="submit"
                  className="bg-primary hover:bg-primary-hover focus:ring-0 w-24"
                  title="Save"
                  // disabled={isLoading}
                >
                  {/* {isLoading ? (
                    <Spinner color="purple" aria-label="loading" size="xs" />
                  ) : (
                    <>
                      <LuSave className="mr-2" />
                      Save
                    </>
                  )} */}
                  <LuSave className="mr-2" />
                  Save
                </Button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </>
  );

  return content;
}

export default AddNewVehicle;
