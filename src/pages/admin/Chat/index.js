import { useEffect, useState, useRef } from "react";
import { message, List, Avatar, Input, Layout, Button } from "antd";
import { SendOutlined } from "@ant-design/icons";
import { getRoomChatAdmin } from "../../../services/admin/room-chat.service";
import { getChatByRoom } from "../../../services/admin/chat.service";
import { useSocket } from "../../../context/SocketContext";
import "./ChatAdmin.scss"; // Import SCSS thông thường
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const { Sider, Content } = Layout;

function ChatAdmin() {
  const { socket } = useSocket();
  const [messageApi, contextHolder] = message.useMessage();
  const [rooms, setRooms] = useState([]);
  const [activeRoom, setActiveRoom] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const chatEndRef = useRef(null); // Ref để cuộn xuống cuối danh sách
  const { permissions } = useSelector((state) => state.roleReducer);
  const navigate = useNavigate();

  useEffect(() => {
    if (!permissions.includes("chat_chat")) {
      navigate("/admin/error/403");
    }
    document.title = "Chăm sóc khách hàng | Admin";
  }, []);

  useEffect(() => {
    const fetchRoomChat = async () => {
      try {
        const response = await getRoomChatAdmin();
        if (response.code === 200) {
          setRooms(response.roomsChat);
        }
      } catch (error) {
        console.error(error);
        messageApi.open({ type: "error", content: error.message });
      }
    };
    fetchRoomChat();
  }, []);

  useEffect(() => {
    if (!socket || !activeRoom) return;

    socket.emit("JOIN_ROOM", activeRoom._id);
    socket.on("SERVER_RETURN_MESSAGE", (newChat) => {
      setChatMessages((prev) => [...prev, newChat]);
      scrollToBottom();
    });

    return () => {
      socket.off("SERVER_RETURN_MESSAGE");
    };
  }, [socket, activeRoom]);

  const handleRoomClick = async (room) => {
    setActiveRoom(room);
    try {
      const response = await getChatByRoom(room._id);
      if (response.code === 200) {
        setChatMessages(response.chats);
        scrollToBottom();
      }
    } catch (error) {
      console.error(error);
      messageApi.open({ type: "error", content: "Không thể tải tin nhắn" });
    }
  };

  const handleSendMessage = () => {
    if (!messageText.trim() || !socket || !activeRoom) return;

    const newMessage = {
      senderType: "Account",
      roomChatId: activeRoom._id,
      content: messageText,
    };
    socket.emit("CLIENT_SEND_MESSAGE", newMessage);
    setMessageText("");
    setTimeout(scrollToBottom, 100); // Cuộn xuống khi gửi tin nhắn
  };

  const scrollToBottom = () => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  return (
    <Layout className="chat-admin">
      {contextHolder}
      <Sider width={300} className="chat-sidebar">
        <h2>Danh sách Chat</h2>
        <List
          itemLayout="horizontal"
          dataSource={rooms}
          renderItem={(room) => (
            <List.Item
              className={`chat-room ${
                activeRoom?._id === room._id ? "active" : ""
              }`}
              onClick={() => handleRoomClick(room)}
            >
              <List.Item.Meta
                avatar={<Avatar>{room.user.fullName.charAt(0)}</Avatar>}
                title={room.user.fullName}
                description={room.title}
              />
            </List.Item>
          )}
        />
      </Sider>
      <Content className="chat-content">
        {activeRoom ? (
          <>
            <div className="chat-header">{activeRoom.title}</div>
            <div className="chat-messages">
              {chatMessages.map((chat, index) => (
                <div
                  key={index}
                  className={`chat-message ${
                    chat.senderType === "Account" ? "admin" : "user"
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
                  <Button type="primary" onClick={handleSendMessage}>
                    <SendOutlined />
                  </Button>
                }
              />
            </div>
          </>
        ) : (
          <div className="chat-placeholder">
            Chọn một cuộc trò chuyện để bắt đầu
          </div>
        )}
      </Content>
    </Layout>
  );
}

export default ChatAdmin;
