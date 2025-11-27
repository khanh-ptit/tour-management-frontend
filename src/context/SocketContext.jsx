import { createContext, useContext, useEffect, useState } from "react";
import SockJS from "sockjs-client";
import * as Stomp from "@stomp/stompjs";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [stompClient, setStompClient] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const username = localStorage.getItem("username");
    if (!username) return;

    const socket = new SockJS("http://localhost:8080/ws");
    const stomp = Stomp.Stomp.over(socket);

    stomp.connect(
      {},
      () => {
        console.log("STOMP connected");
        setConnected(true);

        // gửi thông báo user đã connect
        const obj = { sender: username, content: `${username} is added` };
        stomp.send("/app/addUser", {}, JSON.stringify(obj));
      },
      (err) => {
        console.error("WS ERROR", err);
      }
    );

    setStompClient(stomp);

    return () => {
      if (stomp) stomp.disconnect(() => console.log("STOMP disconnected"));
    };
  }, []);

  return (
    <SocketContext.Provider value={{ stompClient, connected }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
