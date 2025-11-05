import { Button, message, Modal } from "antd";
import { FaMicrophone } from "react-icons/fa6";
import AntDAudioPlayer from "../AudioPlayer";
import { useState } from "react";
import { uploadAudioToCloudinary } from "../../../services/uploadAudioToCloudinary.service";

function ModalVoiceRecord({ isOpen, onClose, onVerified, email }) {
  const [messageApi, contextHolder] = message.useMessage();
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioContext, setAudioContext] = useState(null);
  const [analyser, setAnalyser] = useState(null);
  const [dataArray, setDataArray] = useState(null);
  const [animationId, setAnimationId] = useState(null);
  const [voiceUrl, setVoiceUrl] = useState(null);

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

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
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
      visualize(analyserNode, dataArr);
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

  const handleAudioUpload = async (file) => {
    try {
      const uploadedAudioUrl = await uploadAudioToCloudinary(file);
      // const uploadedAudioUrl = null;
      if (uploadedAudioUrl) {
        setVoiceUrl(uploadedAudioUrl);
        return uploadedAudioUrl;
      }
    } catch (error) {
      console.error("Upload audio error:", error);
    }
    return null;
  };

  const handleVerifyVoice = async () => {
    if (!audioBlob) {
      messageApi.error("Bạn chưa ghi âm giọng nói!");
      return;
    }

    messageApi.open({ type: "loading", content: "Đang tải giọng nói lên..." });

    const uploadedUrl = await handleAudioUpload(audioBlob); // 👈 phải await

    if (!uploadedUrl) {
      messageApi.destroy();
      messageApi.error("Tải giọng nói thất bại!");
      return;
    }

    messageApi.destroy();
    messageApi.success("Xác thực giọng nói thành công!");

    if (onVerified) onVerified(uploadedUrl);

    setAudioBlob(null);
    setVoiceUrl(uploadedUrl);
    onClose();
  };

  return (
    <>
      {contextHolder}
      <Modal
        title="Xác thực giọng nói"
        open={isOpen}
        onCancel={onClose}
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
      </Modal>
    </>
  );
}

export default ModalVoiceRecord;
