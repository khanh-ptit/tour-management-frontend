import Sponsor from "../../../components/client/Sponsor";
import TourDomesticHome from "../../../components/client/TourDomesticHome";
import TourForeignHome from "../../../components/client/TourForeignHome";
import DestinationDomestic from "../../../components/client/DestinationDomestic";
import DestinationForeign from "../../../components/client/DestinationForeign";
import { useEffect, useState } from "react";
import Banner from "../../../components/client/Banner";
import "./Home.scss";
import { message } from "antd";
import axios from "axios";
import { initPreKey } from "./key";

function Home() {
  const [messageApi, contextHolder] = message.useMessage();
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    document.title = "Top Ten Travel - Vòng quanh thế giới";
    const storedMessage = localStorage.getItem("loginClientSuccessMessage");
    const redirectErrorMessage = localStorage.getItem("redirectErrorMessage");

    if (storedMessage) {
      setSuccessMessage(storedMessage);
      localStorage.removeItem("loginClientSuccessMessage");
    } else if (redirectErrorMessage) {
      messageApi.open({
        type: "error",
        content: redirectErrorMessage,
      });
      localStorage.removeItem("redirectErrorMessage");
    }
  }, []);

useEffect(() => {
  const checkAndGeneratePrekey = async () => {
    try {
      const token = localStorage.getItem('jtoken');
      if (!token) {
        window.location.href = '/admin/auth/login';
        return;
      }

    
      const res = await axios.get('http://localhost:8080/check-exist-prekey', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
 localStorage.setItem("username",res.data.result.username);
      if (res.data.result.status === "Not Created") {
        // tạo các cặp prekey và upload public key tương ứng lên server
        initPreKey(res.data.result.username);
       
      } else {
        console.log("Prekey đã tồn tại");
      }
    } catch (error) {
      // nếu token hết hạn hoặc bị lỗi xác thực
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('jtoken');
        window.location.href = '/admin/auth/login';
      } else {
        console.error("Lỗi khi kiểm tra prekey:", error);
      }
    }
  };

  checkAndGeneratePrekey();
}, []);
  useEffect(() => {
    if (successMessage) {
      messageApi.open({
        type: "success",
        content: successMessage,
      });
    }
  }, [successMessage, messageApi]);

  return (
    <>
      {contextHolder}
      <section className="banner">
        <Banner />
      </section>

      <section className="box-head section">
        <div className="container">
          <div className="box-head__title">Đối tác của chúng tôi</div>
          <Sponsor />
        </div>
      </section>

      <section className="box-head section tour-domestic-section">
        <div className="container">
          <div className="box-head__title">Tour trong nước</div>
          <TourDomesticHome />
        </div>
      </section>

      <section className="box-head section tour-foreign-section">
        <div className="container">
          <div className="box-head__title">Tour nước ngoài</div>
          <TourForeignHome />
        </div>
      </section>

      <section className="box-head section destination-domestic-section">
        <div className="container">
          <div className="box-head__title">Điểm đến trong nước</div>
          <DestinationDomestic />
        </div>
      </section>

      <section className="box-head section destination-foreign-section">
        <div className="container">
          <div className="box-head__title">Điểm đến nước ngoài</div>
          <DestinationForeign />
        </div>
      </section>
    </>
  );
}

export default Home;
