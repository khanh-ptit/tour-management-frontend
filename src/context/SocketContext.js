import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const SOCKET_URL = "http://localhost:5000"; // Thay bằng URL của backend

    const newSocket = io(SOCKET_URL, {
      auth: {
        token: localStorage.getItem("token"), // Gửi token khi kết nối
      },
    });

    setSocket(newSocket);

    window.socket = newSocket; // Gán vào window để dễ debug

    return () => {
      newSocket.disconnect(); // Ngắt kết nối khi unmount
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
