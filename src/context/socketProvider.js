import React, { createContext, useContext, useMemo } from "react";
import { io } from "socket.io-client";
const SocketContext = createContext(null);

export const useSocket = () => {
  const socket = useContext(SocketContext);
  return socket;
};

export const SocketProvider = (props) => {
  const socket = useMemo(() => 
    io("https://gurucoolserver-1.onrender.com/", {
      transports: ["websocket"], // Use WebSocket only
      reconnection: true,        // Enable reconnection
      reconnectionAttempts: 5,   // Number of reconnection attempts
      reconnectionDelay: 5000,   // Delay between reconnections
    }), []
  );

  return (
    <SocketContext.Provider value={socket}>
      {props.children}
    </SocketContext.Provider>
  );
};
