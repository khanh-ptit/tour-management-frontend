import { Button, Form, Input, message } from "antd";
import "./Login.scss";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { login } from "../../../services/client/user.service";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "../../../actions/auth";

function Login() {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.authReducer);

  useEffect(() => {
    if (isAuthenticated === true) {
      localStorage.setItem("redirectErrorMessage", "Bạn đã đăng nhập rồi!");
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const successMessage = localStorage.getItem("registerClientSuccessMessage");
    if (successMessage) {
      messageApi.open({
        type: "success",
        content: successMessage,
      });
      localStorage.removeItem("registerClientSuccessMessage"); // Xóa sau khi hiển thị
    }
  }, [messageApi]);

  const handleFinish = async (data) => {
    try {
      const response = await login(data);
      if (response.code === 200) {
        form.resetFields();
        localStorage.setItem("loginClientSuccessMessage", response.message);
        dispatch(loginSuccess(response.user));
        localStorage.setItem("token", response.token); // Lưu token vào localStorage
        localStorage.setItem("user", JSON.stringify(response.user)); // Lưu user vào localStorage
        messageApi.open({
          type: "success",
          content: response.message,
        });
        navigate("/");
      }
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      messageApi.open({
        type: "error",
        content: error.message || "Có lỗi xảy ra khi đăng nhập!",
      });
    }
  };

  return (
    <>
      {contextHolder}
      <div className="container-fluid login-client-container">
        {/* Set background full width ở đây */}
        <div className="container">
          <div className="row justify-content-end">
            <div className="col-xl-4 col-lg-5 col-md-6 col-sm-8 col-12 form-login-client">
              <div className="form-login-client__content">
                <h2 className="form-login-client__title text-center">
                  Đăng nhập
                </h2>
                <Form form={form} onFinish={handleFinish} layout="vertical">
                  <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                      { required: true, message: "Vui lòng nhập email!" },
                    ]}
                  >
                    <Input placeholder="Nhập email" />
                  </Form.Item>
                  <Form.Item
                    label="Mật khẩu"
                    name="password"
                    rules={[
                      { required: true, message: "Vui lòng nhập mật khẩu!" },
                    ]}
                  >
                    <Input.Password
                      style={{ paddingLeft: "4px" }}
                      placeholder="Nhập mật khẩu"
                    />
                  </Form.Item>
                  <div className="form-login-client__link d-flex justify-content-between flex-wrap mb-2">
                    <Link to="/user/password/forgot">Quên mật khẩu?</Link>
                    <Link to="/user/register">Chưa có tài khoản?</Link>
                  </div>

                  <Form.Item>
                    <Button type="primary" htmlType="submit" className="w-100">
                      Đăng nhập
                    </Button>
                  </Form.Item>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
