import React, { useEffect, useRef, useState } from "react";
import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { STATUS } from "./../../config/status";
import { useConnectedUserMutation } from "../../redux/feature/users/userApiSlice";
import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setStatus, setUuid } from "../../redux/feature/users/userSlice";

function WebSocket() {
  const uuid = useSelector((state) => state.auth.uuid);
  const token = useSelector((state) => state.auth.token);
  const socketClient = useRef(null);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const status = STATUS.ONLINE;
  const [
    connectedUser,
    { isLoading: isLoadingConnectedUser, error: errorConnectedUser },
  ] = useConnectedUserMutation();

  const connect = async () => {
    setLoading(true);
    if (socketClient.current) {
      console.warn("WebSocket connection already exists.");
      setLoading(false);
      return;
    }

    socketClient.current = Stomp.over(
      () => new SockJS(`${import.meta.env.VITE_API_BASE_URL}/ws`)
    );

    socketClient.current.connect(
      { Authorization: `Bearer ${token}`, uuid: uuid },
      onConnected,
      onError
    );
  };

  const onConnected = () => {
    console.log("Connected successfully to WebSocket for user:", uuid);
    setLoading(false);
    socketClient.current.subscribe(`/topic/update-status`, async (message) => {
      console.log("Received update message:", message);
      const update = JSON.parse(message.body);
      console.log("Parsed update:", update);
      dispatch(setUuid(update.uuid));
      dispatch(setStatus(update.status));
    });

    socketClient.current.send("/app/user/status", {}, JSON.stringify(uuid));
  };

  const onError = async (err) => {
    console.log("Failed to connect to WebSocket:", err);
    setError(err);
    setLoading(false);
  };

  const connectUser = async () => {
    await connectedUser({ uuid, status });
  };

  useEffect(() => {
    connect();
    connectUser();
    const intervalId = setInterval(() => {
      connectUser();
    }, 5 * 60 * 1000);

    return () => {
      clearInterval(intervalId);
      if (socketClient) {
        socketClient.current.disconnect(() => {
          console.log("Disconnected from WebSocket");
        });
        socketClient.current = null;
      }
    };
  }, [uuid, token]);

  return (
    <>
      {loading && <div>Loading...</div>} {/* Display loading message */}
      {error && <div>Error: {error.message}</div>} {/* Display error message */}
      <Outlet />
    </>
  );
}

export default WebSocket;
