import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { refreshToken } from "../../redux/feature/auth/authSlice";
import { Spinner } from "flowbite-react";

function ProtectedRoute() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    let refreshInterval;

    const attemptRefresh = async () => {
      if (token) {
        try {
          await dispatch(refreshToken()).unwrap();
        } catch (error) {
          console.error("Token refresh failed:", error);
        }
      }
      setIsLoading(false);
    };

    attemptRefresh();

    // Set up periodic token refresh
    refreshInterval = setInterval(attemptRefresh, 14 * 60 * 1000);

    return () => {
      if (refreshInterval) clearInterval(refreshInterval);
    };
  }, [dispatch, token]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner size="xl" />
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

export default ProtectedRoute;
