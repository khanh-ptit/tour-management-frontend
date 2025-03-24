import { Popover, FloatButton, message, Input } from "antd";
import { MessageOutlined, SendOutlined } from "@ant-design/icons";
import { useEffect, useState, useRef } from "react";
import { useSocket } from "../../../context/SocketContext"; // Import socket
import "./ChatPopup.scss";
import { getRoomChatUserId } from "../../../services/client/room.service";
import { getChatByRoom } from "../../../services/client/chat.service";

function ChatPopup({ isChatOpen, setIsChatOpen }) {
  const { socket } = useSocket();
  const [roomChatTitle, setRoomChatTitle] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [chatMessages, setChatMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [roomChatId, setRoomChatId] = useState("");
  const chatEndRef = useRef(null);

  useEffect(() => {
    const fetchRoomChat = async () => {
      try {
        const response = await getRoomChatUserId();
        if (response.code === 200) {
          setRoomChatTitle(response.roomChat.title);
          setRoomChatId(response.roomChat._id);
          const fetchChats = async () => {
            try {
              const responseChat = await getChatByRoom(response.roomChat._id);
              if (responseChat.code === 200) {
                setChatMessages(responseChat.chats);
                scrollToBottom();
              }
            } catch (error) {
              messageApi.open({ type: "error", content: error.message });
            }
          };
          fetchChats();
        }
      } catch (error) {
        messageApi.open({ type: "error", content: error.message });
      }
    };
    fetchRoomChat();
  }, []);

  useEffect(() => {
    if (!socket || !roomChatId) return;

    // Join vào room chat
    socket.emit("JOIN_ROOM", roomChatId);

    // Lắng nghe tin nhắn từ server
    socket.on("SERVER_RETURN_MESSAGE", (newChat) => {
      setChatMessages((prev) => {
        return [...prev, newChat];
      });
      scrollToBottom();
    });

    return () => {
      socket.off("SERVER_RETURN_MESSAGE");
    };
  }, [socket, roomChatId]);

  const scrollToBottom = () => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  };

  useEffect(() => {
    if (isChatOpen) {
      setTimeout(() => {
        scrollToBottom();
      }, 100); // Delay để đảm bảo Popup đã render xong
    }
  }, [isChatOpen, chatMessages]); // Gọi lại khi isChatOpen hoặc chatMessages thay đổi

  const handleSendMessage = async () => {
    if (!messageText.trim() || !socket) return;

    const newMessage = {
      senderType: "User",
      roomChatId: roomChatId,
      content: messageText,
    };

    // console.log("📤 Emitting CLIENT_SEND_MESSAGE:", newMessage);

    // Gửi tin nhắn qua Socket.IO thay vì gọi API
    socket.emit("CLIENT_SEND_MESSAGE", newMessage);

    setMessageText("");
    scrollToBottom();
  };

  return (
    <>
      {contextHolder}
      <Popover
        title={roomChatTitle}
        trigger="click"
        open={isChatOpen}
        onOpenChange={(open) => setIsChatOpen(open)}
        placement="top"
        content={
          <div className="chat-container">
            <div className="chat-messages">
              {chatMessages.map((chat) => (
                <div
                  key={chat._id}
                  className={`chat-message ${
                    chat.senderType === "User" ? "user" : "admin"
                  }`}
                >
                  <p className="chat-sender">{chat.senderName || "Ẩn danh"}</p>
                  <p className="chat-content">{chat.content}</p>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
            <div className="chat-input-container">
              <Input
                placeholder="Nhập tin nhắn..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onPressEnter={handleSendMessage}
                suffix={
                  <SendOutlined
                    className="send-icon"
                    onClick={handleSendMessage}
                  />
                }
              />
            </div>
          </div>
        }
      >
        <FloatButton
          icon={<MessageOutlined />}
          type="primary"
          style={{ right: 24, bottom: 24, height: "50px", width: "50px" }}
        />
      </Popover>
    </>
  );
}

export default ChatPopup;
