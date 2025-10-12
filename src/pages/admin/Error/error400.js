import { Result, Button } from "antd";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Error400() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "400 Bad Request";
  }, []);

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Result
        status="500"
        title="400"
        subTitle="Yêu cầu không hợp lệ. Vui lòng kiểm tra lại đường dẫn hoặc dữ liệu."
        extra={
          <Button type="primary" onClick={() => navigate("/admin")}>
            Quay về trang quản trị
          </Button>
        }
      />
    </div>
  );
}

export default Error400;
