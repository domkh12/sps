import {
  Button,
  Card,
  Label,
  Modal,
  Radio,
  Spinner,
  TextInput,
  Tooltip,
  useThemeMode,
} from "flowbite-react";
import { Form, Formik } from "formik";
import { IoReturnDownBackOutline } from "react-icons/io5";
import { LuCar, LuRectangleHorizontal, LuSave } from "react-icons/lu";
import { MdOutlineColorLens, MdOutlineDelete } from "react-icons/md";
import { PiCarThin } from "react-icons/pi";
import { TbUser } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import ImageUpload from "./components/ImageUpload";
import { FaChevronDown } from "react-icons/fa";
import { useSelector } from "react-redux";
import { selectAllFullNameUsers } from "../../redux/feature/users/userApiSlice";
import { FiUserPlus } from "react-icons/fi";
import { useEffect, useRef, useState } from "react";
import {
  selectAllVehicleTypes,
  useAddNewVehicleTypeMutation,
  useDeleteVehicleTypeMutation,
} from "../../redux/feature/vehicles/vehicleTypeApiSlice";
import { useAddNewVehicleMutation } from "../../redux/feature/vehicles/vehicleApiSlice";
import { toast } from "react-toastify";
import { useUploadImageMutation } from "../../redux/feature/uploadImage/uploadImageApiSlice";
import { IoMdSearch } from "react-icons/io";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import {
  Cardtheme,
  spinnerTheme,
} from "./../../redux/feature/utils/customReactFlowbiteTheme";

function AddNewVehicle() {
  const navigator = useNavigate();
  const { mode } = useThemeMode();
  const usersState = useSelector((state) => selectAllFullNameUsers(state));
  const vehicleTypes = useSelector((state) => selectAllVehicleTypes(state));
  const [toggleOwner, setToggleOwner] = useState(false);
  const [toggleVehicleType, setToggleVehicleType] = useState(false);
  const ownerRef = useRef(null);
  const vehicleTypeRef = useRef(null);
  const [selectedVehicleType, setSelectedVehicleType] = useState();
  const [imageFile, setImageFile] = useState(null);
  const [isModalCreateUserOpen, setIsModalCreateUserOpen] = useState(false);
  const [isModalCreateVehicleTypeOpen, setIsModalCreateVehicleTypeOpen] =
    useState(false);
  const [searchOwner, setSearchOwner] = useState("");
  const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] =
    useState(false);
  const [vehicleTypeToDelete, setVehicleTypeToDelete] = useState(null);

  const [addNewVehicle, { isSuccess, isLoading, isError, error }] =
    useAddNewVehicleMutation();

  const [
    addNewVehicleType,
    {
      isSuccess: isSuccessVehicleType,
      isLoading: isLoadingVehicleType,
      isError: isErrorVehicleType,
      error: errorVehicleType,
    },
  ] = useAddNewVehicleTypeMutation();

  const [deleteVehicleType, {}] = useDeleteVehicleTypeMutation();

  const [uploadImage] = useUploadImageMutation();

  const isAnyModalOpen = (modalStates) => {
    return Object.values(modalStates).some((isOpen) => isOpen);
  };

  const modalStates = {
    isModalCreateUserOpen,
    isModalCreateVehicleTypeOpen,
    isDeleteConfirmModalOpen,
    // Add more modals here as needed
  };

  useEffect(() => {
    if (isErrorVehicleType) {
      toast.error(`${errorVehicleType?.data?.error?.description}`, {
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
  }, [isErrorVehicleType]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isAnyModalOpen(modalStates)) {
        return; // Skip closing dropdowns if any modal is open
      }

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
  }, [modalStates]);

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

  const validationSchemaVehicleType = Yup.object().shape({
    name: Yup.string()
      .min(2, "Vehicle Type Name must be at least 2 characters")
      .max(20, "Vehicle Type Name cannot exceed 20 characters")
      .required("Vehicle Type Name is required"),
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
        userId: values.owner,
        vehicleTypeId: values.type,
        image: profileImageUri,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitVehicleType = async (values) => {
    try {
      const response = await addNewVehicleType({
        name: values.name,
        alias: values.name,
      }).unwrap();
      setSelectedVehicleType(response.uuid);
    } catch (error) {
      console.log(error);
    } finally {
    }
  };

  const handleDeleteVehicleType = async () => {
    if (!vehicleTypeToDelete) return;
    try {
      await deleteVehicleType(vehicleTypeToDelete).unwrap();
      toast.success("Vehicle type deleted successfully", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete vehicle type", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } finally {
      setIsDeleteConfirmModalOpen(false);
      setVehicleTypeToDelete(null);
    }
  };

  const openDeleteConfirmModal = (uuid) => {
    setVehicleTypeToDelete(uuid);
    setIsDeleteConfirmModalOpen(true);
  };

  const handleBtnBackClicked = () => {
    navigator("/dash/vehicles");
  };

  const toggleCreateUserModal = () => {
    setIsModalCreateUserOpen(!isModalCreateUserOpen);
  };

  const toggleCreateVehicleTypeModal = () => {
    setIsModalCreateVehicleTypeOpen(!isModalCreateVehicleTypeOpen);
  };

  const filteredUsers = usersState.filter((user) =>
    user.fullName.toLowerCase().includes(searchOwner.toLowerCase())
  );

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
          useEffect(() => {
            if (isSuccessVehicleType) {
              setIsModalCreateVehicleTypeOpen(false);
              setFieldValue("type", selectedVehicleType);
            }
          }, [isSuccessVehicleType, selectedVehicleType, setFieldValue]);
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
                              "&:hover": {
                                backgroundColor: "#e4e4e4",
                              },
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
                                  <div className="p-3 relative">
                                    <span className="absolute left-3 top-[1.2rem] pl-3 flex items-center pointer-events-none">
                                      <IoMdSearch className="text-gray-500 text-2xl" />
                                    </span>
                                    <input
                                      style={{
                                        backgroundColor:
                                          mode === "dark"
                                            ? "#1f2937"
                                            : "#f9fafb",
                                        cursor: "pointer",
                                        paddingLeft: "2.5rem",
                                      }}
                                      placeholder="Search"
                                      value={searchOwner}
                                      onChange={(e) =>
                                        setSearchOwner(e.target.value)
                                      }
                                      className=" hover:border-black dark:hover:border-gray-400 border border-gray-500 focus:outline-blue-600 w-full p-2 rounded-lg"
                                    />
                                  </div>
                                  <div className="overflow-auto h-[18.2rem] w-full">
                                    {filteredUsers.length > 0 ? (
                                      filteredUsers.map((user) => (
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
                                      ))
                                    ) : (
                                      <div className="px-3 py-2 flex justify-center text-gray-500">
                                        No user available
                                      </div>
                                    )}
                                  </div>
                                  <div className="w-full p-3 border-t border-t-gray-400 ">
                                    <Label className="  text-blue-600">
                                      <span
                                        className="flex  justify-start w-32  gap-3  cursor-pointer hover:underline"
                                        onClick={toggleCreateUserModal}
                                      >
                                        <FiUserPlus />
                                        Create User
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
                              value={
                                vehicleTypes.find(
                                  (type) => type.uuid === values.type
                                )?.name || ""
                              }
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
                              <Card
                                theme={Cardtheme}
                                className="absolute top-0 left-0 w-full rounded-lg z-10 bg-gray-50 dark:bg-gray-800"
                              >
                                <div>
                                  <div className="relative mx-5 my-4">
                                    <span className="absolute left-0 top-2 pl-3 flex items-center pointer-events-none">
                                      <IoMdSearch className="text-gray-500 text-2xl" />
                                    </span>
                                    <input
                                      style={{
                                        backgroundColor:
                                          mode === "dark"
                                            ? "#1f2937"
                                            : "#f9fafb",
                                        cursor: "pointer",
                                        paddingLeft: "2.5rem",
                                      }}
                                      placeholder="Search"
                                      className=" hover:border-black dark:hover:border-gray-400 border border-gray-500 focus:outline-black focus:border-[1px] w-full p-2 rounded-lg"
                                    />
                                  </div>
                                  <div className="overflow-auto h-48 w-full">
                                    {vehicleTypes.map((type) => (
                                      <div
                                        key={type.uuid}
                                        className="px-5 flex justify-between items-center py-2 gap-3 hover:bg-gray-200 rounded-lg cursor-pointer"
                                        onClick={() =>
                                          setFieldValue("type", type.uuid)
                                        }
                                      >
                                        <div className="flex gap-3">
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
                                        <Tooltip
                                          content="Delete"
                                          trigger={
                                            window.innerWidth <= 1024
                                              ? "undefined"
                                              : "hover"
                                          }
                                        >
                                          <Button
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              openDeleteConfirmModal(type.uuid);
                                            }}
                                            className="hover:bg-gray-300 w-10 h-10 rounded-full ring-transparent"
                                          >
                                            <MdOutlineDelete className="text-red-600 text-xl" />
                                          </Button>
                                        </Tooltip>
                                      </div>
                                    ))}
                                  </div>
                                  <div className="w-full px-5 py-4 border-t border-t-gray-400 flex justify-between items-center">
                                    <Button
                                      className="text-gray-900 bg-gray-200 hover:bg-gray-300 ring-transparent"
                                      onClick={toggleCreateVehicleTypeModal}
                                    >
                                      <span className="flex justify-start w-40 gap-3 cursor-pointer">
                                        <LuCar />
                                        Create Vehicle Type
                                      </span>
                                    </Button>
                                    <Button
                                      className="bg-gray-200 text-gray-900 hover:bg-gray-300 ring-transparent"
                                      onClick={() =>
                                        setToggleVehicleType(false)
                                      }
                                    >
                                      Done
                                    </Button>
                                  </div>
                                </div>
                              </Card>
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
                  Create
                </Button>
              </div>
            </Form>
          );
        }}
      </Formik>
      <Modal
        show={isModalCreateUserOpen}
        onClose={toggleCreateUserModal}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Modal.Header>Create New User</Modal.Header>
        <Modal.Body>
          {/* Add your form or content for creating a new user here */}
        </Modal.Body>
      </Modal>

      <Modal
        show={isModalCreateVehicleTypeOpen}
        onClose={toggleCreateVehicleTypeModal}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Modal.Header
          className="flex"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <span className="text-lg">Create New Vehicle Type</span>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={{
              name: "",
            }}
            validationSchema={validationSchemaVehicleType}
            onSubmit={handleSubmitVehicleType}
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
                <Form className="flex flex-col gap-5">
                  <div>
                    <Label className="flex gap-2 mb-2">
                      <PiCarThin />
                      Vehicle Type Name
                      <span className="text-red-600">*</span>
                    </Label>
                    <TextInput
                      name="name"
                      id="name"
                      placeholder="Enter Vehicle Type Name"
                      value={values.name}
                      onChange={handleChange}
                      className="w-[25vw] lg:w-full"
                    />
                  </div>
                  {errors.tynamepe && touched.name && (
                    <small className="text-red-600">{errors.name}</small>
                  )}
                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      className="bg-primary ring-transparent hover:bg-primary-hover w-24"
                    >
                      {isLoadingVehicleType ? (
                        <Spinner
                          theme={spinnerTheme}
                          color="primary"
                          aria-label="loading"
                          size="xs"
                        />
                      ) : (
                        <>
                          <LuSave className="mr-2" />
                          Create
                        </>
                      )}
                    </Button>
                  </div>
                </Form>
              );
            }}
          </Formik>
        </Modal.Body>
      </Modal>

      {/* confirm delete */}
      <Modal
        show={isDeleteConfirmModalOpen}
        onClose={() => setIsDeleteConfirmModalOpen(false)}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this vehicle type?
            </h3>
            <div className="flex justify-center gap-4">
              <Button
                className="ring-transparent bg-red-600 hover:bg-red-700"
                onClick={handleDeleteVehicleType}
              >
                {"Yes, I'm sure"}
              </Button>
              <Button
                color="gray"
                className="ring-transparent"
                onClick={() => setIsDeleteConfirmModalOpen(false)}
              >
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );

  return content;
}

export default AddNewVehicle;
