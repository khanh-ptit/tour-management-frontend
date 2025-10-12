import { Result, Button } from "antd";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Error400Client() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "400 Bad Request";
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
        status="500"
        title="400"
        subTitle="Yêu cầu không hợp lệ. Vui lòng kiểm tra lại đường dẫn hoặc dữ liệu."
        extra={
          <Button type="primary" onClick={() => navigate("/")}>
            Quay về trang chủ
          </Button>
        }
      />
    </div>
  );
}

export default Error400Client;
