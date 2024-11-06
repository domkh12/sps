import React, { useEffect, useRef, useState } from "react";
import { useUpdateUserMutation } from "../../redux/feature/users/userApiSlice";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  Checkbox,
  Datepicker,
  Label,
  Spinner,
  TextInput,
  ToggleSwitch,
  useThemeMode,
} from "flowbite-react";
import { toast } from "react-toastify";
import { Form, Formik } from "formik";
import ProfilePictureUpload from "./components/ProfilePictureUpload";
import { TbAccessibleOff, TbUser } from "react-icons/tb";
import { LuCalendarDays } from "react-icons/lu";
import {
  IoCallOutline,
  IoMailOutline,
  IoReturnDownBackOutline,
} from "react-icons/io5";
import { GrUserAdmin } from "react-icons/gr";
import { IoIosArrowDown } from "react-icons/io";
import { ROLES } from "./../../config/roles";
import * as Yup from "yup";
import { GENDERS } from "../../config/genders";
import { useUploadImageMutation } from "../../redux/feature/uploadImage/uploadImageApiSlice";
import { BsGenderAmbiguous } from "react-icons/bs";
import { PiArrowsCounterClockwise } from "react-icons/pi";
import { Cardtheme } from "../../redux/feature/utils/customReactFlowbiteTheme";

function EditUserForm({ user }) {
  const navigate = useNavigate();
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [cboRolesToggle, setCboRolesToggle] = useState(false);
  const { mode } = useThemeMode();
  const dropdownRef = useRef(null);
  const [rolesPlaceHolder, setRolesPlaceHolder] = useState(
    user.roleNames.join(", ")
  );  
  const [isDataChanged, setIsDataChanged] = useState(false);  
  const [updateUser, { isSuccess, isLoading, isError, error }] =
    useUpdateUserMutation();
  const [uploadImage] = useUploadImageMutation();
  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    fullName: Yup.string().required("Full name is required"),
    dateOfBirth: Yup.date().required("Date of birth is required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    phoneNumber: Yup.string()
      .matches(/^\d+$/, "Phone number must numbers")
      .required("Phone number is required"),
    roleName: Yup.array()
      .min(1, "At least one role must be selected")
      .required("Role is required"),
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setCboRolesToggle(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isSuccess) {
      navigate("/dash/users");

      toast.success("Update Successful", {
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
  }, [isSuccess, navigate]);

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

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const formData = new FormData();
      let profileImageUri = null;
      if (profileImageFile) {
        formData.append("file", profileImageFile);
        const uploadResponse = await uploadImage(formData).unwrap();
        profileImageUri = uploadResponse.uri;
      }

      await updateUser({
        id: user.uuid,
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
      });
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleBtnBackClicked = () => {
    navigate("/dash/users");
  };

  const customTheme = {
    views: {
      days: {
        items: {
          item: {
            selected: "bg-primary text-white hover:bg-cyan-600",
          },
        },
      },
    },
  };

  const handleToggleRoleCbo = () => {
    setCboRolesToggle(!cboRolesToggle);
  };

  const initialValues = {
    firstName: user.firstName,
    lastName: user.lastName,
    fullName: user.fullName,
    genderName: user.gender.fullNameEnglish,
    email: user.email,
    phoneNumber: user.phoneNumber,
    profileImage: user.profileImage,
    dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth) : new Date(),
    roleName: user.roleNames,
    isDisabled: user.isDeleted,
  };

  const checkDataChanged = (values) => {
    return JSON.stringify(values) !== JSON.stringify(initialValues);
  };

  const handleDoneButtonClick = () => {
    setCboRolesToggle(false);
  };

  const toggleTheme = {
    toggle: {
      base: "relative rounded-full border after:absolute after:rounded-full after:bg-white after:transition-all",
    },
  };

  const content = (
    <>
      <h1 className="text-2xl font-medium dark:text-gray-100 p-5">
        Update User
      </h1>
      <Formik
        initialValues={initialValues}
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

          const handleImageChange = (file) => {
            setProfileImageFile(file);
            setIsDataChanged(
              checkDataChanged({ ...values, profileImage: file.name })
            );
          };

          return (
            <Form className="flex flex-col gap-5 pb-8">
              <div className="px-5">
                <ProfilePictureUpload
                  setProfileImageFile={handleImageChange}
                  imageUri={user.profileImage}
                />
              </div>
              <div className="flex justify-center items-center gap-1">
                <div className="w-4 h-[1px] bg-gray-600"></div>
                <p className="whitespace-nowrap dark:text-gray-200">
                  User Information
                </p>
                <div className="w-full h-[1px] bg-gray-600"></div>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-5 gap-x-10 px-5">
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
                    <small className="text-red-600">{errors.firstName}</small>
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
                    <small className="text-red-600">{errors.lastName}</small>
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
                    <small className="text-red-600">{errors.fullName}</small>
                  )}
                </div>
                <div>
                  <Label className="flex gap-2 mb-2">
                    <LuCalendarDays />
                    Date of Birth <span className="text-red-600">*</span>
                  </Label>
                  <Datepicker
                    value={values.dateOfBirth}
                    theme={customTheme}
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
                    <small className="text-red-600">{errors.dateOfBirth}</small>
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
                            backgroundColor: mode === "dark" ? "#1f2937" : "",
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
                    onChange={onFieldChange}
                    onBlur={handleBlur}
                    color={
                      errors.phoneNumber && touched.phoneNumber
                        ? "failure"
                        : "default"
                    }
                  />
                  {errors.phoneNumber && touched.phoneNumber && (
                    <small className="text-red-600">{errors.phoneNumber}</small>
                  )}
                </div>
              </div>
              <div className="flex justify-center items-center gap-1">
                <div className="w-4 h-[1px] bg-gray-600"></div>
                <p className="whitespace-nowrap dark:text-gray-200">
                  User Account
                </p>
                <div className="w-full h-[1px] bg-gray-600"></div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-1 gap-x-10 gap-5 px-5">
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
                    {rolesPlaceHolder} <IoIosArrowDown className="text-xl" />
                  </div>
                  <Card
                      theme={Cardtheme}
                      className={`w-full absolute top-0 left-0 bg-gray-50 z-10 ${
                        cboRolesToggle ? "flex" : "hidden"
                      }`}
                    >                         
                      {Object.values(ROLES).map((role) => (
                       
                        <div key={role} className="flex items-center gap-2 py-2 hover:bg-gray-200 cursor-pointer px-5">
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
                        <Button className="bg-gray-200 text-gray-800 ring-transparent hover:bg-gray-300" onClick={handleDoneButtonClick}>Done</Button>
                      </div>
                    </Card>
                    </div>
                  {errors.roleName && (
                    <small className="text-red-600">{errors.roleName}</small>
                  )}
                </div>
                <div>
                <Label htmlFor="roles" className="flex gap-2 mb-2">
                    <TbAccessibleOff />
                    Disabled
                  </Label>
                  <ToggleSwitch
                    checked={values.isDisabled}
                    
                    name="isDisabled"
                    onChange={() => {
                      const newValue = !values.isDisabled;
                      setFieldValue("isDisabled", newValue);
                      setIsDataChanged(
                        checkDataChanged({ ...values, isDisabled: newValue })
                      );
                    }}
                    color="success"
                    theme={toggleTheme}
                  />
                </div>
              </div>
              <div className="flex gap-4 px-5">
                <Button
                  className="bg-transparent focus:ring-0 border border-primary hover:bg-gray-200 text-primary dark:text-gray-50"
                  onClick={handleBtnBackClicked}
                >
                  <IoReturnDownBackOutline className="mr-2" />
                  Back
                </Button>
                <Button
                  type="submit"
                  className="bg-primary hover:bg-primary-hover focus:ring-0 w-24"
                  title="Save"
                  disabled={isLoading || !isDataChanged}
                >
                  {isLoading ? (
                    <Spinner color="purple" aria-label="loading" size="xs" />
                  ) : (
                    <>
                      <PiArrowsCounterClockwise className="mr-2" />
                      Update
                    </>
                  )}
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

export default EditUserForm;
