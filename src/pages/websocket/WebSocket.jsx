import React, { useEffect, useRef } from "react";
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
  const status = STATUS.ONLINE;
  const [
    connectedUser,
    { isLoading: isLoadingConnectedUser, error: errorConnectedUser },
  ] = useConnectedUserMutation();

  const connect = async () => {
    if (socketClient.current) {
      console.warn("WebSocket connection already exists.");
      return;
    }

    socketClient.current = Stomp.over(
      () => new SockJS(`${import.meta.env.VITE_API_BASE_URL}/ws`)
    );

    socketClient.current.connect(
      { Authorization: `Bearer ${token}` },
      onConnected,
      onError
    );
  };

  const onConnected = () => {
    console.log("Connected successfully to WebSocket for user:", uuid);
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
  };

  const connectUser = async () => {
    await connectedUser({ uuid, status });
  };

  useEffect(() => {
    connect();
    connectUser();

    return () => {
      if (socketClient) {
        socketClient.current.disconnect(() => {
          console.log("Disconnected from WebSocket");
        });
        socketClient.current = null;
      }
    };
  }, [uuid, token]);

  return <Outlet />;
}

export default WebSocket;
