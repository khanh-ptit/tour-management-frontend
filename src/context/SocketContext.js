import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [tokenAdmin, setTokenAdmin] = useState(null);
  const [tokenUser, setTokenUser] = useState(null);

  useEffect(() => {
    const SOCKET_URL =
      process.env.REACT_APP_SOCKET_URL || "http://localhost:5000";

    // Hàm lấy token từ cookie
    const getTokenFromCookie = (name) => {
      const match = document.cookie.match(
        new RegExp("(^| )" + name + "=([^;]+)")
      );
      return match ? match[2] : null;
    };

    // Lấy token từ localStorage & cookie
    const tokenFromLocalStorage = localStorage.getItem("token");
    const tokenFromCookie = getTokenFromCookie("token");

    // Lưu vào state để component khác có thể sử dụng
    setTokenUser(tokenFromLocalStorage);
    setTokenAdmin(tokenFromCookie);

    // Kết nối socket và gửi cả hai token cho backend
    const newSocket = io(SOCKET_URL, {
      auth: {
        token: tokenFromLocalStorage, // Token của user
        tokenAdmin: tokenFromCookie, // Token admin
      },
    });

    setSocket(newSocket);
    window.socket = newSocket;

    return () => newSocket.disconnect();
  }, []);

  return (
    <SocketContext.Provider value={{ socket, tokenUser, tokenAdmin }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
