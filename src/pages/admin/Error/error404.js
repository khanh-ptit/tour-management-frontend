import { Result, Button } from "antd";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Error404() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "404 Not Found";
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Result
        status="404"
        title="404"
        subTitle="Xin lỗi, trang bạn tìm kiếm không tồn tại."
        extra={
          <Button type="primary" onClick={() => navigate("/admin")}>
            Quay về trang quản trị
          </Button>
        }
      />
    </div>
  );
}

export default Error404;
