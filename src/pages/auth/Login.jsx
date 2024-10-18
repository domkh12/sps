import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useLoginMutation } from "../../redux/feature/auth/authApiSlice";
import { setCredentials } from "../../redux/feature/auth/authSlice";
import { Button, Card, FloatingLabel, Flowbite, Spinner } from "flowbite-react";
import { toast } from "react-toastify";

export default function Login() {
  const userRef = useRef();
  const errRef = useRef();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [email, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { accessToken } = await login({ email, password }).unwrap();
      dispatch(setCredentials({ accessToken }));
      setEmail("");
      setPassword("");
      navigate("/dash");
      toast.success("Login Successfully", {
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
      if (!error.status) {
        setErrMsg("No Server Response");
        toast.error(
          "No Server Response, please check your network connection."
        );
      } else if (error.status === 400) {
        setErrMsg("Missing Username and Password");

        toast.error("Email or Password is incorrect.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      } else if (error.status === 404) {
        setErrMsg("Unauthorized");
        toast.error("Email or Password is incorrect.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      } else if (error.status === 401) {
        setErrMsg("Unauthorized");
        toast.error("Email or Password is incorrect.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      } else {
        setErrMsg(error?.data?.message);
      }
      // errRef.current.focus();
    }
  };

  const handleEmailInput = (e) => setEmail(e.target.value);
  const handlePwdInput = (e) => setPassword(e.target.value);

  const [login, { isLoading }] = useLoginMutation();
  
  const content = (
    <Flowbite className="bg-white">
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-12 md:grid-cols-1 grid-flow-row justify-center items-center min-h-screen gap-10"
      >
        <section className="md:hidden col-start-2 col-end-6">
          <img src="/images/login.svg" alt="login_image" />
        </section>
        <hr className="w-1 h-[30rem] bg-primary col-span-1 mx-auto md:hidden" />
        <Card className="col-start-7 col-end-12 w-[90%] mx-auto md:col-span-1">
          <div className="grid grid-cols-12 gap-x-3">
            <div className="col-span-2 row-span-2">
              <img src="/images/logo.png" alt="logo" width={50} height={50} />
            </div>
            <span className="font-semibold subpixel-antialiased tracking-wide text-nowrap text-clamp truncate col-span-10">
              ប្រព័ន្ធចតរថយន្តឆ្លាតវៃ
            </span>
            <br />
            <span className="subpixel-antialiased text-nowrap text-clampSmall col-start-3 col-end-13 row-start-2 truncate">
              Smart Parking System
            </span>
          </div>
          <FloatingLabel
            type="email"
            id="email"
            ref={userRef}
            onChange={handleEmailInput}
            value={email}
            autoComplete="off"
            required
            variant="outlined"
            label="Email"
          />
          <FloatingLabel
            type="password"
            id="password"
            value={password}
            onChange={handlePwdInput}
            variant="outlined"
            label="Password"
            required
          />

          <Button
            disabled={isLoading}
            type="submit"
            className="bg-primary w-full hover:bg-primary-hover"
          >
            {isLoading ? (
              <Spinner color="purple" aria-label="loading" size="xs" />
            ) : (
              "Login"
            )}
          </Button>
        </Card>
      </form>
    </Flowbite>
  );

  return content;
}
