import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentToken } from "../../redux/feature/auth/authSlice";
import { useRefreshMutation } from "../../redux/feature/auth/authApiSlice";
import { Outlet } from "react-router-dom";
import LoadingComponent from "../../components/LoadingComponent";
import usePersist from "../../hook/usePersist";
import Error401Component from "./../../components/Error401Component";
import LoadingOneComponent from "../../components/LoadingOneComponent";
import { selectIsInitialLoading, setInitialLoading } from "../../redux/feature/app/appSlice";

function PersistLogin() {
  const [persist] = usePersist();
  const token = useSelector(selectCurrentToken);
  const [trueSuccess, setTrueSuccess] = useState(false);
  const effectRan = useRef(false);
  const isInitialLoading = useSelector(selectIsInitialLoading);
  const dispatch = useDispatch();
  const [refresh, { isUninitialized, isSuccess, isLoading, isError, error }] =
    useRefreshMutation();

  useEffect(() => {
    if (effectRan.current === true || process.env.NODE_ENV !== "development") {
      const verifyRefreshToken = async () => {
        try {
          dispatch(setInitialLoading(true));
          await refresh();
          setTrueSuccess(true);
        } catch (error) {
          console.log(error);
        } finally {
          dispatch(setInitialLoading(false));
        }
      };

      if (!token && persist) verifyRefreshToken();
    }

    return () => (effectRan.current = true);
  }, []);

  
  let content;
  if (!persist) {
    // persist: no
    content = <Outlet />;
  } else if (isInitialLoading) {
    // persist: yes , token: no
    content = <LoadingOneComponent />;
  } else if (isError) {
    localStorage.removeItem("isRemember");
    content = <Error401Component />;
  } else if (isSuccess && trueSuccess) {
    // persist: yes , token: yes
    content = <Outlet />;
  } else if (token && isUninitialized) {
    content = <Outlet />;
  }

  return content;
}

export default PersistLogin;
