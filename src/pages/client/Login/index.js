import { Button, Form, Input, message, Modal, Spin } from "antd";
import { FaMicrophone } from "react-icons/fa6";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import "./Login.scss";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  deleteAllOtp,
  deleteAllVerifyOtp,
  forgotPassword,
  login,
  otpPassword,
  resendVerifyOtp,
  verifyUser,
  verifyVoice,
} from "../../../services/client/user.service";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../../actions/auth";
import { updateInfo } from "../../../actions/userClient";
import AntDAudioPlayer from "../../../components/client/AudioPlayer";
import { LoadingOutlined } from "@ant-design/icons";

function Login() {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const [forgotForm] = Form.useForm();
  const [verifyForm] = Form.useForm();
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

  const [isModalVerifyOpen, setIsModalVerifyOpen] = useState(false);
  const [isOtpVerifySent, setIsOtpVerifySent] = useState(false); // State hiển thị OTP input
  const [verifyEmail, setVerifyEmail] = useState("");
  // OTP expire (3 phút)
  const [expireCountdown, setExpireCountdown] = useState(180);
  const [isExpiring, setIsExpiring] = useState(false);

  // Resend cooldown (60s)
  const [resendCountdown, setResendCountdown] = useState(0);
  const [isResending, setIsResending] = useState(false);

  const [isResendingForgot, setIsResendingForgot] = useState(false);
  const [resendForgotCountdown, setResendForgotCountdown] = useState(0);

  const [isForgotFlow, setIsForgotFlow] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);

  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioContext, setAudioContext] = useState(null);
  const [analyser, setAnalyser] = useState(null);
  const [dataArray, setDataArray] = useState(null);
  const [animationId, setAnimationId] = useState(null);
  const [isProcessingVoice, setIsProcessingVoice] = useState(false);

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
    let timer;
    if (isResendingForgot && resendForgotCountdown > 0) {
      timer = setTimeout(
        () => setResendForgotCountdown((prev) => prev - 1),
        1000
      );
    } else if (resendForgotCountdown === 0 && isResendingForgot) {
      setIsResendingForgot(false);
    }
    return () => clearTimeout(timer);
  }, [isResendingForgot, resendForgotCountdown]);

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
    if (localStorage.getItem("loginFirstMessage")) {
      messageApi.open({
        type: "error",
        content: localStorage.getItem("loginFirstMessage"),
      });
      localStorage.removeItem("loginFirstMessage");
    }
    if (localStorage.getItem("verifySuccessMessage")) {
      messageApi.open({
        type: "success",
        content: localStorage.getItem("verifySuccessMessage"),
      });
      localStorage.removeItem("verifySuccessMessage");
    }
  }, [messageApi]);

  // Xử lý mở Modal
  const showForgotPasswordModal = () => {
    setIsForgotFlow(false);
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

  const handleVerifyCancel = async () => {
    setIsModalVerifyOpen(false);
    setVerifyEmail("");
    setIsOtpVerifySent(false);

    setIsExpiring(false);
    setExpireCountdown(180);
    setIsResending(false);
    setResendCountdown(0);

    if (isOtpVerifySent) {
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

  const handleResend = async (targetEmail) => {
    if (isResending) return;

    try {
      const response = await resendVerifyOtp({ email: targetEmail });
      if (response.code === 200) {
        verifyForm.setFieldsValue({ otp: "" });
        messageApi.success(`Đã gửi lại OTP đến email: ${targetEmail}`);

        setExpireCountdown(180);
        setIsExpiring(true);
        setIsOtpSent(true);

        setResendCountdown(60);
        setIsResending(true);
      }
    } catch (err) {
      console.error("Resend OTP error:", err);
      messageApi.error(err.message);
      setIsModalVerifyOpen(false);
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
        // nếu cần reset timer sau verify thành công:
        setExpireCountdown(180);
        setIsExpiring(true);
        setIsOtpSent(true);
        setIsModalVerifyOpen(false);
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

  const handleFinish = async (data) => {
    setVerifyEmail(data?.email);
    setEmail(data?.email);
    try {
      const response = await login(data);
      if (
        response.message === "Mật khẩu chính xác. Yêu cầu xác thực giọng nói."
      ) {
        // Bật modal giọng nói
        setIsVoiceModalOpen(true);
      } else {
        // Login bình thường
        form.resetFields();
        localStorage.setItem("loginClientSuccessMessage", response.message);
        dispatch(loginSuccess(response.user));
        localStorage.setItem("cartId", response.cart._id);
        localStorage.setItem("token", response.token);
        localStorage.setItem("user", JSON.stringify(response.user));
        messageApi.open({
          type: "success",
          content: response.message,
        });
        dispatch(updateInfo(response.user));

        navigate("/");
      }
    } catch (error) {
      if (
        error.message ===
        "Tài khoản của bạn chưa được kích hoạt. Vui lòng xác thực!"
      ) {
        setVerifyEmail(data?.email);
        handleResend(data?.email);
        setIsModalVerifyOpen(true);
        setIsOtpVerifySent(true);
        setExpireCountdown(180);
        setIsExpiring(true);

        setResendCountdown(60);
        setIsResending(true);
      } else if (
        error.message ===
          "Bạn đã nhập sai mật khẩu quá 5 lần! Vui lòng nhập OTP để đặt lại mật khẩu" ||
        error.message ===
          "Bạn đã nhập sai mật khẩu quá nhiều lần. Vui lòng xác thực!"
      ) {
        showForgotPasswordModal();
        setIsForgotFlow(true);
        handleResendForgotPassword(data?.email);
      }
      messageApi.open({
        type: "error",
        content: error.message || "Có lỗi xảy ra khi đăng nhập!",
      });
    }
  };

  // Xử lý gửi email khôi phục
  const handleResendForgotPassword = async (email) => {
    try {
      const response = await forgotPassword({
        email,
        exceedingLoginFail: true,
      });
      if (response.code === 200) {
        setIsOtpSent(true);
        setCountdown(180);
        setIsCounting(true);
        setResendForgotCountdown(60);
        setIsResendingForgot(true);
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

  const handleForgotPassword = async (value) => {
    try {
      if (value === "resend") {
        forgotForm.setFieldsValue({ otp: "" });
        // Reset state OTP
        setOtpValue("");
      }
      const values = await forgotForm.validateFields(["email"]);
      const data = {
        email: values.email,
        exceedingLoginFail: isForgotFlow,
      };
      const response = await forgotPassword(data);
      if (response.code === 200) {
        messageApi.success(`Đã gửi yêu cầu khôi phục tới ${values.email}`);
        setIsOtpSent(true); // Hiển thị input OTP sau khi gửi email thành công
        setCountdown(180); // Reset về 3 phút
        setIsCounting(true); // Bắt đầu đếm
        setResendForgotCountdown(60);
        setIsResendingForgot(true);
      } else if (response.code === 400) {
        messageApi.open({
          type: "error",
          content: response.message,
        });
        return;
      }
    } catch (error) {
      console.log("Lỗi validate form:", error);
      messageApi.open({
        type: "error",
        content: error.message,
      });
      setIsModalOpen(false);
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

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Ghi âm
      const recorder = new MediaRecorder(stream);
      const chunks = [];
      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        setAudioBlob(blob);
      };
      recorder.start();
      setMediaRecorder(recorder);
      setRecording(true);

      // Khởi tạo audio context cho visualizer
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioCtx.createMediaStreamSource(stream);
      const analyserNode = audioCtx.createAnalyser();
      analyserNode.fftSize = 256;
      const bufferLength = analyserNode.frequencyBinCount;
      const dataArr = new Uint8Array(bufferLength);

      source.connect(analyserNode);
      setAudioContext(audioCtx);
      setAnalyser(analyserNode);
      setDataArray(dataArr);

      visualize(analyserNode, dataArr); // bắt đầu render visualizer
    } catch (err) {
      messageApi.error("Không thể truy cập micro. Vui lòng kiểm tra quyền!");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) mediaRecorder.stop();
    setRecording(false);

    if (animationId) cancelAnimationFrame(animationId);
    if (audioContext) audioContext.close();
  };

  const handleVerifyVoice = async () => {
    if (!audioBlob) {
      messageApi.error("Bạn chưa ghi âm giọng nói!");
      return;
    }

    setIsProcessingVoice(true); // ✅ Khóa thao tác

    const formData = new FormData();
    formData.append("email", email);
    formData.append("voice", audioBlob, "voice.webm");

    try {
      const response = await verifyVoice(formData);

      if (response.code === 200) {
        localStorage.setItem("loginClientSuccessMessage", response.message);
        dispatch(loginSuccess(response.user));
        localStorage.setItem("cartId", response.cart._id);
        localStorage.setItem("token", response.token);
        localStorage.setItem("user", JSON.stringify(response.user));
        messageApi.open({
          type: "success",
          content: response.message,
        });
        dispatch(updateInfo(response.user));
        setIsVoiceModalOpen(false);
        navigate("/");
      } else {
        messageApi.error(response.message || "Xác thực giọng nói thất bại!");
      }
    } catch (err) {
      console.error(err);
      messageApi.error("Lỗi khi gửi giọng nói!");
    } finally {
      setIsProcessingVoice(false);
    }
  };

  const visualize = (analyserNode, dataArr) => {
    const draw = () => {
      analyserNode.getByteFrequencyData(dataArr);

      const bars = document.querySelectorAll("#voice-visualizer .bar");
      const segmentSize = Math.floor(dataArr.length / bars.length);

      bars.forEach((bar, i) => {
        const start = i * segmentSize;
        const end = start + segmentSize;
        const segment = dataArr.slice(start, end);
        const avg =
          segment.reduce((sum, val) => sum + val, 0) / (segment.length || 1);
        const scale = Math.max(0.2, Math.min(avg / 100, 1));
        bar.style.transform = `scaleY(${scale})`;
      });

      const id = requestAnimationFrame(draw);
      setAnimationId(id);
    };
    draw();
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

      <Modal
        title="Kích hoạt tài khoản"
        open={isModalVerifyOpen}
        onCancel={handleVerifyCancel}
        footer={[
          <Button key="cancel" onClick={handleVerifyCancel}>
            Hủy
          </Button>,

          <Button
            key="resend"
            type="primary"
            onClick={() => handleResend(verifyEmail)}
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
            initialValue={verifyEmail}
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
              key="resend"
              type="primary"
              onClick={() => handleForgotPassword("resend")}
              disabled={isResendingForgot}
            >
              {isResendingForgot
                ? `Gửi lại OTP (${formatTime(resendForgotCountdown)})`
                : "Gửi lại OTP"}
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

      <Modal
        title="Xác thực giọng nói"
        open={isVoiceModalOpen}
        onCancel={() => {
          if (isProcessingVoice) return;
          setIsVoiceModalOpen(false);
        }}
        maskClosable={false}
        keyboard={false}
        footer={[
          !recording ? (
            <Button key="record" type="primary" onClick={startRecording}>
              Bắt đầu ghi âm
            </Button>
          ) : (
            <Button key="stop" danger onClick={stopRecording}>
              Dừng ghi
            </Button>
          ),
          <Button
            key="verify"
            type="primary"
            onClick={handleVerifyVoice}
            disabled={!audioBlob}
          >
            Xác thực
          </Button>,
        ]}
      >
        <Spin
          spinning={isProcessingVoice}
          indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />}
          tip="Đang xác thực giọng nói..."
          size="large"
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 10000,
            background: "rgba(255, 255, 255, 0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div className="voice-modal-container">
            <FaMicrophone className="micro-icon" />
            <div id="voice-visualizer" className="voice-visualizer">
              {!audioBlob &&
                [...Array(32)].map((_, i) => (
                  <span key={i} className="bar"></span>
                ))}
            </div>
            {!audioBlob && (
              <div
                style={{
                  color: "red",
                  fontSize: "20px",
                  marginTop: "20px",
                  fontWeight: "600",
                }}
              >
                Vui lòng nói: Xin chào Việt Nam!
              </div>
            )}
            {audioBlob && (
              <div style={{ marginTop: 16, width: "100%" }}>
                <AntDAudioPlayer src={URL.createObjectURL(audioBlob)} />
              </div>
            )}
          </div>
        </Spin>
      </Modal>
    </>
  );
}

export default Login;
