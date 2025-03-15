import Sponsor from "../../../components/client/Sponsor";
import TourDomesticHome from "../../../components/client/TourDomesticHome";
import TourForeignHome from "../../../components/client/TourForeignHome";
import DestinationDomestic from "../../../components/client/DestinationDomestic";
import DestinationForeign from "../../../components/client/DestinationForeign";
import { useEffect } from "react";
import Banner from "../../../components/client/Banner";
import "./Home.scss";

function Home() {
  useEffect(() => {
    document.title = "Top Ten Travel - Vòng quanh thế giới";
  }, []);

  return (
    <>
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
