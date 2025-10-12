import { Result, Button } from "antd";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Error403Client() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "403 Forbidden";
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
    >
      <Result
        status="403"
        title="403"
        subTitle="Xin lỗi, bạn không có quyền truy cập vào trang này."
        extra={
          <Button type="primary" onClick={() => navigate("/")}>
            Quay về trang chủ
          </Button>
        }
      />
    </div>
  );
}

export default Error403Client;
