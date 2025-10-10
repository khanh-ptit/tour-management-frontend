import { Result, Button } from "antd";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Error403() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "403 Forbidden";
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
        status="403"
        title="403"
        subTitle="Xin lỗi, bạn không có quyền truy cập vào trang này."
        extra={
          <Button type="primary" onClick={() => navigate("/admin")}>
            Quay về trang quản trị
          </Button>
        }
      />
    </div>
  );
}

export default Error403;
