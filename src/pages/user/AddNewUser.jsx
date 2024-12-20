import React, { useEffect, useRef, useState } from "react";
import { useAddNewUserMutation } from "../../redux/feature/users/userApiSlice";
import { useNavigate } from "react-router-dom";
import { ROLES } from "./../../config/roles";
import {
  Button,
  Card,
  Checkbox,
  Datepicker,
  Label,
  Spinner,
  TextInput,
  useThemeMode,
} from "flowbite-react";
import { toast } from "react-toastify";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import {
  IoCallOutline,
  IoMailOutline,
  IoReturnDownBackOutline,
} from "react-icons/io5";
import { GENDERS } from "../../config/genders";
import { useUploadImageMutation } from "../../redux/feature/uploadImage/uploadImageApiSlice";
import ProfilePictureUpload from "./components/ProfilePictureUpload";
import { GrUserAdmin } from "react-icons/gr";
import { IoIosArrowDown } from "react-icons/io";
import { TbEye, TbEyeClosed, TbUser } from "react-icons/tb";
import { LuCalendarDays, LuSave } from "react-icons/lu";
import { RiLockPasswordLine } from "react-icons/ri";
import { BsGenderAmbiguous } from "react-icons/bs";
import { Cardtheme } from "../../redux/feature/utils/customReactFlowbiteTheme";

function AddNewUser() {
  const [addNewUser, { isLoading, isSuccess, isError, error }] =
    useAddNewUserMutation();
  const [uploadImage] = useUploadImageMutation();
  const navigator = useNavigate();
  const [toggleEye, setToggleEye] = useState(false);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [cboRolesToggle, setCboRolesToggle] = useState(false);
  const { mode } = useThemeMode();
  const dropdownRef = useRef(null);
  const [rolesPlaceHolder, setRolesPlaceHolder] = useState("STAFF");

  const validationSchema = Yup.object().shape({
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
      navigator("/dash/users");

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

  const handleSubmit = async (values, { setSubmitting }) => {
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

  const handleBtnBackClicked = () => {
    navigator("/dash/users");
  };

  const handleToggleEye = () => {
    setToggleEye(!toggleEye);
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

  const handleDoneButtonClick = () => {
    setCboRolesToggle(false);
  };

  const content = (
    <>
      <h2 className="text-2xl font-medium dark:text-gray-100 p-5">
        Create User
      </h2>
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
            <Form className="flex flex-col gap-5 pb-8">
              <div className="px-5">
                <ProfilePictureUpload
                  setProfileImageFile={setProfileImageFile}
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
                    onChange={handleChange}
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
                    onChange={handleChange}
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
                    onChange={handleChange}
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
                    theme={customTheme}
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
                    <small className="text-red-600">{errors.password}</small>
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
              <div className="flex gap-4 px-5">
                <Button
                  className="bg-transparent focus:ring-0 border border-primary hover:bg-gray-200 text-primary dark:text-gray-50"
                  onClick={handleBtnBackClicked}
                >
                  <IoReturnDownBackOutline className="mr-2" /> Back
                </Button>
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
    </>
  );

  return content;
}

export default AddNewUser;
