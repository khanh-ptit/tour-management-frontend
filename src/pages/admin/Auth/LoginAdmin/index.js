import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Card, message } from "antd";
import "./LoginAdmin.scss"; // Import file SCSS nếu cần
import logoFold from "../../../../images/logo-fold.png";
import { checkLogin } from "../../../../services/admin/auth.service";

const LoginAdmin = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Đăng nhập quản trị | LQK";
  }, []);

  const handleLogin = async (e) => {
    const result = await checkLogin(e);
    console.log(result);
  };

  return (
    <div className="login-container">
      <Card
        title={
          <div className="card-header">
            <div className="card-header__logo">
              <img src={logoFold} alt="Admin Logo" />
            </div>
            <div className="card-header__title">Đăng nhập quản trị</div>
          </div>
        }
        className="login-card"
      >
        <Form className="form-login" layout="vertical" onFinish={handleLogin}>
          <Form.Item
            className="form-login__email"
            label="Email"
            name="email"
            rules={[{ required: true, message: "Vui lòng nhập email!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            className="form-login__email"
            label="Mật khẩu"
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button
              className="form-login__button"
              type="primary"
              htmlType="submit"
              loading={loading}
              block
            >
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default LoginAdmin;
