import {
  Button,
  Card,
  Checkbox,
  Datepicker,
  Label,
  Modal,
  Radio,
  Spinner,
  TextInput,
  useThemeMode,
} from "flowbite-react";
import { Form, Formik } from "formik";
import {
  IoCallOutline,
  IoMailOutline,
  IoReturnDownBackOutline,
  IoWarningOutline,
} from "react-icons/io5";
import { LuCalendarDays, LuRectangleHorizontal } from "react-icons/lu";
import { MdOutlineColorLens, MdOutlineDelete } from "react-icons/md";
import { PiCar, PiCarThin } from "react-icons/pi";
import { TbEye, TbEyeClosed, TbUser } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import ImageUpload from "./components/ImageUpload";
import { FaChevronDown } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  selectAllFullNameUsers,
  useAddNewUserMutation,
  useFindUserByUuidQuery,
  useUpdateUserMutation,
} from "../../redux/feature/users/userApiSlice";
import { useEffect, useRef, useState } from "react";
import {
  selectAllVehicleTypes,
  useAddNewVehicleTypeMutation,
  useDeleteVehicleTypeMutation,
  useUpdateVehicleTypeMutation,
} from "../../redux/feature/vehicles/vehicleTypeApiSlice";
import { useAddNewVehicleMutation } from "../../redux/feature/vehicles/vehicleApiSlice";
import { toast } from "react-toastify";
import { useUploadImageMutation } from "../../redux/feature/uploadImage/uploadImageApiSlice";
import { IoIosArrowDown, IoMdSearch } from "react-icons/io";
import {
  Cardtheme,
  spinnerTheme,
} from "./../../redux/feature/utils/customReactFlowbiteTheme";
import { RiLockPasswordLine } from "react-icons/ri";
import { CgAddR } from "react-icons/cg";
import { GoPersonAdd } from "react-icons/go";
import ProfilePictureUpload from "../user/components/ProfilePictureUpload";
import { BsGenderAmbiguous } from "react-icons/bs";
import { GENDERS } from "../../config/genders";
import { GrUpdate, GrUserAdmin } from "react-icons/gr";
import { ROLES } from "../../config/roles";
import { CiEdit } from "react-icons/ci";
import { setIsLoadingBar } from "../../redux/feature/actions/actionSlice";

function AddNewVehicle() {
  const dispatch = useDispatch();
  const navigator = useNavigate();
  const { mode } = useThemeMode();
  // const usersState = useSelector((state) => selectAllFullNameUsers(state));
  const vehicleTypes = useSelector((state) => selectAllVehicleTypes(state));
  const [toggleOwner, setToggleOwner] = useState(false);
  const [toggleVehicleType, setToggleVehicleType] = useState(false);
  const ownerRef = useRef(null);
  const vehicleTypeRef = useRef(null);
  const [selectedVehicleType, setSelectedVehicleType] = useState();
  const [selectedUser, setSelectedUser] = useState();
  const [imageFile, setImageFile] = useState(null);
  const [isModalCreateUserOpen, setIsModalCreateUserOpen] = useState(false);
  const [isModalEditUserOpen, setIsModalEditUserOpen] = useState(false);
  const [isModalCreateVehicleTypeOpen, setIsModalCreateVehicleTypeOpen] =
    useState(false);
  const [searchOwner, setSearchOwner] = useState("");
  const [searchVehicleType, setSearchVehicleType] = useState("");
  const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] =
    useState(false);
  const [isVehicleEditTypeModalOpen, setIsVehicleEditTypeModalOpen] =
    useState(false);
  const [vehicleTypeToDelete, setVehicleTypeToDelete] = useState(null);
  const [vehicleTypeToEdit, setVehicleTypeToEdit] = useState(null);
  const [userToEdit, setUserToEdit] = useState(null);
  const [toggleEye, setToggleEye] = useState(false);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [isDataChanged, setIsDataChanged] = useState(false);
  const [profileImageFileUpdateUser, setProfileImageFileUpdateUser] = useState(
    userToEdit ? userToEdit.profileImage : ""
  );
  console.log("isDataChanged", isDataChanged);
  console.log("profileImageFileUpdateUser", profileImageFileUpdateUser);
  const [rolesPlaceHolderUpdate, setRolesPlaceHolderUpdate] = useState("");
  const dropdownRef = useRef(null);
  const [rolesPlaceHolder, setRolesPlaceHolder] = useState("STAFF");
  const [cboRolesToggle, setCboRolesToggle] = useState(false);
  const [addNewVehicle, { isSuccess, isLoading, isError, error }] =
    useAddNewVehicleMutation();

  const [
    updateVehicleType,
    {
      isSuccess: isSuccessUpdateVehicleType,
      isLoading: isLoadingUdateVehicleType,
      isError: isErrorUpdateVehicleType,
      error: errorUpdateVehicleType,
    },
  ] = useUpdateVehicleTypeMutation();

  const [
    addNewUser,
    {
      isLoading: isLoadingUser,
      isSuccess: isSuccessUser,
      isError: isErrorUser,
      error: errorUser,
    },
  ] = useAddNewUserMutation();

  const [
    updateUser,
    {
      isSuccess: isSuccessUpdatedUser,
      isLoading: isLoadingUpdatedUser,
      isError: isErrorUpdatedUser,
      error: errorUpdatedUser,
    },
  ] = useUpdateUserMutation();

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
    isVehicleEditTypeModalOpen,
    isModalEditUserOpen,
    // Add more modals here as needed
  };

  useEffect(() => {
    if (isLoadingFindUserByUuid) {
      dispatch(setIsLoadingBar(true));
    }
  }, [isLoadingFindUserByUuid]);

  useEffect(() => {
    if (isSuccessFindUserByUuid) {
      dispatch(setIsLoadingBar(false));
    }
  }, [isSuccessFindUserByUuid]);

  useEffect(() => {
    if (isSuccessUpdatedUser) {
      setIsModalEditUserOpen(false);
      setIsDataChanged(false);
      toast.success("Updated!", {
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
  }, [isSuccessUpdatedUser]);

  useEffect(() => {
    if (isErrorUpdatedUser) {
      toast.error(`${errorUpdatedUser?.data?.error?.description}`, {
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
  }, [isErrorUpdatedUser]);

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

  useEffect(() => {
    if (isSuccessUpdateVehicleType) {
      setIsVehicleEditTypeModalOpen(false);
      toast.success("Updated!", {
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
  }, [isSuccessUpdateVehicleType]);

  useEffect(() => {
    if (isErrorUpdateVehicleType) {
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
  }, [isErrorUpdateVehicleType]);

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
      .min(2, "Min 2 chars")
      .max(20, "Max 20 chars")
      .required("Required"),
  });

  const validationSchemaUser = Yup.object().shape({
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    fullName: Yup.string().required("Full name is required"),
    dateOfBirth: Yup.date().required("Date of birth is required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      .matches(/[a-z]/, "Password must contain at least one lowercase letter")
      .matches(/[0-9]/, "Password must contain at least one number")
      .matches(/[\W_]/, "Password must contain at least one special character")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm password is required"),
    phoneNumber: Yup.string()
      .matches(/^\d+$/, "Phone number must numbers")
      .required("Phone number is required"),
    roleName: Yup.array()
      .min(1, "At least one role must be selected")
      .required("Role is required"),
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

  const handleSubmitUpdateVehicleType = async (values) => {
    try {
      const response = await updateVehicleType({
        uuid: vehicleTypeToEdit.uuid,
        name: vehicleTypeToEdit.name,
      }).unwrap();
      setSelectedVehicleType(response.uuid);
    } catch (error) {
      console.log(error);
    } finally {
    }
  };

  const handleSubmitUpdateUser = async (values) => {
    try {
      const formData = new FormData();
      let profileImageUri = null;
      if (profileImageFileUpdateUser) {
        formData.append("file", profileImageFileUpdateUser);
        const uploadResponse = await uploadImage(formData).unwrap();
        profileImageUri = uploadResponse.uri;
      }

      const response = await updateUser({
        id: userToEdit.uuid,
        firstName: values.firstName,
        lastName: values.lastName,
        dateOfBirth: values.dateOfBirth,
        fullName: values.fullName,
        genderName: values.genderName,
        email: values.email,
        phoneNumber: values.phoneNumber,
        roleName: values.roleName,
        profileImage: profileImageUri,
        isDeleted: values.isDisabled,
      }).unwrap();
    } catch (error) {
      console.error(error);
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

  const handleSubmitUser = async (values, { setSubmitting }) => {
    try {
      const formData = new FormData();
      let profileImageUri = null;
      if (profileImageFile) {
        formData.append("file", profileImageFile);
        const uploadResponse = await uploadImage(formData).unwrap();
        profileImageUri = uploadResponse.uri;
      }

      await addNewUser({
        firstName: values.firstName,
        lastName: values.lastName,
        dateOfBirth: values.dateOfBirth,
        fullName: values.fullName,
        genderName: values.genderName,
        email: values.email,
        password: values.password,
        phoneNumber: values.phoneNumber,
        roleName: values.roleName,
        profileImage: profileImageUri,
      });
    } catch (error) {
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleEye = () => {
    setToggleEye(!toggleEye);
  };

  const handleToggleRoleCbo = () => {
    setCboRolesToggle(!cboRolesToggle);
  };

  const openDeleteConfirmModal = (uuid) => {
    setVehicleTypeToDelete(uuid);
    setIsDeleteConfirmModalOpen(true);
  };

  const openEditVehicleTypeModal = (uuid) => {
    setVehicleTypeToEdit(vehicleTypes.find((type) => type.uuid === uuid));
    setIsVehicleEditTypeModalOpen(true);
  };

  const openEditUserModal = async (uuid) => {
    const result = await findByUuid(uuid);
    setUserToEdit(Object.values(result.data.entities)[0]);
    setRolesPlaceHolderUpdate(
      Object.values(result.data.entities)[0].roleNames.join(", ")
    );
    setIsModalEditUserOpen(true);
  };

  const handleBtnBackClicked = () => {
    navigator("/dash/vehicles");
  };

  const toggleCreateUserModal = () => {
    setIsModalCreateUserOpen(!isModalCreateUserOpen);
  };

  const toggleEditUserModal = () => {
    setIsModalEditUserOpen(!isModalEditUserOpen);
    if (isModalEditUserOpen) {
      setProfileImageFileUpdateUser(null);
      setIsDataChanged(false);
    }
  };

  const toggleCreateVehicleTypeModal = () => {
    setIsModalCreateVehicleTypeOpen(!isModalCreateVehicleTypeOpen);
  };

  const filteredUsers = usersState.filter((user) =>
    user.fullName.toLowerCase().includes(searchOwner.toLowerCase())
  );

  const filteredVehicleType = vehicleTypes.filter((type) =>
    type.name.toLowerCase().includes(searchVehicleType.toLowerCase())
  );

  const initialValuesUpdateUser = {
    firstName: userToEdit ? userToEdit.firstName : "",
    lastName: userToEdit ? userToEdit.lastName : "",
    fullName: userToEdit ? userToEdit.fullName : "",
    genderName: userToEdit ? userToEdit.gender.fullNameEnglish : "",
    email: userToEdit ? userToEdit.email : "",
    phoneNumber: userToEdit ? userToEdit.phoneNumber : "",
    profileImage: userToEdit ? userToEdit.profileImage : "",
    dateOfBirth: userToEdit ? new Date(userToEdit.dateOfBirth) : new Date(),
    roleName: userToEdit ? userToEdit.roleNames : [],
  };

  const checkDataChanged = (values) => {
    console.log("JSON.stringify(values)", JSON.stringify(values));
    console.log(
      "JSON.stringify(initialValuesUpdateUser)",
      JSON.stringify(initialValuesUpdateUser)
    );
    return JSON.stringify(values) !== JSON.stringify(initialValuesUpdateUser);
  };

  const handleDoneButtonClick = () => {
    setCboRolesToggle(false);
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
                            <input
                              className={`border-gray-500 border rounded-lg focus:outline-none px-3 w-full h-[2.6rem] text-sm ${
                                errors.owner && touched.owner
                                  ? "border-red-600 placeholder-red-600"
                                  : ""
                              }`}
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
                              <FaChevronDown
                                className={`absolute top-3 right-3 cursor-pointer dark:text-gray-300 ${
                                  errors.owner && touched.owner
                                    ? "text-red-600"
                                    : ""
                                }`}
                              />
                            </span>
                          </div>
                          {errors.owner && touched.owner && (
                            <small className="text-red-600">
                              {errors.owner}
                            </small>
                          )}
                          {toggleOwner ? (
                            <>
                              <Card
                                theme={Cardtheme}
                                className="absolute overflow-auto flex top-0 left-0 w-full h-96 rounded-lg z-10 bg-gray-50 dark:bg-gray-800"
                              >
                                <div className="relative mx-5 my-4">
                                  <span className="absolute left-0 top-2 pl-3 flex items-center pointer-events-none">
                                    <IoMdSearch className="text-gray-500 text-2xl" />
                                  </span>
                                  <input
                                    style={{
                                      backgroundColor:
                                        mode === "dark" ? "#1f2937" : "#f9fafb",
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
                                <div className="w-full overflow-auto customScrollBar h-full">
                                  {filteredUsers.length > 0 ? (
                                    filteredUsers.map((user) => (
                                      <div
                                        key={user.uuid}
                                        className="px-5 flex justify-between hover:bg-gray-200 cursor-pointer items-center py-2 gap-3 h-12"
                                        onClick={() =>
                                          setFieldValue("owner", user.uuid)
                                        }
                                      >
                                        <div>
                                          <Radio
                                            id={user.owner}
                                            name={user.owner}
                                            className="focus:ring-transparent mr-4"
                                            onChange={() =>
                                              setFieldValue("owner", user.uuid)
                                            }
                                            checked={values.owner === user.uuid}
                                          />
                                          <Label htmlFor={user.fullName}>
                                            {user.fullName}
                                          </Label>
                                        </div>
                                        <div>
                                          <Button
                                            className="hover:bg-gray-300 rounded-full w-10 h-10 ring-transparent"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              openEditUserModal(user.uuid);
                                            }}
                                          >
                                            <CiEdit className="text-primary text-lg" />
                                          </Button>
                                        </div>
                                      </div>
                                    ))
                                  ) : (
                                    <div className="px-3 py-2 flex justify-center flex-col items-center gap-2 h-full text-gray-500">
                                      <img
                                        src="/images/dataNotFound.svg"
                                        alt="dataNotFound"
                                        className="w-1/2 h-1/2"
                                      />
                                      No user available
                                    </div>
                                  )}
                                </div>

                                <div className="w-full px-5 py-4 border-t border-t-gray-400 flex justify-between items-center">
                                  <Button
                                    className="text-gray-900 bg-gray-200 hover:bg-gray-300 ring-transparent"
                                    onClick={toggleCreateUserModal}
                                  >
                                    <span className="flex justify-start w-32 gap-3 cursor-pointer">
                                      <GoPersonAdd className="mt-[0.1rem] h-5 w-5" />
                                      Create User
                                    </span>
                                  </Button>
                                  <Button
                                    className="bg-gray-200 text-gray-900 hover:bg-gray-300 ring-transparent"
                                    onClick={() => setToggleOwner(false)}
                                  >
                                    Done
                                  </Button>
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
                            <input
                              className={`border-gray-500 border rounded-lg focus:outline-none px-3 w-full h-[2.6rem] text-sm ${
                                errors.type && touched.type
                                  ? "border-red-600 placeholder:text-red-600"
                                  : ""
                              }`}
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
                              <FaChevronDown
                                className={`absolute top-3 right-3 cursor-pointer dark:text-gray-300 ${
                                  errors.type && touched.type
                                    ? "text-red-600"
                                    : ""
                                }`}
                              />
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
                                      onChange={(e) =>
                                        setSearchVehicleType(e.target.value)
                                      }
                                      placeholder="Search"
                                      className=" hover:border-black dark:hover:border-gray-400 border border-gray-500 focus:outline-black focus:border-[1px] w-full p-2 rounded-lg"
                                    />
                                  </div>
                                  <div className="overflow-auto h-48 w-full customScrollBar">
                                    {filteredVehicleType.length > 0 ? (
                                      filteredVehicleType.map((type) => (
                                        <div
                                          key={type.uuid}
                                          className="px-5 flex justify-between items-center py-2 h-12 gap-3 hover:bg-gray-200 cursor-pointer group"
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
                                              checked={
                                                values.type === type.uuid
                                              }
                                            />
                                            <Label htmlFor={type.name}>
                                              {type.name}
                                            </Label>
                                          </div>
                                          <div className="flex justify-start items-center gap-2">
                                            <Button
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                openEditVehicleTypeModal(
                                                  type.uuid
                                                );
                                              }}
                                              className="hover:bg-gray-300 w-10 h-10 rounded-full ring-transparent hidden group-hover:flex"
                                            >
                                              <CiEdit className="text-primary text-xl" />
                                            </Button>

                                            <Button
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                openDeleteConfirmModal(
                                                  type.uuid
                                                );
                                              }}
                                              className="hover:bg-gray-300 w-10 h-10 rounded-full ring-transparent hidden group-hover:flex"
                                            >
                                              <MdOutlineDelete className="text-red-600 text-xl" />
                                            </Button>
                                          </div>
                                        </div>
                                      ))
                                    ) : (
                                      <>
                                        <div className="px-3 py-2 flex justify-center flex-col items-center gap-2 h-full text-gray-500">
                                          <img
                                            src="/images/dataNotFound.svg"
                                            alt="dataNotFound"
                                            className="w-1/2 h-1/2"
                                          />
                                          No user available
                                        </div>
                                      </>
                                    )}
                                  </div>
                                  <div className="w-full px-5 py-4 border-t border-t-gray-400 flex justify-between items-center">
                                    <Button
                                      className="text-gray-900 bg-gray-200 hover:bg-gray-300 ring-transparent"
                                      onClick={toggleCreateVehicleTypeModal}
                                    >
                                      <span className="flex justify-start w-40 gap-3 cursor-pointer">
                                        <PiCar className="mt-[0.1rem]" />
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
                  className="bg-transparent focus:ring-0 border hover:bg-gray-200 border-primary text-primary dark:text-gray-50"
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
                  <CgAddR className="mr-2 h-5 w-5" />
                  Create
                </Button>
              </div>
            </Form>
          );
        }}
      </Formik>

      {/* create user modal */}
      <Modal
        show={isModalCreateUserOpen}
        onClose={toggleCreateUserModal}
        size="xl"
      >
        <Modal.Header className="p-5 shadow-md">Create New User</Modal.Header>

        <Formik
          initialValues={{
            firstName: "",
            lastName: "",
            fullName: "",
            genderName: "Male",
            email: "",
            password: "",
            confirmPassword: "",
            phoneNumber: "",
            profileImage: "",
            dateOfBirth: null,
            roleName: ["STAFF"],
          }}
          validationSchema={validationSchemaUser}
          onSubmit={handleSubmitUser}
        >
          {({
            values,
            touched,
            errors,
            handleChange,
            handleBlur,
            setFieldValue,
          }) => {
            const onRoleNameChanged = (role) => {
              const updatedRoleName = values.roleName.includes(role)
                ? values.roleName.filter((r) => r !== role) // Remove role if already selected
                : [...values.roleName, role]; // Add role if not selected

              setFieldValue("roleName", updatedRoleName);

              if (values.roleName.includes(role)) {
                setRolesPlaceHolder(
                  values.roleName.filter((r) => r !== role).join(", ") ||
                    "Select Roles"
                );
              } else {
                setRolesPlaceHolder([...values.roleName, role].join(", "));
              }
            };
            return (
              <Form className="flex flex-col overflow-auto">
                <Modal.Body>
                  <div className="px-5 flex justify-center">
                    <ProfilePictureUpload
                      setProfileImageFile={setProfileImageFile}
                    />
                  </div>
                  <div className="flex justify-center items-center gap-1 py-5 text-sm">
                    <div className="w-4 h-[1px] bg-gray-600"></div>
                    <p className="whitespace-nowrap dark:text-gray-200">
                      User Information
                    </p>
                    <div className="w-full h-[1px] bg-gray-600"></div>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-1 gap-5 gap-x-10">
                    <div>
                      <Label className="flex gap-2 mb-2">
                        <TbUser />
                        First Name <span className="text-red-600">*</span>
                      </Label>
                      <TextInput
                        placeholder="Enter first name"
                        style={{
                          backgroundColor: mode === "dark" ? "#1f2937" : "",
                          color: mode === "dark" ? "white" : "",
                        }}
                        id="firstName"
                        name="firstName"
                        type="text"
                        autoComplete="off"
                        value={values.firstName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        color={
                          errors.firstName && touched.firstName
                            ? "failure"
                            : "default"
                        }
                      />
                      {errors.firstName && touched.firstName && (
                        <small className="text-red-600">
                          {errors.firstName}
                        </small>
                      )}
                    </div>
                    <div>
                      <Label className="flex gap-2 mb-2">
                        <TbUser />
                        Last Name <span className="text-red-600">*</span>
                      </Label>
                      <TextInput
                        placeholder="Enter last name"
                        style={{
                          backgroundColor: mode === "dark" ? "#1f2937" : "",
                          color: mode === "dark" ? "white" : "",
                        }}
                        id="lastName"
                        name="lastName"
                        type="text"
                        autoComplete="off"
                        value={values.lastName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        color={
                          errors.lastName && touched.lastName
                            ? "failure"
                            : "default"
                        }
                      />
                      {errors.lastName && touched.lastName && (
                        <small className="text-red-600">
                          {errors.lastName}
                        </small>
                      )}
                    </div>
                    <div>
                      <Label className="flex gap-2 mb-2">
                        <TbUser />
                        Full Name <span className="text-red-600">*</span>
                      </Label>
                      <TextInput
                        placeholder="Enter full name"
                        style={{
                          backgroundColor: mode === "dark" ? "#1f2937" : "",
                          color: mode === "dark" ? "white" : "",
                        }}
                        id="fullName"
                        name="fullName"
                        type="text"
                        autoComplete="off"
                        value={values.fullName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        color={
                          errors.fullName && touched.fullName
                            ? "failure"
                            : "default"
                        }
                      />
                      {errors.fullName && touched.fullName && (
                        <small className="text-red-600">
                          {errors.fullName}
                        </small>
                      )}
                    </div>
                    <div>
                      <Label className="flex gap-2 mb-2">
                        <LuCalendarDays />
                        Date of Birth <span className="text-red-600">*</span>
                      </Label>
                      <Datepicker
                        // theme={customTheme}
                        showTodayButton={false}
                        onChange={(date) => {
                          const newDate = new Date(date);
                          newDate.setDate(newDate.getDate() + 1);
                          setFieldValue(
                            "dateOfBirth",
                            newDate.toISOString().split("T")[0]
                          );
                        }}
                        style={{
                          backgroundColor: mode === "dark" ? "#1f2937" : "",
                          border:
                            errors.dateOfBirth && touched.dateOfBirth
                              ? "0.0625rem solid red"
                              : mode === "dark"
                                ? "0.0625rem solid #6b7280"
                                : "0.0625rem solid #6b7280",
                          height: "2.7rem",
                        }}
                      />
                      {errors.dateOfBirth && touched.dateOfBirth && (
                        <small className="text-red-600">
                          {errors.dateOfBirth}
                        </small>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="genderName" className="flex gap-2 mb-2">
                        <BsGenderAmbiguous />
                        <span>Gender</span>
                      </Label>
                      <div className="flex gap-4">
                        {Object.values(GENDERS).map((gender) => (
                          <div key={gender} className="flex items-center">
                            <input
                              style={{
                                backgroundColor:
                                  mode === "dark" ? "#1f2937" : "",
                                color: mode === "dark" ? "white" : "",
                              }}
                              type="radio"
                              id={gender}
                              name="genderName"
                              value={gender}
                              checked={values.genderName === gender}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            />
                            <Label htmlFor={gender} className="ml-2">
                              {gender}
                            </Label>
                          </div>
                        ))}
                      </div>
                      {errors.gender && touched.gender && (
                        <small className="text-red-600">{errors.gender}</small>
                      )}
                    </div>
                    <div>
                      <Label className="flex gap-2 mb-2">
                        <IoCallOutline />
                        Phone Number <span className="text-red-600">*</span>
                      </Label>
                      <TextInput
                        placeholder="Enter phone number"
                        style={{
                          backgroundColor: mode === "dark" ? "#1f2937" : "",
                          color: mode === "dark" ? "white" : "",
                        }}
                        id="phoneNumber"
                        name="phoneNumber"
                        type="text"
                        autoComplete="off"
                        value={values.phoneNumber}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        color={
                          errors.phoneNumber && touched.phoneNumber
                            ? "failure"
                            : "default"
                        }
                      />
                      {errors.phoneNumber && touched.phoneNumber && (
                        <small className="text-red-600">
                          {errors.phoneNumber}
                        </small>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-center items-center gap-1 py-5 text-sm">
                    <div className="w-4 h-[1px] bg-gray-600"></div>
                    <p className="whitespace-nowrap dark:text-gray-200">
                      User Account
                    </p>
                    <div className="w-full h-[1px] bg-gray-600"></div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-1 gap-x-10 gap-5">
                    <div>
                      <Label className="flex gap-2 mb-2">
                        <IoMailOutline />
                        Email <span className="text-red-600">*</span>
                      </Label>
                      <TextInput
                        placeholder="Enter email"
                        style={{
                          backgroundColor: mode === "dark" ? "#1f2937" : "",
                          color: mode === "dark" ? "white" : "",
                        }}
                        type="email"
                        name="email"
                        id="email"
                        autoComplete="off"
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        color={
                          errors.email && touched.email ? "failure" : "default"
                        }
                      />
                      {errors.email && touched.email && (
                        <small className="text-red-600">{errors.email}</small>
                      )}
                    </div>
                    <div ref={dropdownRef}>
                      <Label htmlFor="roles" className="flex gap-2 mb-2">
                        <GrUserAdmin />
                        Roles <span className="text-red-600">*</span>
                      </Label>
                      <div className="relative">
                        <div
                          onClick={handleToggleRoleCbo}
                          className={`flex justify-between text-sm cursor-pointer dark:bg-gray-800 items-center border border-gray-500 dark:border-gray-500 px-2 py-[0.60rem] rounded-lg text-gray-800 dark:text-gray-200 ${
                            errors.roleName && "border-red-600 text-red-600"
                          }`}
                        >
                          {rolesPlaceHolder}{" "}
                          <IoIosArrowDown className="text-xl" />
                        </div>
                        <Card
                          theme={Cardtheme}
                          className={`w-full absolute top-0 left-0 bg-gray-50 z-10 ${
                            cboRolesToggle ? "flex" : "hidden"
                          }`}
                        >
                          {Object.values(ROLES).map((role) => (
                            <div
                              key={role}
                              className="flex items-center gap-2 py-2 hover:bg-gray-200 cursor-pointer px-5"
                            >
                              <Checkbox
                                id={role}
                                name="roleName"
                                value={role}
                                checked={values.roleName.includes(role)}
                                onChange={() => onRoleNameChanged(role)}
                              />
                              <Label htmlFor={role} className="ml-2">
                                {role}
                              </Label>
                            </div>
                          ))}
                          <div className="w-full  flex justify-end items-center border-t border-t-gray-400 p-2">
                            <Button
                              className="bg-gray-200 text-gray-800 ring-transparent hover:bg-gray-300"
                              onClick={handleDoneButtonClick}
                            >
                              Done
                            </Button>
                          </div>
                        </Card>
                      </div>
                      {errors.roleName && (
                        <small className="text-red-600">
                          {errors.roleName}
                        </small>
                      )}
                    </div>

                    <div className="relative">
                      <Label className="flex gap-2 mb-2">
                        <RiLockPasswordLine />
                        Password <span className="text-red-600">*</span>
                      </Label>
                      <TextInput
                        placeholder="Enter password"
                        style={{
                          backgroundColor: mode === "dark" ? "#1f2937" : "",
                          color: mode === "dark" ? "white" : "",
                        }}
                        name="password"
                        id="password"
                        onCopy={(e) => e.preventDefault()}
                        onPaste={(e) => e.preventDefault()}
                        type={!toggleEye ? "password" : "text"}
                        value={values.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        color={
                          errors.password && touched.password
                            ? "failure"
                            : "default"
                        }
                      />
                      {toggleEye ? (
                        <TbEye
                          className="absolute top-[2.4rem] right-2 text-xl hover:cursor-pointer dark:text-gray-100"
                          onClick={handleToggleEye}
                        />
                      ) : (
                        <TbEyeClosed
                          className="absolute top-[2.4rem] right-2 text-xl hover:cursor-pointer dark:text-gray-100"
                          onClick={handleToggleEye}
                        />
                      )}
                      {errors.password && touched.password && (
                        <small className="text-red-600">
                          {errors.password}
                        </small>
                      )}
                    </div>
                    <div className="relative">
                      <Label className="flex gap-2 mb-2">
                        <RiLockPasswordLine />
                        Confirm Password <span className="text-red-600">*</span>
                      </Label>
                      <TextInput
                        placeholder="Confirm password"
                        style={{
                          backgroundColor: mode === "dark" ? "#1f2937" : "",
                          color: mode === "dark" ? "white" : "",
                        }}
                        name="confirmPassword"
                        id="confirmPassword"
                        type={!toggleEye ? "password" : "text"}
                        value={values.confirmPassword}
                        onCopy={(e) => e.preventDefault()}
                        onPaste={(e) => e.preventDefault()}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        color={
                          errors.confirmPassword && touched.confirmPassword
                            ? "failure"
                            : "default"
                        }
                      />
                      {toggleEye ? (
                        <TbEye
                          className="absolute top-[2.4rem] right-2 text-xl hover:cursor-pointer dark:text-gray-100"
                          onClick={handleToggleEye}
                        />
                      ) : (
                        <TbEyeClosed
                          className="absolute top-[2.4rem] right-2 text-xl hover:cursor-pointer dark:text-gray-100"
                          onClick={handleToggleEye}
                        />
                      )}
                      {errors.confirmPassword && touched.confirmPassword && (
                        <small className="text-red-600">
                          {errors.confirmPassword}
                        </small>
                      )}
                    </div>
                  </div>
                </Modal.Body>
                <Modal.Footer className="flex justify-end">
                  <Button
                    type="submit"
                    className="bg-primary hover:bg-primary-hover focus:ring-0 w-24"
                    title="Save"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Spinner color="purple" aria-label="loading" size="xs" />
                    ) : (
                      <>
                        <CgAddR className="mr-2 h-5 w-5" />
                        Create
                      </>
                    )}
                  </Button>
                </Modal.Footer>
              </Form>
            );
          }}
        </Formik>
      </Modal>

      {/* create vehicle type */}
      <Modal
        show={isModalCreateVehicleTypeOpen}
        onClose={toggleCreateVehicleTypeModal}
        size="md"
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
                    <div>
                      <TextInput
                        name="name"
                        id="name"
                        placeholder="Enter Vehicle Type Name"
                        value={values.name}
                        onChange={handleChange}
                        color={
                          errors.name && touched.name ? "failure" : "default"
                        }
                      />
                      {errors.name && touched.name && (
                        <small className="text-red-600">{errors.name}</small>
                      )}
                    </div>
                  </div>

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
                          <CgAddR className="mr-2 h-5 w-5" />
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
            <IoWarningOutline className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
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

      {/* edit vehicle type */}
      <Modal
        show={isVehicleEditTypeModalOpen}
        onClose={() => setIsVehicleEditTypeModalOpen(false)}
        size="md"
      >
        <Modal.Header
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <span className="text-lg">Update Vehicle Type</span>
        </Modal.Header>
        <Modal.Body>
          {" "}
          <Formik
            initialValues={{
              updateName: "",
            }}
            // validationSchema={validationSchemaVehicleType}
            onSubmit={handleSubmitUpdateVehicleType}
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
                    <div>
                      <TextInput
                        name="updateName"
                        id="updateName"
                        placeholder="Enter Vehicle Type Name"
                        value={vehicleTypeToEdit.name}
                        onChange={(e) =>
                          setVehicleTypeToEdit((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        color={
                          errors.name && touched.name ? "failure" : "default"
                        }
                      />
                      {errors.name && touched.name && (
                        <small className="text-red-600">{errors.name}</small>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      className="bg-primary ring-transparent hover:bg-primary-hover w-24"
                    >
                      {isLoadingUdateVehicleType ? (
                        <Spinner
                          theme={spinnerTheme}
                          color="primary"
                          aria-label="loading"
                          size="xs"
                        />
                      ) : (
                        <>
                          <CgAddR className="mr-2 h-5 w-5" />
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

      {/* update user modal */}
      <Modal show={isModalEditUserOpen} onClose={toggleEditUserModal} size="xl">
        <Modal.Header className="p-5 shadow-md">Update User</Modal.Header>

        <Formik
          initialValues={initialValuesUpdateUser}
          // validationSchema={validationSchemaUser}
          onSubmit={handleSubmitUpdateUser}
        >
          {({
            values,
            touched,
            errors,
            handleChange,
            handleBlur,
            setFieldValue,
          }) => {
            const onFieldChange = (e) => {
              handleChange(e);
              setIsDataChanged(
                checkDataChanged({ ...values, [e.target.name]: e.target.value })
              );
            };

            const onDateChange = (date) => {
              const newDate = new Date(date);
              newDate.setDate(newDate.getDate() + 1);
              setFieldValue("dateOfBirth", newDate.toISOString().split("T")[0]);
              setIsDataChanged(
                checkDataChanged({
                  ...values,
                  dateOfBirth: newDate.toISOString().split("T")[0],
                })
              );
            };

            const handleImageChange = (file) => {
              setProfileImageFileUpdateUser(file);
              setIsDataChanged(
                checkDataChanged({
                  ...values,
                  profileImage: file.name,
                })
              );
            };

            const onRoleNameChanged = (role) => {
              const updatedRoleName = values.roleName.includes(role)
                ? values.roleName.filter((r) => r !== role)
                : [...values.roleName, role];

              setFieldValue("roleName", updatedRoleName);
              setRolesPlaceHolder(updatedRoleName.join(", ") || "Select Roles");

              setIsDataChanged(
                checkDataChanged({ ...values, roleName: updatedRoleName })
              );
            };
            return (
              <Form className="flex flex-col overflow-auto">
                <Modal.Body>
                  <div className="px-5 flex justify-center">
                    <ProfilePictureUpload
                      setProfileImageFile={handleImageChange}
                      imageUri={values.profileImage}
                    />
                  </div>
                  <div className="flex justify-center items-center gap-1 py-5 text-sm">
                    <div className="w-4 h-[1px] bg-gray-600"></div>
                    <p className="whitespace-nowrap dark:text-gray-200">
                      User Information
                    </p>
                    <div className="w-full h-[1px] bg-gray-600"></div>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-1 gap-5 gap-x-10">
                    <div>
                      <Label className="flex gap-2 mb-2">
                        <TbUser />
                        First Name <span className="text-red-600">*</span>
                      </Label>
                      <TextInput
                        placeholder="Enter first name"
                        style={{
                          backgroundColor: mode === "dark" ? "#1f2937" : "",
                          color: mode === "dark" ? "white" : "",
                        }}
                        id="firstName"
                        name="firstName"
                        type="text"
                        autoComplete="off"
                        value={values.firstName}
                        onChange={onFieldChange}
                        onBlur={handleBlur}
                        color={
                          errors.firstName && touched.firstName
                            ? "failure"
                            : "default"
                        }
                      />
                      {errors.firstName && touched.firstName && (
                        <small className="text-red-600">
                          {errors.firstName}
                        </small>
                      )}
                    </div>
                    <div>
                      <Label className="flex gap-2 mb-2">
                        <TbUser />
                        Last Name <span className="text-red-600">*</span>
                      </Label>
                      <TextInput
                        placeholder="Enter last name"
                        style={{
                          backgroundColor: mode === "dark" ? "#1f2937" : "",
                          color: mode === "dark" ? "white" : "",
                        }}
                        id="lastName"
                        name="lastName"
                        type="text"
                        autoComplete="off"
                        value={values.lastName}
                        onChange={onFieldChange}
                        onBlur={handleBlur}
                        color={
                          errors.lastName && touched.lastName
                            ? "failure"
                            : "default"
                        }
                      />
                      {errors.lastName && touched.lastName && (
                        <small className="text-red-600">
                          {errors.lastName}
                        </small>
                      )}
                    </div>
                    <div>
                      <Label className="flex gap-2 mb-2">
                        <TbUser />
                        Full Name <span className="text-red-600">*</span>
                      </Label>
                      <TextInput
                        placeholder="Enter full name"
                        style={{
                          backgroundColor: mode === "dark" ? "#1f2937" : "",
                          color: mode === "dark" ? "white" : "",
                        }}
                        id="fullName"
                        name="fullName"
                        type="text"
                        autoComplete="off"
                        value={values.fullName}
                        onChange={onFieldChange}
                        onBlur={handleBlur}
                        color={
                          errors.fullName && touched.fullName
                            ? "failure"
                            : "default"
                        }
                      />
                      {errors.fullName && touched.fullName && (
                        <small className="text-red-600">
                          {errors.fullName}
                        </small>
                      )}
                    </div>
                    <div>
                      <Label className="flex gap-2 mb-2">
                        <LuCalendarDays />
                        Date of Birth <span className="text-red-600">*</span>
                      </Label>
                      <Datepicker
                        value={values.dateOfBirth}
                        // theme={customTheme}
                        showTodayButton={false}
                        onChange={onDateChange}
                        style={{
                          backgroundColor: mode === "dark" ? "#1f2937" : "",
                          border:
                            errors.dateOfBirth && touched.dateOfBirth
                              ? "0.0625rem solid red"
                              : mode === "dark"
                                ? "0.0625rem solid #6b7280"
                                : "0.0625rem solid #6b7280",
                          height: "2.7rem",
                        }}
                      />
                      {errors.dateOfBirth && touched.dateOfBirth && (
                        <small className="text-red-600">
                          {errors.dateOfBirth}
                        </small>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="genderName" className="flex gap-2 mb-2">
                        <BsGenderAmbiguous />
                        <span>Gender</span>
                      </Label>
                      <div className="flex gap-4">
                        {Object.values(GENDERS).map((gender) => (
                          <div key={gender} className="flex items-center">
                            <input
                              style={{
                                backgroundColor:
                                  mode === "dark" ? "#1f2937" : "",
                                color: mode === "dark" ? "white" : "",
                              }}
                              type="radio"
                              id={gender}
                              name="genderName"
                              value={gender}
                              checked={values.genderName === gender}
                              onChange={onFieldChange}
                              onBlur={handleBlur}
                            />
                            <Label htmlFor={gender} className="ml-2">
                              {gender}
                            </Label>
                          </div>
                        ))}
                      </div>
                      {errors.gender && touched.gender && (
                        <small className="text-red-600">{errors.gender}</small>
                      )}
                    </div>
                    <div>
                      <Label className="flex gap-2 mb-2" htmlFor="phoneNumber">
                        <IoCallOutline />
                        Phone Number <span className="text-red-600">*</span>
                      </Label>
                      <TextInput
                        placeholder="Enter phone number"
                        style={{
                          backgroundColor: mode === "dark" ? "#1f2937" : "",
                          color: mode === "dark" ? "white" : "",
                        }}
                        id="phoneNumber"
                        name="phoneNumber"
                        type="text"
                        autoComplete="off"
                        value={values.phoneNumber}
                        onChange={onFieldChange}
                        onBlur={handleBlur}
                        color={
                          errors.phoneNumber && touched.phoneNumber
                            ? "failure"
                            : "default"
                        }
                      />
                      {errors.phoneNumber && touched.phoneNumber && (
                        <small className="text-red-600">
                          {errors.phoneNumber}
                        </small>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-center items-center gap-1 py-5 text-sm">
                    <div className="w-4 h-[1px] bg-gray-600"></div>
                    <p className="whitespace-nowrap dark:text-gray-200">
                      User Account
                    </p>
                    <div className="w-full h-[1px] bg-gray-600"></div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-1 gap-x-10 gap-5">
                    <div>
                      <Label className="flex gap-2 mb-2">
                        <IoMailOutline />
                        Email <span className="text-red-600">*</span>
                      </Label>
                      <TextInput
                        placeholder="Enter email"
                        style={{
                          backgroundColor: mode === "dark" ? "#1f2937" : "",
                          color: mode === "dark" ? "white" : "",
                        }}
                        type="email"
                        name="email"
                        id="email"
                        autoComplete="off"
                        value={values.email}
                        onChange={onFieldChange}
                        onBlur={handleBlur}
                        color={
                          errors.email && touched.email ? "failure" : "default"
                        }
                      />
                      {errors.email && touched.email && (
                        <small className="text-red-600">{errors.email}</small>
                      )}
                    </div>
                    <div className="relative" ref={dropdownRef}>
                      <Label htmlFor="roles" className="flex gap-2 mb-2">
                        <GrUserAdmin />
                        Roles <span className="text-red-600">*</span>
                      </Label>
                      <div className="relative">
                        <div
                          onClick={handleToggleRoleCbo}
                          className={`flex justify-between text-sm cursor-pointer dark:bg-gray-800 items-center border border-gray-500 dark:border-gray-500 px-2 py-[0.60rem] rounded-lg text-gray-800 dark:text-gray-200 ${
                            errors.roleName && "border-red-600 text-red-600"
                          }`}
                        >
                          {rolesPlaceHolder}{" "}
                          <IoIosArrowDown className="text-xl" />
                        </div>
                        <Card
                          theme={Cardtheme}
                          className={`w-full absolute top-0 left-0 bg-gray-50 z-10 ${
                            cboRolesToggle ? "flex" : "hidden"
                          }`}
                        >
                          {Object.values(ROLES).map((role) => (
                            <div
                              key={role}
                              className="flex items-center gap-2 py-2 hover:bg-gray-200 cursor-pointer px-5"
                            >
                              <Checkbox
                                id={role}
                                name="roleName"
                                value={role}
                                checked={values.roleName.includes(role)}
                                onChange={() => onRoleNameChanged(role)}
                              />
                              <Label htmlFor={role} className="ml-2">
                                {role}
                              </Label>
                            </div>
                          ))}
                          <div className="w-full  flex justify-end items-center border-t border-t-gray-400 p-2">
                            <Button
                              className="bg-gray-200 text-gray-800 ring-transparent hover:bg-gray-300"
                              onClick={handleDoneButtonClick}
                            >
                              Done
                            </Button>
                          </div>
                        </Card>
                      </div>
                      {errors.roleName && (
                        <small className="text-red-600">
                          {errors.roleName}
                        </small>
                      )}
                    </div>
                  </div>
                </Modal.Body>
                <Modal.Footer className="flex justify-end">
                  <Button
                    type="submit"
                    className="bg-primary hover:bg-primary-hover focus:ring-0 w-24"
                    title="Save"
                    disabled={isLoadingUpdatedUser || !isDataChanged}
                  >
                    {isLoadingUpdatedUser ? (
                      <Spinner
                        theme={spinnerTheme}
                        color="primary"
                        aria-label="loading"
                        size="xs"
                      />
                    ) : (
                      <>
                        <GrUpdate className="mr-2 h-4 w-4" />
                        Update
                      </>
                    )}
                  </Button>
                </Modal.Footer>
              </Form>
            );
          }}
        </Formik>
      </Modal>
    </>
  );

  return content;
}

export default AddNewVehicle;
