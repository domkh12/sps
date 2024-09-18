import React, { useEffect, useState } from "react";
import { Button, Card, Checkbox, Label } from "flowbite-react";
import useTranslation from "../hook/UseTranslation.jsx";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { userLogin } from "../../redux/feature/auth/authAction.js";
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { translate } = useTranslation();

  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .email(translate("error-email"))
      .required(translate("email-is-required")),
    password: Yup.string()
      .required(translate("password-is-required"))
      .min(8, translate("password-min-8"))
      .matches(/[A-Z]/, translate("password-uppercase"))
      .matches(/[a-z]/, translate("password-lowercase"))
      .matches(/[0-9]/, translate("password-number"))
      .matches(/[!@#$%^&*]/, translate("password-special-char")),
  });

  console.table(userInfo);
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    if (userInfo) {
      navigate("/user-profile");
    }
  }, [userInfo, navigate]);

  return (
    <Card className="max-w-md w-[350px] h-[450px] lg:w-[300px] lg:h-[400px] border border-gray-300 shadow-none">
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={LoginSchema}
        onSubmit={(data) => {
          dispatch(userLogin(data));
        }}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form className="flex flex-col gap-4">
            <div className="flex justify-center items-center">
              <img
                src="/logo/logo.png"
                alt="logo"
                className="w-1/3 z-10"
                draggable="false"
                onContextMenu={(e) => e.preventDefault()}
              />
            </div>

            <div>
              <p className="text-2xl font-bold text-center">
                {translate("login-to-account")}
              </p>
            </div>

            <div>
              <Field
                name="email"
                type="email"
                className="w-full border border-gray-300 rounded-md p-2"
                placeholder={translate("email")}
              />
              {errors.email && touched.email && (
                <div className="text-red-500">{errors.email}</div>
              )}
            </div>

            <div className="relative">
              <Field
                name="password"
                type={showPassword ? "text" : "password"}
                className="w-full border border-gray-300 rounded-md p-2"
                placeholder={translate("password")}
              />

              {showPassword ? (
                <IoEyeOffOutline
                  className="absolute right-2 top-5 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                  onClick={togglePasswordVisibility}
                />
              ) : (
                <IoEyeOutline
                  className="absolute right-2 top-5 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                  onClick={togglePasswordVisibility}
                />
              )}

              {errors.password && touched.password && (
                <div className="text-red-500">{errors.password}</div>
              )}
            </div>

            <Button
              type="submit"
              className="bg-blue-800 hover:bg-blue-900 enabled:hover:bg-blue-900"
              disabled={isSubmitting}
            >
              {translate("login")}
            </Button>
          </Form>
        )}
      </Formik>
    </Card>
  );
}
