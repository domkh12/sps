import { useEffect, useRef, useState, useCallback } from "react";
import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentToken } from "../redux/feature/auth/authSlice";
import { useGetUserProfileQuery } from "../redux/feature/auth/authApiSlice.js";

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
  const { data: user, isLoading: isUserLoading, error: userError } = useGetUserProfileQuery("userProfile", {
    skip: !token // Skip the query if no token is available
  });
  const dispatch = useDispatch();

  const MAX_RECONNECT_ATTEMPTS = 5;
  const RECONNECT_INTERVAL = 3000; // 3 seconds

  // Function to check if error is related to token expiry/invalidity
  const isTokenError = useCallback((error) => {
    if (!error) return false;

    // Handle FrameImpl objects (STOMP frame errors)
    if (error.command === 'ERROR') {
      console.log("STOMP ERROR frame detected:", error);

      // Check headers for authentication-related messages
      if (error.headers) {
        const headerMessage = error.headers.message || error.headers.error || '';
        const tokenErrorKeywords = [
          'authentication failed',
          'authentication required',
          'unauthorized',
          'invalid token',
          'expired token',
          'jwt',
          'token',
          '401',
          'forbidden',
          'access denied'
        ];

        if (tokenErrorKeywords.some(keyword =>
            headerMessage.toLowerCase().includes(keyword))) {
          return true;
        }
      }

      // If it's an ERROR frame with no specific message, assume it's auth-related
      // since our Spring Boot config throws auth errors for invalid tokens
      return true;
    }

    // Handle regular error messages
    const errorMessage = error.message || error.toString().toLowerCase();
    const tokenErrorKeywords = [
      'authentication failed',
      'authentication required',
      'unauthorized',
      'invalid token',
      'expired token',
      'jwt',
      'token',
      '401',
      'forbidden',
      'access denied',
      'failed to send message to executorsubscribablechannel'
    ];

    return tokenErrorKeywords.some(keyword =>
        errorMessage.toLowerCase().includes(keyword)
    );
  }, []);

  // Function to refresh the page
  const refreshPage = useCallback(() => {
    console.log("Token expired or invalid. Refreshing page...");
    // Clear any stored authentication data before refresh
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    sessionStorage.clear();

    // Add a small delay to ensure cleanup is complete
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  }, []);

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

    // Check if the error is token-related
    if (isTokenError(err)) {
      console.error("Authentication error detected. Token may be expired or invalid.");
      refreshPage();
      return; // Don't attempt reconnection for token errors
    }

    // For non-token errors, attempt to reconnect if we haven't exceeded max attempts
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
  }, [reconnectAttempts, isTokenError, refreshPage]);

  const connect = useCallback(async () => {
    // Check if we have all required parameters
    if (!token) {
      console.log("WebSocket: No token available, waiting...");
      return;
    }

    if (!user?.uuid) {
      if (isUserLoading) {
        console.log("WebSocket: User profile is loading, waiting...");
        return;
      } else if (userError) {
        console.error("WebSocket: Failed to load user profile:", userError);
        return;
      } else {
        console.warn("WebSocket: User UUID not available");
        return;
      }
    }

    if (!destination) {
      console.warn("WebSocket: No destination provided");
      return;
    }

    console.log("WebSocket: All required parameters available, connecting...", {
      hasToken: !!token,
      userUuid: user?.uuid,
      destination,
      tokenPreview: token?.substring(0, 20) + '...'
    });

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

      // Enhanced error handling for the connection
      socketClient.current.connect(
          {
            Authorization: `Bearer ${token}`,
            uuid: user?.uuid
          },
          () => onConnected(destination),
          (error) => {
            console.error("Raw WebSocket error:", error);

            // Enhanced error processing for different error types
            let processedError = error;

            // Handle FrameImpl objects (STOMP ERROR frames)
            if (error && error.command === 'ERROR') {
              const errorMessage = error.headers?.message ||
                  error.headers?.error ||
                  'Authentication failed';
              processedError = new Error(errorMessage);
              processedError.isStompError = true;
              processedError.originalFrame = error;
            }
            // Handle frame errors with headers
            else if (error && error.headers && error.headers.message) {
              processedError = new Error(error.headers.message);
            }
            // Handle string errors
            else if (typeof error === 'string') {
              processedError = new Error(error);
            }
            // Handle cases where error might be undefined or null
            else if (!error) {
              processedError = new Error('Unknown WebSocket connection error');
            }

            onError(processedError);
          }
      );
    } catch (connectionError) {
      console.error("Failed to initialize WebSocket connection:", connectionError);

      // Check if initialization error is token-related
      if (isTokenError(connectionError)) {
        refreshPage();
        return;
      }

      setError(connectionError);
      setIsLoading(false);
    }
  }, [token, user?.uuid, destination, isUserLoading, userError, onConnected, onError, disconnect, isTokenError, refreshPage]);

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

        // Check if send error is token-related
        if (isTokenError(sendError)) {
          refreshPage();
          return false;
        }

        setError(sendError);
        return false;
      }
    } else {
      console.warn("WebSocket not connected. Cannot send message.");
      return false;
    }
  }, [isConnected, isTokenError, refreshPage]);

  // Monitor token changes and refresh if token becomes null/undefined
  useEffect(() => {
    if (!token && isConnected) {
      console.log("Token is no longer available. Refreshing page...");
      refreshPage();
    }
  }, [token, isConnected, refreshPage]);

  // Effect to handle connection when dependencies are ready
  useEffect(() => {
    // Only attempt to connect if we have token and destination
    // The user loading will be handled inside connect()
    if (token && destination) {
      console.log("WebSocket: Dependencies ready, attempting connection...");
      connect();
    } else {
      console.log("WebSocket: Waiting for dependencies...", {
        hasToken: !!token,
        hasDestination: !!destination,
        hasUser: !!user?.uuid,
        isUserLoading
      });
    }

    return () => {
      disconnect();
    };
  }, [token, destination, user?.uuid, isUserLoading, connect, disconnect]);

  // Reset reconnect attempts when user or token changes
  useEffect(() => {
    setReconnectAttempts(0);
  }, [user?.uuid, token]);

  // Add cleanup on window beforeunload to prevent memory leaks
  useEffect(() => {
    const handleBeforeUnload = () => {
      disconnect();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [disconnect]);

  return {
    isLoading: isLoading || isUserLoading, // Include user loading state
    error,
    messages,
    isConnected,
    reconnectAttempts,
    reconnect,
    sendMessage,
    disconnect: disconnect,
    // Additional state information for debugging
    connectionState: {
      hasToken: !!token,
      hasUser: !!user?.uuid,
      hasDestination: !!destination,
      isUserLoading,
      userError
    }
  };
};

export default useWebSocket;