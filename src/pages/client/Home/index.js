import "./Home.scss";
import { Col, DatePicker, Form, Input, Row } from "antd";
import { FaSearch, FaCalendarAlt } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import banner from "../../../images/client/banner.jpg";

const { RangePicker } = DatePicker;

function Home() {
  return (
    <>
      <div className="container-fluid">
        <section className="banner">
          <img src={banner} alt="Banner" className="banner-img" />
          <div className="search-tour">
            <Form>
              <Row>
                <Col span={24}>
                  <Form.Item name="name">
                    <Input
                      prefix={<FaLocationDot  />}
                      placeholder="Nhập tên địa điểm"
                    />
                  </Form.Item>
                </Col>
                <Col xxl={16} xl={16} lg={16} md={16} sm={24} xs={24}>
                  <Form.Item>
                    <RangePicker
                      style={{ width: "100%" }}
                      prefix={<FaCalendarAlt style={{ marginRight: "7px" }} />}
                      name="dates"
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
    </>
  );
}

export default Home;
