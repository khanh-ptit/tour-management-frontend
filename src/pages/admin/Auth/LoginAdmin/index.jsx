import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Card, message } from "antd";
import "./LoginAdmin.scss"; // Import file SCSS nếu cần
import logoFold from "../../../../images/logo-fold.png";
import { checkAuth, checkLogin } from "../../../../services/admin/auth.service";
import { updateAccount } from "../../../../actions/account";
import { useDispatch } from "react-redux";
import { getPermissions } from "../../../../actions/role";
import axios from "axios";

const LoginAdmin = () => {
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Đăng nhập quản trị | LQK";

    // Kiểm tra nếu người dùng đã đăng nhập thì chuyển hướng
    const check = async () => {
      try {
        const user = await checkAuth(); // Gọi API kiểm tra user
        if (user) {
          navigate("/admin/dashboard");
        }
      } catch (error) {
        console.log("Người dùng chưa đăng nhập.");
      }
    };

    const logoutSuccessMessage = localStorage.getItem("logoutSuccessMessage");
    if (logoutSuccessMessage) {
      messageApi.open({
        type: "success",
        content: logoutSuccessMessage,
      });
      localStorage.removeItem("logoutSuccessMessage");
    }

    check();
  }, [navigate]);

  const handleLogin = async (e) => {
    setLoading(true);
    try {
      const result = await checkLogin(e);
      localStorage.setItem("loginSuccessMessage", result.message);
      dispatch(updateAccount(result.user));
      dispatch(getPermissions(result.role));
        const response=await axios.post( "http://localhost:8080/login",
                {email:e.email,
                  password:e.password,
                })
                 
      const token = response.data.result;

      // Lưu token vào localStorage
      localStorage.setItem('jtoken', token);
      navigate("/admin/dashboard");
    } catch (error) {
      if(error?.response?.data?.message=="User Is Locked"){
                            window.location.href="/locked";
                          //đăng xuất
                          }
                          console.log(error)
      messageApi.error(error.message || "Đăng nhập thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {contextHolder}
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
    </>
  );
};

export default LoginAdmin;
