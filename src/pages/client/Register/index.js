import { Button, Form, Input, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import "./Register.scss";
import { register } from "../../../services/client/user.service";
import { useSelector } from "react-redux";
import { useEffect } from "react";

function Register() {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.authReducer);

  useEffect(() => {
    if (isAuthenticated === true) {
      localStorage.setItem("redirectErrorMessage", "Bạn đã đăng nhập rồi!");
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleFinish = async (data) => {
    try {
      const response = await register(data);
      if (response.code === 201) {
        form.resetFields();
        localStorage.setItem("registerClientSuccessMessage", response.message);
        navigate("/user/login");
      }
    } catch (error) {
      console.error("Lỗi đăng ký:", error);

      // Hiển thị thông báo lỗi từ server (nếu có)
      messageApi.open({
        type: "error",
        content: error.message || "Có lỗi xảy ra khi đăng ký!",
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
            <div className="col-12 form-register-client">
              <div className="form-register-client__content">
                <h2 className="form-register-client__title text-center">
                  Đăng ký tài khoản
                </h2>
                <Form form={form} onFinish={handleFinish} layout="vertical">
                  <Form.Item
                    label="Họ và tên"
                    name="fullName"
                    rules={[
                      { required: true, message: "Vui lòng nhập họ tên!" },
                    ]}
                  >
                    <Input placeholder="Nhập họ và tên" />
                  </Form.Item>
                  <div className="row">
                    <div className="col-md-6 col-sm-12 col-12">
                      <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                          { required: true, message: "Vui lòng nhập email!" },
                        ]}
                      >
                        <Input placeholder="Nhập email" />
                      </Form.Item>
                    </div>
                    <div className="col-md-6 col-sm-12 col-12">
                      <Form.Item
                        label="Số điện thoại"
                        name="phone"
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng nhập số điện thoại!",
                          },
                        ]}
                      >
                        <Input placeholder="Nhập số điện thoại" />
                      </Form.Item>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 col-sm-12 col-12">
                      <Form.Item
                        label="Mật khẩu"
                        name="password"
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng nhập mật khẩu!",
                          },
                        ]}
                      >
                        <Input.Password
                          style={{ paddingLeft: "4px" }}
                          placeholder="Nhập mật khẩu"
                        />
                      </Form.Item>
                    </div>
                    <div className="col-md-6 col-sm-12 col-12">
                      <Form.Item
                        label="Nhập lại mật khẩu"
                        name="confirmPassword"
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng xác nhận mật khẩu!",
                          },
                        ]}
                      >
                        <Input.Password
                          style={{ paddingLeft: "4px" }}
                          placeholder="Nhập mật khẩu"
                        />
                      </Form.Item>
                    </div>
                  </div>

                  <div className="form-register-client__link text-end mb-2">
                    <Link to="/user/login">
                      Đã có tài khoản? Đăng nhập tại đây
                    </Link>
                  </div>

                  <Form.Item>
                    <Button type="primary" htmlType="submit" className="w-100">
                      Đăng ký
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

export default Register;
