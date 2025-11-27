import { Button, Form, Input, message, Modal } from "antd";
import { Link, useNavigate } from "react-router-dom";
import "./Register.scss";
import {
  deleteAllVerifyOtp,
  register,
  resendVerifyOtp,
  verifyUser,
} from "../../../services/client/user.service";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";

function Register() {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const [verifyForm] = Form.useForm();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.authReducer);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);

  // OTP expire (3 phút)
  const [expireCountdown, setExpireCountdown] = useState(180);
  const [isExpiring, setIsExpiring] = useState(false);

  // Resend cooldown (60s)
  const [resendCountdown, setResendCountdown] = useState(0);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    let timer;
    if (isExpiring && expireCountdown > 0) {
      timer = setTimeout(() => setExpireCountdown((prev) => prev - 1), 1000);
    } else if (expireCountdown === 0 && isExpiring) {
      messageApi.open({
        type: "info",
        content: "OTP đã hết hạn, vui lòng xác thực lại!",
      });
      setIsExpiring(false);
      setIsOtpSent(false);
    }
    return () => clearTimeout(timer);
  }, [isExpiring, expireCountdown, messageApi]);

  useEffect(() => {
    let timer;
    if (isResending && resendCountdown > 0) {
      timer = setTimeout(() => setResendCountdown((prev) => prev - 1), 1000);
    } else if (resendCountdown === 0 && isResending) {
      // cooldown kết thúc
      setIsResending(false);
    }
    return () => clearTimeout(timer);
  }, [isResending, resendCountdown]);

  useEffect(() => {
    if (isAuthenticated === true) {
      localStorage.setItem("redirectErrorMessage", "Bạn đã đăng nhập rồi!");
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleFinish = async (data) => {
    try {
      setEmail(data?.email);
      const response = await register(data);

            await axios.post( "http://localhost:8080/user/register",
                {username:data?.fullName,
                  password:data?.password,
                 email: data?.email
                },
              )
      if (response.code === 201) {
        messageApi.open({
          type: "success",
          content: response.message,
        });

        setIsOtpSent(true);
        setExpireCountdown(180);
        setIsExpiring(true);
        setResendCountdown(60);
        setIsResending(true);
        setIsModalOpen(true);
      }
    } catch (error) {
      console.error("Lỗi đăng ký:", error);
      messageApi.open({
        type: "error",
        content: error.message || "Có lỗi xảy ra khi đăng ký!",
      });
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(
      2,
      "0"
    )}`;
  };

  const handleCancel = async () => {
    setIsModalOpen(false);
    setEmail("");
    setIsOtpSent(false);

    setIsExpiring(false);
    setExpireCountdown(180);
    setIsResending(false);
    setResendCountdown(0);

    if (isOtpSent) {
      try {
        const emailValue = verifyForm.getFieldValue("verifyEmail");
        if (emailValue) {
          await deleteAllVerifyOtp(emailValue);
        }
      } catch (error) {
        console.error("Lỗi khi xóa OTP:", error);
      }
    }
    verifyForm.resetFields();
  };

  const handleResend = async () => {
    if (isResending) return;

    try {
      const response = await resendVerifyOtp({ email });
      if (response.code === 200) {
        verifyForm.setFieldsValue({ otp: "" });
        messageApi.success(`Đã gửi lại OTP đến email: ${email}`);

        // reset OTP expire (nếu nghiệp vụ yêu cầu)
        setExpireCountdown(180);
        setIsExpiring(true);
        setIsOtpSent(true);

        // bật cooldown resend 60s
        setResendCountdown(60);
        setIsResending(true);
      }
    } catch (err) {
      console.error("Resend OTP error:", err);
      messageApi.error(err.message);
    }
  };

  const handleVerifyUser = async () => {
    try {
      const values = await verifyForm.validateFields(["verifyEmail", "otp"]);

      const verifyObj = {
        email: values.verifyEmail,
        otp: values.otp,
      };

      const response = await verifyUser(verifyObj);

      if (response?.code === 200) {
        messageApi.success(response.message || "Xác thực OTP thành công!");
        setExpireCountdown(180);
        setIsExpiring(true);
        setIsOtpSent(true);
        localStorage.setItem("verifySuccessMessage", response.message);
        navigate("/user/login");
      } else {
        messageApi.error(response.message || "OTP không hợp lệ!");
      }
    } catch (error) {
      messageApi.open({
        type: "error",
        content: error.message || "Lỗi validate",
      });
    }
  };

  return (
    <>
      {contextHolder}
      <div className="container-fluid login-client-container">
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
                          { type: "email", message: "Email không hợp lệ!" },
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

      <Modal
        title="Kích hoạt tài khoản"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Hủy
          </Button>,

          <Button
            key="resend"
            type="primary"
            onClick={handleResend}
            disabled={isResending}
          >
            {isResending
              ? `Gửi lại OTP (${formatTime(resendCountdown)})`
              : "Gửi lại OTP"}
          </Button>,
          <Button key="verify" type="primary" onClick={handleVerifyUser}>
            Xác nhận OTP
          </Button>,
        ]}
      >
        <p>Vui lòng nhập mã OTP gồm 6 chữ số để kích hoạt tài khoản.</p>
        <Form form={verifyForm} layout="vertical">
          <Form.Item
            initialValue={email}
            label="Email"
            name="verifyEmail"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Email không hợp lệ!" },
            ]}
          >
            <Input readOnly={true} placeholder="Nhập email của bạn" />
          </Form.Item>

          <Form.Item
            label="Mã OTP"
            name="otp"
            rules={[
              { required: true, message: "Vui lòng nhập mã OTP!" },
              { len: 6, message: "OTP phải có 6 chữ số!" },
            ]}
          >
            <Input placeholder="Nhập mã OTP" maxLength={6} />
          </Form.Item>

          <p>
            Mã hết hạn sau:{" "}
            <strong style={{ color: "red" }}>
              {formatTime(expireCountdown)}
            </strong>
          </p>
        </Form>
      </Modal>
    </>
  );
}

export default Register;
