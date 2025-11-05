import { useState, useRef, useEffect } from "react";
import { Modal, Button, Switch, message } from "antd";
import ReCAPTCHA from "react-google-recaptcha";
import {
  enableTwoFa,
  toggleTwoFa,
} from "../../../services/client/user.service";
import ModalVoiceRecord from "../ModalVoiceRecord";

function TwoFaSetting({ user, isTwoFa, onToggle }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingState, setPendingState] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
  const [captchaToken, setCaptchaToken] = useState(null);
  const [isModalVoiceOpen, setIsModalVoiceOpen] = useState(false);
  const captchaRef = useRef();

  const handleToggleRequest = (newState) => {
    setPendingState(newState);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setPendingState(null);
    setIsCaptchaVerified(false);
  };

  const handleCaptchaChange = (token) => {
    if (token) {
      setIsCaptchaVerified(true);
      setCaptchaToken(token);
    }
  };

  const handleConfirm = async () => {
    if (pendingState === false && !isCaptchaVerified) {
      messageApi.warning("Vui lòng xác nhận bạn không phải robot.");
      return;
    }

    if (pendingState) {
      setIsModalVoiceOpen(true);
    } else {
      try {
        const response = await toggleTwoFa(user._id, false, captchaToken);
        if (response.code === 200) {
          messageApi.success(response.message);
          if (onToggle) onToggle(false);
        }
      } catch (error) {
        messageApi.error("Có lỗi xảy ra khi tắt 2FA!");
      }
    }

    setIsModalOpen(false);
    setPendingState(null);
    setIsCaptchaVerified(false);
    captchaRef.current?.reset();
  };

  const handleToggleTwoFa = async (newState, voiceUrl) => {
    const objVoiceUrl = { voiceUrl };
    const response = await enableTwoFa(user._id, objVoiceUrl);
    if (response.code === 200) {
      // messageApi.success(response.message);
      if (onToggle) onToggle(newState);
    }
  };

  return (
    <>
      {contextHolder}
      <Switch
        checked={isTwoFa}
        onChange={handleToggleRequest}
        checkedChildren="Bật"
        unCheckedChildren="Tắt"
      />

      <Modal
        title="Xác thực hai yếu tố bằng giọng nói"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Hủy
          </Button>,
          <Button key="ok" type="primary" onClick={handleConfirm}>
            Xác nhận
          </Button>,
        ]}
      >
        <p>
          {pendingState
            ? "Bạn có chắc chắn muốn bật xác thực bằng giọng nói không?"
            : "Bạn có chắc chắn muốn tắt xác thực bằng giọng nói không?"}
        </p>

        {!pendingState && (
          <div style={{ marginTop: "1rem" }}>
            <ReCAPTCHA
              sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
              onChange={handleCaptchaChange}
              ref={captchaRef}
            />
          </div>
        )}
      </Modal>

      <ModalVoiceRecord
        onClose={() => setIsModalVoiceOpen(false)}
        isOpen={isModalVoiceOpen}
        email={user?.email}
        onVerified={(audioUrl) => handleToggleTwoFa(true, audioUrl)}
      />
    </>
  );
}

export default TwoFaSetting;
