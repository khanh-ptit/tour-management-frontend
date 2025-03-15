import { Col, DatePicker, Form, Input, Row } from "antd";
import { FaSearch, FaCalendarAlt } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import banner from "../../../images/client/banner.jpg";
import { useNavigate } from "react-router-dom";
import "./Banner.scss";
const { RangePicker } = DatePicker;

function Banner() {
  const navigate = useNavigate();
  const handleFinish = (e) => {
    // console.log(e);
    const params = new URLSearchParams();

    if (e.location) {
      params.append("name", e.location);
    }

    if (e.dates && e.dates.length === 2) {
      const [departureDate, returnDate] = e.dates;
      params.append("departureDate", departureDate.toISOString());
      params.append("returnDate", returnDate.toISOString());
    }
    // console.log(params.toString());

    navigate(`/search?${params.toString()}`);
  };

  return (
    <>
      <div className="container-fluid">
        <img src={banner} alt="Banner" className="banner-img" />
        <div className="search-tour">
          <Form onFinish={handleFinish}>
            <Row>
              <Col span={24}>
                <Form.Item name="location">
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
              <Col xxl={8} xl={8} lg={8} md={8} sm={24} xs={24}>
                <Form.Item style={{ textAlign: "center" }}>
                  <button className="button button__primary align-items-center search__button">
                    <FaSearch /> Tìm kiếm
                  </button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    </>
  );
}

export default Banner;
