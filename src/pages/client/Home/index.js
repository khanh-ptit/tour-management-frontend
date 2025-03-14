import "./Home.scss";
import { Col, DatePicker, Form, Input, Row } from "antd";
import { FaSearch, FaCalendarAlt } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import banner from "../../../images/client/banner.jpg";
import Sponsor from "../../../components/client/Sponsor";
import TourDomesticHome from "../../../components/client/TourDomesticHome";
import TourForeignHome from "../../../components/client/TourForeignHome";
import DestinationDomestic from "../../../components/client/DestinationDomestic";

const { RangePicker } = DatePicker;

function Home() {
  const handleFinish = (e) => {
    console.log(e);
  };

  return (
    <>
      <div className="container-fluid">
        <section className="banner">
          <img src={banner} alt="Banner" className="banner-img" />
          <div className="search-tour">
            <Form onFinish={handleFinish}>
              <Row>
                <Col span={24}>
                  <Form.Item name="name">
                    <Input
                      prefix={<FaLocationDot />}
                      placeholder="Nhập tên địa điểm"
                    />
                  </Form.Item>
                </Col>
                <Col xxl={16} xl={16} lg={16} md={16} sm={24} xs={24}>
                  <Form.Item name="dates">
                    <RangePicker
                      prefix={<FaCalendarAlt style={{ marginRight: "7px" }} />}
                      style={{ width: "100%" }}
                      format="DD/MM/YYYY"
                      placeholder={["Ngày đi", "Ngày về"]}
                    />
                  </Form.Item>
                </Col>
                <Col xxl={8} xl={8} lg={8} md={8}>
                  <Form.Item style={{ textAlign: "center" }}>
                    <button className="button button__primary align-items-center">
                      <FaSearch /> Tìm kiếm
                    </button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </div>
        </section>
      </div>

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
    </>
  );
}

export default Home;
