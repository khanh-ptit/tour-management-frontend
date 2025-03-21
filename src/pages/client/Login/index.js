import { Button, Form, Input, message, Modal } from "antd";
import "./Login.scss";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  deleteAllOtp,
  forgotPassword,
  login,
  otpPassword,
} from "../../../services/client/user.service";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../../actions/auth";

function Login() {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const [forgotForm] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // const { isAuthenticated } = useSelector((state) => state.authReducer);

  // State quản lý Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false); // State hiển thị OTP input
  const [countdown, setCountdown] = useState(180); // 3 phút
  const [isCounting, setIsCounting] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  // const [isOtpVerified, setIsOtpVerified] = useState(false);

  // useEffect(() => {
  //   if (isAuthenticated === true && !isOtpVerified) {
  //     localStorage.setItem("redirectErrorMessage", "Bạn đã đăng nhập rồi!");
  //     navigate("/");
  //   }
  // }, [isAuthenticated, navigate, isOtpVerified]);

  useEffect(() => {
    let timer;
    if (isCounting && countdown > 0) {
      timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
    } else if (countdown === 0) {
      setIsCounting(false);
    }
    return () => clearTimeout(timer);
  }, [isCounting, countdown]);

  useEffect(() => {
    const successMessage = localStorage.getItem("registerClientSuccessMessage");
    if (successMessage) {
      messageApi.open({
        type: "success",
        content: successMessage,
      });
      localStorage.removeItem("registerClientSuccessMessage"); // Xóa sau khi hiển thị
    }
    if (localStorage.getItem("resetPasswordSuccessMessage")) {
      messageApi.open({
        type: "success",
        content: localStorage.getItem("resetPasswordSuccessMessage"),
      });
      localStorage.removeItem("resetPasswordSuccessMessage");
    }
  }, [messageApi]);

  // Xử lý mở Modal
  const showForgotPasswordModal = () => {
    setIsModalOpen(true);
  };

  // Xử lý đóng Modal
  const handleCancel = async () => {
    setIsModalOpen(false);
    setEmail("");
    setIsOtpSent(false);

    // Nếu đang ở bước nhập OTP, gọi hàm xóa OTP
    if (isOtpSent) {
      try {
        const emailValue = forgotForm.getFieldValue("email"); // Lấy giá trị email từ form
        if (emailValue) {
          await deleteAllOtp(emailValue); // Gọi hàm xóa OTP
        }
      } catch (error) {
        console.error("Lỗi khi xóa OTP:", error);
      }
    }

    forgotForm.resetFields(); // Reset toàn bộ form
  };

  const handleFinish = async (data) => {
    try {
      const response = await login(data);
      if (response.code === 200) {
        form.resetFields();
        localStorage.setItem("loginClientSuccessMessage", response.message);
        dispatch(loginSuccess(response.user));
        localStorage.setItem("cartId", response.cart._id);
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

  // Xử lý gửi email khôi phục
  const handleForgotPassword = async (value) => {
    try {
      if (value === "resend") {
        forgotForm.setFieldsValue({ otp: "" });
        // Reset state OTP
        setOtpValue("");
      }
      const values = await forgotForm.validateFields(["email"]);
      const response = await forgotPassword(values);
      if (response.code === 200) {
        messageApi.success(`Đã gửi yêu cầu khôi phục tới ${values.email}`);
        setIsOtpSent(true); // Hiển thị input OTP sau khi gửi email thành công
        setCountdown(180); // Reset về 3 phút
        setIsCounting(true); // Bắt đầu đếm
      } else if (response.code === 400) {
        messageApi.open({
          type: "error",
          content: response.message,
        });
        return;
      }
    } catch (error) {
      console.log("Lỗi validate form:", error);
    }
  };

  const handleSendOTP = async () => {
    try {
      const email = await forgotForm.validateFields(["email"]);
      const otp = await forgotForm.validateFields(["otp"]);
      const data = {
        email: email.email,
        otp: otp.otp,
      };
      console.log("Dữ liệu form quên mật khẩu:", data);
      const response = await otpPassword(data);
      if (response.code === 200) {
        console.log(response);
        // setIsOtpVerified(true);
        dispatch(loginSuccess(response.user));
        localStorage.setItem("token", response.token); // Lưu token vào localStorage
        localStorage.setItem("user", JSON.stringify(response.user)); // Lưu user vào localStorage
        localStorage.setItem("otpSuccessMessage", response.message);
        navigate("/user/password/reset");
      } else {
        messageApi.open({
          type: "error",
          content: response.message || "Lỗi xác thực OTP!",
        });
      }
    } catch (error) {
      messageApi.open({
        type: "error",
        content: error.message || "Vui lòng nhập đầy đủ thông tin!",
      });
    }
  };

  // Chuyển đổi giây sang định dạng mm:ss
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(
      2,
      "0"
    )}`;
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
                    <Link onClick={showForgotPasswordModal}>
                      Quên mật khẩu?
                    </Link>
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

      {/* Modal nhập email khôi phục */}
      <Modal
        title="Khôi phục mật khẩu"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Hủy
          </Button>,

          !isOtpSent ? (
            <Button
              key="submit"
              type="primary"
              onClick={() => handleForgotPassword("")}
            >
              Gửi yêu cầu
            </Button>
          ) : (
            <Button
              type="primary"
              onClick={() => handleForgotPassword("resend")}
              disabled={isCounting}
            >
              Gửi lại OTP
            </Button>
          ),
          isOtpSent && isCounting && (
            <Button key="verify" type="primary" onClick={handleSendOTP}>
              Xác nhận OTP
            </Button>
          ),
        ]}
      >
        <p>Nhập email của bạn để nhận hướng dẫn đặt lại mật khẩu.</p>
        <Form form={forgotForm} layout="vertical">
          <Form.Item
            initialValue={email}
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Email không hợp lệ!" },
            ]}
          >
            <Input readOnly={isOtpSent} placeholder="Nhập email của bạn" />
          </Form.Item>
          {isOtpSent && (
            <>
              <Form.Item
                label="Mã OTP"
                name="otp"
                rules={[
                  { required: true, message: "Vui lòng nhập mã OTP!" },
                  { len: 6, message: "OTP phải có 6 chữ số!" },
                ]}
              >
                <Input
                  value={otpValue}
                  placeholder="Nhập mã OTP"
                  maxLength={6}
                />
              </Form.Item>
              <p>
                Mã hết hạn sau:{" "}
                <strong style={{ color: "red" }}>
                  {formatTime(countdown)}
                </strong>
              </p>
            </>
          )}
        </Form>
      </Modal>
    </>
  );
}

export default Login;
