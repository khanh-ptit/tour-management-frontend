import { useEffect } from "react";
import "./App.css";

export default function ChatPopup() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://sf-cdn.coze.com/obj/unpkg-va/flow-platform/chat-app-sdk/1.2.0-beta.6/libs/oversea/index.js";
    script.async = true;
    script.onload = () => startCoze();
    document.body.appendChild(script);
  }, []);

  return (
    <div
      className="travel-page container"
      style={{
        padding: "30px",
      }}
    >
      <section className="hero">
        <div className="hero-content">
          <h1>Trợ Lý Du Lịch Thông Minh</h1>
          <p>
            Khám phá điểm đến, lập kế hoạch, đặt dịch vụ — tất cả trong 1
            chatbot AI.
          </p>
          <button className="hero-btn">Khám phá ngay</button>
        </div>
      </section>

      {/* ABOUT */}
      <section className="about">
        <h2>Vì sao nên dùng trợ lý du lịch AI?</h2>
        <p>
          Trợ lý ảo giúp bạn tìm địa điểm, gợi ý lịch trình cá nhân hóa, dự báo
          thời tiết, tìm quán ăn, khách sạn, địa điểm chơi gần bạn — hoàn toàn
          tự động.
        </p>
      </section>

      {/* FEATURES */}
      <section className="features">
        <div className="feature-card">
          <h3>🗺 Gợi ý điểm đến</h3>
          <p>
            AI phân tích sở thích để gợi ý thành phố, địa điểm, trải nghiệm phù
            hợp.
          </p>
        </div>

        <div className="feature-card">
          <h3>📅 Lên lịch trình thông minh</h3>
          <p>
            Tạo lịch trình 1 ngày – 7 ngày tự động, tối ưu thời gian & chi phí.
          </p>
        </div>

        <div className="feature-card">
          <h3>🍜 Gợi ý ăn uống</h3>
          <p>
            Tìm quán ăn ngon quanh bạn theo món, giá, đánh giá, khoảng cách.
          </p>
        </div>

        <div className="feature-card">
          <h3>🏨 Khách sạn & dịch vụ</h3>
          <p>AI giúp bạn chọn nơi ở phù hợp ngân sách và nhu cầu.</p>
        </div>
      </section>
      <div id="coze-wrapper">
        <div id="coze-container"></div>
      </div>
    </div>
  );
}

function startCoze() {
  function tryInit() {
    if (!window.CozeWebSDK) return setTimeout(tryInit, 100);

    const el = document.getElementById("coze-container");
    if (!el) return;

    new window.CozeWebSDK.WebChatClient({
      config: {
        type: "bot",
        bot_id: "7577298561660207109",
        isIframe: false,
      },
      auth: {
        type: "token",
        token:
          "cztei_0p0zXskOD6YoxhekcLO1g0aY4QfiV1MKWquk3xWdYR5Yuml0Ax871SdtfnEs7lb01",
        onRefreshToken: async () => "token",
      },
      userInfo: {
        id: "user",
        nickname: "User",
      },
      ui: {
        base: {
          icon: "",
          layout: "pc",
          lang: "en",
          zIndex: 99999,
        },
        chatBot: {
          title: "Coze Bot",
          uploadable: true,
          width: "100%",
          el,
          startOpen: true,
        },
      },
    });
  }

  tryInit();
}
