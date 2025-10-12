import { Result, Button } from "antd";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Error404Client() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "404 Not Found";
  }, []);

  return (
    <div
      style={{
        minHeight: "calc(50vh - 64px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
      className="container"
    >
      <Result
        status="404"
        title="404"
        subTitle="Xin lỗi, trang bạn tìm kiếm không tồn tại."
        extra={
          <Button type="primary" onClick={() => navigate("/")}>
            Quay về trang chủ
          </Button>
        }
      />
    </div>
  );
}

export default Error404Client;
