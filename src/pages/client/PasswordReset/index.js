import { Button, Input, message, Form } from "antd";
import { useEffect } from "react";
import { resetPassword } from "../../../services/client/user.service";
import { useDispatch } from "react-redux";
import { logout } from "../../../actions/auth";
import { useNavigate } from "react-router-dom";

function PasswordReset() {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const successMessage = localStorage.getItem("otpSuccessMessage");
    if (successMessage) {
      messageApi.open({
        type: "success",
        content: successMessage,
      });
      localStorage.removeItem("otpSuccessMessage"); // Xóa sau khi hiển thị
    }
  }, [messageApi]);

  const handleFinish = async (data) => {
    try {
      console.log("Dữ liệu gửi đi:", data);
      const response = await resetPassword(data);
      if (response.code == 200) {
        dispatch(logout());
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.setItem("resetPasswordSuccessMessage", response.message);
        navigate("/user/login");
      }
    } catch (error) {
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
        <div className="container">
          <div className="row justify-content-end">
            <div className="col-xl-4 col-lg-5 col-md-6 col-sm-8 col-12 form-login-client">
              <div className="form-login-client__content">
                <h2 className="form-login-client__title text-center">
                  Đặt lại mật khẩu
                </h2>
                <Form form={form} onFinish={handleFinish} layout="vertical">
                  <Form.Item
                    label="Mật khẩu"
                    name="password"
                    rules={[
                      { required: true, message: "Vui lòng nhập mật khẩu!" },
                      { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" },
                    ]}
                  >
                    <Input.Password placeholder="Nhập mật khẩu" />
                  </Form.Item>
                  <Form.Item
                    label="Nhập lại mật khẩu"
                    name="confirmPassword"
                    dependencies={["password"]}
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng xác nhận mật khẩu!",
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue("password") === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            new Error("Mật khẩu xác nhận không trùng khớp!")
                          );
                        },
                      }),
                    ]}
                  >
                    <Input.Password placeholder="Nhập lại mật khẩu" />
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" htmlType="submit" className="w-100">
                      Xác nhận
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

export default PasswordReset;
