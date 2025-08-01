import { useEffect, useRef, useState, useCallback } from "react";
import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentToken } from "../redux/feature/auth/authSlice";
import {useGetUserProfileQuery} from "../redux/feature/auth/authApiSlice.js";

const useWebSocket = (destination) => {
  const socketClient = useRef(null);
  const subscriptionRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [messages, setMessages] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);

  const token = useSelector(selectCurrentToken);
  const {data:user} = useGetUserProfileQuery("userProfile");
  const MAX_RECONNECT_ATTEMPTS = 5;
  const RECONNECT_INTERVAL = 3000; // 3 seconds

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe();
      subscriptionRef.current = null;
    }

    if (socketClient.current) {
      socketClient.current.disconnect(() => {
        console.log("Disconnected from WebSocket");
      });
      socketClient.current = null;
    }

    setIsConnected(false);
    setIsLoading(false);
  }, []);

  const onConnected = useCallback((destination) => {
    console.log("Connected to WebSocket");
    setIsLoading(false);
    setIsConnected(true);
    setError(null);
    setReconnectAttempts(0);

    // Subscribe to the destination
    if (socketClient.current && destination) {
      subscriptionRef.current = socketClient.current.subscribe(destination, (message) => {
        try {
          const update = JSON.parse(message.body);
          setMessages(prevMessages => {
            // If you want to accumulate messages, use this:
            // return [...prevMessages, update];
            // If you want to replace with the latest message, use this:
            return update;
          });
        } catch (parseError) {
          console.error("Failed to parse WebSocket message:", parseError);
          setError(new Error("Failed to parse message"));
        }
      });
    }
  }, []);

  const onError = useCallback((err) => {
    console.error("WebSocket connection failed:", err);
    setIsLoading(false);
    setIsConnected(false);
    setError(err);

    // Attempt to reconnect if we haven't exceeded max attempts
    if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
      console.log(`Attempting to reconnect... (${reconnectAttempts + 1}/${MAX_RECONNECT_ATTEMPTS})`);
      reconnectTimeoutRef.current = setTimeout(() => {
        setReconnectAttempts(prev => prev + 1);
        connect();
      }, RECONNECT_INTERVAL);
    } else {
      console.error("Max reconnection attempts reached");
      setError(new Error("Connection failed after multiple attempts"));
    }
  }, [reconnectAttempts]);

  const connect = useCallback(async () => {
    // Don't connect if we don't have required data
    if (!token || !user?.uuid || !destination) {
      console.warn("Missing required connection parameters");
      return;
    }

    setIsLoading(true);
    setError(null);

    // Disconnect existing connection if any
    if (socketClient.current) {
      disconnect();
    }

    try {
      socketClient.current = Stomp.over(
          () => new SockJS(`${import.meta.env.VITE_API_BASE_URL}/ws`)
      );

      // Disable debug logs in production
      // eslint-disable-next-line no-undef
      socketClient.current.debug = process.env.NODE_ENV === 'development'
          ? (str) => console.log(str)
          : () => {};

      // Set heartbeat intervals for better connection monitoring
      socketClient.current.heartbeatIncoming = 4000;
      socketClient.current.heartbeatOutgoing = 4000;

      // Set reconnect delay
      socketClient.current.reconnectDelay = RECONNECT_INTERVAL;

      socketClient.current.connect(
          {
            Authorization: `Bearer ${token}`,
            uuid: user?.uuid
          },
          () => onConnected(destination),
          onError
      );
    } catch (connectionError) {
      console.error("Failed to initialize WebSocket connection:", connectionError);
      setError(connectionError);
      setIsLoading(false);
    }
  }, [token, user?.uuid, destination, onConnected, onError, disconnect]);

  // Manual reconnect function
  const reconnect = useCallback(() => {
    setReconnectAttempts(0);
    connect();
  }, [connect]);

  // Send message function
  const sendMessage = useCallback((destination, message) => {
    if (socketClient.current && isConnected) {
      try {
        socketClient.current.send(destination, {}, JSON.stringify(message));
        return true;
      } catch (sendError) {
        console.error("Failed to send message:", sendError);
        setError(sendError);
        return false;
      }
    } else {
      console.warn("WebSocket not connected. Cannot send message.");
      return false;
    }
  }, [isConnected]);

  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  // Reset reconnect attempts when user or token changes
  useEffect(() => {
    setReconnectAttempts(0);
  }, [user?.uuid, token]);

  return {
    isLoading,
    error,
    messages,
    isConnected,
    reconnectAttempts,
    reconnect,
    sendMessage,
    disconnect: disconnect
  };
};

export default useWebSocket;