import React, { useEffect, useState } from "react";
import { useAddNewUserMutation } from "../../../redux/feature/users/userApiSlice";
import { useNavigate } from "react-router-dom";
import { boolean } from "yup";
import { ROLES } from "./../../../config/roles";
import { Button, Checkbox, Label, TextInput } from "flowbite-react";
import { toast } from "react-toastify";

function AddNewUser() {
  const USER_REGEX = /^[A-z]{3,50}$/;
  const PASSWORD_REGEX = /^[A-z0-9!@#$%]{4,12}$/;
  const EMAIL_REGEX = /^[a-zA-Z0-9_.+\-]+[\x40][a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
  const PHONE_REGEX = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/;

  const [addNewUser, { isLoading, isSuccess, isError, error }] =
    useAddNewUserMutation();

  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [isValidFullName, setIsValidFullName] = useState(false);
  const [email, setEmail] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isValidPhoneNumber, setIsValidPhoneNumber] = useState(false);
  const [isValidPassword, setIsValidPassword] = useState(false);
  const [isValidConfirmPassword, setIsValidConfirmPassword] = useState(false);
  const [roleName, setRoleName] = useState(["STAFF"]); 

  useEffect(() => {
    setIsValidFullName(USER_REGEX.test(fullName));
  }, [fullName]);

  useEffect(() => {
    setIsValidEmail(EMAIL_REGEX.test(email));
  }, [email]);

  useEffect(() => {
    setIsValidPassword(PASSWORD_REGEX.test(password));
  }, [password]);

  useEffect(() => {
    setIsValidPhoneNumber(PHONE_REGEX.test(phoneNumber));
  }, [phoneNumber]);

  useEffect(() => {
    setIsValidConfirmPassword(PASSWORD_REGEX.test(confirmPassword));
  }, [confirmPassword]);

  useEffect(() => {
    if (isSuccess) {
      setFullName("");
      setEmail("");
      setPassword("");
      setPhoneNumber("");
      setRoleName([]);
      navigate("/dash/users");

      toast.success("Success", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: "dark",
      });
    }
  }, [isSuccess, navigate]);

  useEffect(() => {
    if (isError) {
      toast.error(`${error?.data?.error?.description}`, {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: "dark",
      });
    }
  }, [isError]);

  const onFullNameChanged = (e) => setFullName(e.target.value);
  const onEmailChanged = (e) => setEmail(e.target.value);
  const onPasswordChanged = (e) => setPassword(e.target.value);
  const onPhoneNumberChanged = (e) => setPhoneNumber(e.target.value);
  const onConfirmPasswordChanged = (e) => setConfirmPassword(e.target.value)

  const onRoleNameChanged = (role) => {
    if (roleName.includes(role)) {
      // If the role is already in the array, remove it
      setRoleName(roleName.filter((r) => r !== role));
    } else {
      // If the role is not in the array, add it
      setRoleName([...roleName, role]);
    }
  };

  const canSave =
    [
      roleName.length,
      isValidFullName,
      isValidEmail,
      isValidPassword,
      isValidPhoneNumber,
      isValidConfirmPassword
    ].every(boolean) && !isLoading;

  const onSaveUserClicked = async (e) => {
    e.preventDefault();
    if (canSave) {
      await addNewUser({ fullName, email, password, roleName, phoneNumber });
    }
  };

  const handleBtnBackClicked = () => {
    navigate("/dash/users");
  };

  const content = (
    <>
      <form onSubmit={onSaveUserClicked} className="p-4">
        <h2 className="text-xl font-bold">New User</h2>
        <Label htmlFor="fullName" id="fullName">
          Full Name
        </Label>
        <TextInput
          id="fullName"
          name="fullName"
          type="text"
          autoComplete="off"
          value={fullName}
          onChange={onFullNameChanged}
        />
        <Label htmlFor="">Email</Label>
        <TextInput
          type="email"
          name="email"
          id="email"
          autoComplete="off"
          value={email}
          onChange={onEmailChanged}
        />
        <Label htmlFor="">Password</Label>
        <TextInput
          type="password"
          name="password"
          id="password"
          value={password}
          onChange={onPasswordChanged}
        />
        <Label htmlFor="">Confirm Password</Label>
        <TextInput
          type="confirmPassword"
          name="confirmPassword"
          id="confirmPassword"
          value={confirmPassword}
          onChange={onConfirmPasswordChanged}
        />
        <Label htmlFor="">PhoneNumber</Label>
        <TextInput
          type="text"
          autoComplete="off"
          name="phoneNumber"
          id="phoneNumber"
          value={phoneNumber}
          onChange={onPhoneNumberChanged}
        />
        <Label htmlFor="">Roles</Label>
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
        <div className="flex gap-4">
          <Button
            className="bg-transparent ring-1 ring-offset-primary text-primary"      
            onClick={handleBtnBackClicked}
          >
            Back
          </Button>
          <Button
            type="submit"
            className="bg-blue-700"
            title="Save"
            disabled={!canSave}
          >
            Save
          </Button>
        </div>
      </form>
    </>
  );

  return content;
}

export default AddNewUser;
