import { message } from "antd";
import { useEffect } from "react";

function Dashboard() {
  const [messageApi, contextHolder] = message.useMessage();
  useEffect(() => {
    document.title = "Trang tổng quan";
  }, []);

  useEffect(() => {
    const successMessage = localStorage.getItem("loginSuccessMessage");
    if (successMessage) {
      messageApi.open({
        type: "success",
        content: successMessage,
      });
      localStorage.removeItem("loginSuccessMessage"); // Xóa sau khi hiển thị
    }
  }, []);

  return (
    <>
      {contextHolder}
      <div>Dashboard</div>
    </>
  );
}

export default Dashboard;
