import React, { useEffect, useState } from "react";
import {
  useAddNewUserMutation,
  useUploadImageMutation,
} from "../../redux/feature/users/userApiSlice";
import { useNavigate } from "react-router-dom";
import { ROLES } from "./../../config/roles";
import {
  Button,
  Checkbox,
  Datepicker,
  FloatingLabel,
  Label,
  Spinner,
} from "flowbite-react";
import { toast } from "react-toastify";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { IoEyeOffSharp, IoEyeSharp } from "react-icons/io5";
import { GENDERS } from "../../config/genders";

function AddNewUser() {
  const [addNewUser, { isLoading, isSuccess, isError, error }] =
    useAddNewUserMutation();
  const [uploadImage] = useUploadImageMutation();
  const navigate = useNavigate();
  const [roleName, setRoleName] = useState(["STAFF"]);
  const [toggleEye, setToggleEye] = useState(false);

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    fullName: Yup.string().required("Full name is required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm password is required"),
    phoneNumber: Yup.string()
      .matches(/^\d+$/, "Phone number must numbers")
      .required("Phone number is required"),
    image: Yup.mixed()
      .nullable()
      .test("fileSize", "File size is too large", (value) => {
        return value && value.size <= 2000000; // Limit to 2MB
      })
      .test("fileType", "Unsupported File Format", (value) => {
        return (
          value && ["image/jpeg", "image/png", "image/gif"].includes(value.type)
        );
      }),
  });

  useEffect(() => {
    if (isSuccess) {
      setRoleName([]);
      navigate("/dash/users");

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

  const onRoleNameChanged = (role) => {
    if (roleName.includes(role)) {
      // If the role is already in the array, remove it
      setRoleName(roleName.filter((r) => r !== role));
    } else {
      // If the role is not in the array, add it
      setRoleName([...roleName, role]);
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    console.log(values);
    try {
      const formData = new FormData();
      formData.append("file", values.image);
      await uploadImage(formData);
      await addNewUser({
        firstName: values.firstName,
        lastName: values.lastName,
        dateOfBirth: values.dateOfBirth,
        fullName: values.fullName,
        genderName: values.genderName,
        email: values.email,
        password: values.password,
        phoneNumber: values.phoneNumber,
        roleName: roleName,
        
      });
    } catch (error) {
    } finally {
      setSubmitting(false);
    }
  };

  const handleBtnBackClicked = () => {
    navigate("/dash/users");
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

  const content = (
    <>
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
          image: null,
          dateOfBirth: null,
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
        }) => (
          <Form className="p-4">
            <h2 className="text-2xl font-bold">New User</h2>
            <div>
              <FloatingLabel
                id="firstName"
                name="firstName"
                type="text"
                autoComplete="off"
                value={values.firstName}
                onChange={handleChange}
                onBlur={handleBlur}
                variant="outlined"
                label="First Name"
                color={
                  errors.firstName && touched.firstName ? "error" : "default"
                }
              />
              {errors.firstName && touched.firstName && (
                <small className="text-red-600">{errors.firstName}</small>
              )}
            </div>
            <div>
              <FloatingLabel
                id="lastName"
                name="lastName"
                type="text"
                autoComplete="off"
                value={values.lastName}
                onChange={handleChange}
                onBlur={handleBlur}
                variant="outlined"
                label="Last Name"
                color={
                  errors.lastName && touched.lastName ? "error" : "default"
                }
              />
              {errors.lastName && touched.lastName && (
                <small className="text-red-600">{errors.lastName}</small>
              )}
            </div>
            <div>
              <FloatingLabel
                id="fullName"
                name="fullName"
                type="text"
                autoComplete="off"
                value={values.fullName}
                onChange={handleChange}
                onBlur={handleBlur}
                variant="outlined"
                label="Full Name"
                color={
                  errors.fullName && touched.fullName ? "error" : "default"
                }
              />
              {errors.fullName && touched.fullName && (
                <small className="text-red-600">{errors.fullName}</small>
              )}
            </div>
            <div>
              <Datepicker
                theme={customTheme}
                showTodayButton={false}
                onChange={(date) => {
                  const newDate = new Date(date);
                  newDate.setDate(newDate.getDate() + 1);
                  setFieldValue("dateOfBirth", newDate);
                }}
              />
            </div>
            <div>
              <Label htmlFor="genderName">Gender</Label>
              <div className="flex gap-4">
                {Object.values(GENDERS).map((gender) => (
                  <div key={gender} className="flex items-center">
                    <input
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
              <FloatingLabel
                type="email"
                name="email"
                id="email"
                autoComplete="off"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                variant="outlined"
                label="Email"
                color={errors.email && touched.email ? "error" : "default"}
              />
              {errors.email && touched.email && (
                <small className="text-red-600">{errors.email}</small>
              )}
            </div>
            <div className="relative">
              <FloatingLabel
                name="password"
                id="password"
                type={!toggleEye ? "password" : "text"}
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                variant="outlined"
                label="Password"
                color={
                  errors.password && touched.password ? "error" : "default"
                }
              />
              {toggleEye ? (
                <IoEyeSharp
                  className="absolute top-3 right-2 text-xl hover:cursor-pointer"
                  onClick={handleToggleEye}
                />
              ) : (
                <IoEyeOffSharp
                  className="absolute top-3 right-2 text-xl hover:cursor-pointer"
                  onClick={handleToggleEye}
                />
              )}
              {errors.password && touched.password && (
                <small className="text-red-600">{errors.password}</small>
              )}
            </div>
            <div className="relative">
              <FloatingLabel
                name="confirmPassword"
                id="confirmPassword"
                type={!toggleEye ? "password" : "text"}
                value={values.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                variant="outlined"
                label="Confirm Password"
                color={
                  errors.confirmPassword && touched.confirmPassword
                    ? "error"
                    : "default"
                }
              />
              {toggleEye ? (
                <IoEyeSharp
                  className="absolute top-3 right-2 text-xl hover:cursor-pointer"
                  onClick={handleToggleEye}
                />
              ) : (
                <IoEyeOffSharp
                  className="absolute top-3 right-2 text-xl hover:cursor-pointer"
                  onClick={handleToggleEye}
                />
              )}
              {errors.confirmPassword && touched.confirmPassword && (
                <small className="text-red-600">{errors.confirmPassword}</small>
              )}
            </div>
            <div>
              <FloatingLabel
                id="phoneNumber"
                name="phoneNumber"
                type="text"
                autoComplete="off"
                value={values.phoneNumber}
                onChange={handleChange}
                onBlur={handleBlur}
                variant="outlined"
                label="Phone Number"
                color={
                  errors.phoneNumber && touched.phoneNumber
                    ? "error"
                    : "default"
                }
              />
              {errors.phoneNumber && touched.phoneNumber && (
                <small className="text-red-600">{errors.phoneNumber}</small>
              )}
            </div>
            <div>
              <Label htmlFor="roles">Roles</Label>
              <div>
                {Object.values(ROLES).map((role) => (
                  <div key={role} className="flex items-center">
                    <Checkbox
                      id={role}
                      name="roleName"
                      value={role}
                      checked={roleName.includes(role)}
                      onChange={() => onRoleNameChanged(role)}
                    />
                    <Label htmlFor={role} className="ml-2">
                      {role}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="image">Upload Image</Label>
              <input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                onChange={(event) => {
                  setFieldValue("image", event.currentTarget.files[0]); // Set the image in Formik
                }}
                onBlur={handleBlur}
              />
              {errors.image && touched.image && (
                <small className="text-red-600">{errors.image}</small>
              )}
            </div>
            <div className="flex gap-4">
              <Button
                className="bg-transparent ring-1 ring-offset-primary text-primary"
                onClick={handleBtnBackClicked}
              >
                Back
              </Button>
              <Button
                type="submit"
                className="bg-primary"
                title="Save"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Spinner color="purple" aria-label="loading" size="xs" />
                ) : (
                  "Save"
                )}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );

  return content;
}

export default AddNewUser;
