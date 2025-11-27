import React from "react";
import { Card, Typography, Button, Space } from "antd";
import { LockOutlined, WarningOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const { Title, Text } = Typography;

function Locked() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "red",
        padding: 24,
        animation: "fadeIn 1s ease-in-out",
      }}
    >
      {/* Animation */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }

          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
        `}
      </style>

      <Card
        style={{
          textAlign: "center",
          maxWidth: 400,
          borderRadius: 10,
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
        }}
      >
        <LockOutlined
          style={{
            fontSize: 50,
            color: "#d32f2f",
            marginBottom: 20,
            animation: "bounce 1.5s infinite",
          }}
        />

        <Title level={3} style={{ color: "#d32f2f" }}>
          Thiết Bị Tạm Thời Bị Khoá
        </Title>

        <WarningOutlined style={{ color: "#ffa726", fontSize: 26 }} />

        <Text
          style={{
            display: "block",
            marginTop: 12,
            color: "gray",
            fontSize: 15,
            lineHeight: 1.5,
          }}
        >
          Thiết bị của bạn đã bị khóa do hoạt động bất thường.
          <br />
          Vui lòng thử lại sau.
        </Text>

        <Space direction="vertical" size="middle" style={{ marginTop: 20 }}>
          <Link to="/">
            <Button
              type="primary"
              style={{
                padding: "6px 20px",
                fontSize: 16,
              }}
            >
              Trở Về Trang Chủ
            </Button>
          </Link>
        </Space>
      </Card>
    </div>
  );
}

export default Locked;
