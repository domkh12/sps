import React, { useEffect, useRef, useState } from "react";
import { Button, Card, Spinner } from "flowbite-react";
import useTranslation from "../hook/UseTranslation.jsx";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function LoginForm() {
  const [success, setSuccess] = useState(false);
  const { isLoading, error } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { translate } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);

  const emailRef = useRef(null);
  const errRef = useRef("");
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [email, pwd]);

  // const LoginSchema = Yup.object().shape({
  //   email: Yup.string()
  //     .email(translate("error-email"))
  //     .required(translate("email-is-required")),
  //   password: Yup.string()
  //     .required(translate("password-is-required"))
  //     .min(8, translate("password-min-8"))
  //     .matches(/[A-Z]/, translate("password-uppercase"))
  //     .matches(/[a-z]/, translate("password-lowercase"))
  //     .matches(/[0-9]/, translate("password-number"))
  //     .matches(/[!@#$%^&*]/, translate("password-special-char")),
  // });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(email, pwd);
    setEmail("");
    setPwd("");
    setSuccess(true);
  };

  return (
    <>
      {success ? (
        // navigate("/admin/dashboard")
        <h1>hello</h1>
      ) : (
        <Card className="max-w-md w-[350px] h-[450px] lg:w-[300px] lg:h-[400px] border border-gray-300 shadow-none">
          {/* <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={LoginSchema}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              const result = await dispatch(login(values)).unwrap();
              if (!result) {
                toast.error("Username and password ");
              } else {
                navigate("/admin/dashboard");
              }
            } catch (error) {
              toast.error("Username and password invalid!");
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ errors, touched, isSubmitting }) => ( */}
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
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
              <input
                name="email"
                type="email"
                ref={emailRef}
                autoComplete="off"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                className="w-full border border-gray-300 rounded-md p-2"
                placeholder={translate("email")}
              />
              {/* {errors.email && touched.email && (
                  <div className="text-red-500">{errors.email}</div>
                )} */}
            </div>

            <div className="relative">
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  onChange={(e) => setPwd(e.target.value)}
                  value={pwd}
                  className="w-full border border-gray-300 rounded-md p-2 pr-10"
                  placeholder={translate("password")}
                />

                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <IoEyeOff className="h-5 w-5 text-gray-500" />
                  ) : (
                    <IoEye className="h-5 w-5 text-gray-500" />
                  )}
                </button>
              </div>

              {/* {errors.password && touched.password && (
                  <div className="text-red-500">{errors.password}</div>
                )} */}
            </div>

            <button
              type="submit"
              className="bg-blue-800 hover:bg-blue-900 enabled:hover:bg-blue-900"
              // disabled={isSubmitting || isLoading}
            >
              {isLoading ? (
                <Spinner aria-label="Login..." size="sm" />
              ) : (
                translate("login")
              )}
            </button>

            {/* {error && <div className="text-red-500">{error}</div>} */}
          </form>
          {/* )}
        </Formik> */}
        </Card>
      )}
    </>
  );
}
