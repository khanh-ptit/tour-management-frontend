import { Input, Button, Space } from "antd";
import {
  FaFacebookF,
  FaGithub,
  FaLinkedinIn,
  FaTiktok,
  FaYoutube,
} from "react-icons/fa";
import { MdWifiCalling3 } from "react-icons/md";
import "./Footer.scss";
import logoFooter from "../../../images/client/logo-2.png";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function Footer() {
  const domesticTour = useSelector(
    (state) => state.destinationReducer.domestic
  );
  const foreignTour = useSelector((state) => state.destinationReducer.foreign);

  return (
    <>
      <footer className="footer">
        <div className="container">
          <div className="row">
            <div className="inner-wrap-box col-xl-4 col-lg-4 col-md-6 col-sm-6 col-6">
              <div className="box-title mb-2">Tour trong nước</div>
              <div className="row box-list">
                {domesticTour.length > 0 &&
                  domesticTour.map((item) => (
                    <div
                      key={item._id}
                      className="box-item col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12"
                    >
                      <Link
                        to={`/destinations/${item.slug}`}
                        style={{
                          color: "inherit",
                          textDecoration: "none",
                        }}
                      >
                        Du lịch {item.name}
                      </Link>
                    </div>
                  ))}
              </div>
            </div>

            <div className="inner-wrap-box col-xl-4 col-lg-4 col-md-6 col-sm-6 col-6">
              <div className="box-title mb-2">Tour nước ngoài</div>
              <div className="row box-list">
                {foreignTour.length > 0 &&
                  foreignTour.map((item) => (
                    <div
                      key={item._id}
                      className="box-item col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12"
                    >
                      <Link
                        to={`/destinations/${item.slug}`}
                        style={{
                          color: "inherit",
                          textDecoration: "none",
                        }}
                      >
                        Du lịch {item.name}
                      </Link>
                    </div>
                  ))}
              </div>
            </div>
            <div className="inner-wrap-box col-xl-4 col-lg-4 col-md-12 col-sm-12 col-12">
              <div className="box-title mb-2">
                Đăng ký nhận thông tin khuyến mãi
              </div>
              <div className="box-desc mb-2">
                Nhập email để có cơ hội giảm 50% cho chuyến đi tiếp theo của quý
                khách
              </div>
              <div className="box-input-email">
                <Space.Compact style={{ width: "80%" }}>
                  <Input placeholder="Nhập email tại đây..." />
                  <Button type="primary">Đăng ký</Button>
                </Space.Compact>
              </div>
            </div>
          </div>
          <div className="row align-items-center">
            <div className="inner-wrap-box col-xl-4 col-lg-4 col-md-6 col-sm-6 col-6">
              <div className="box-title mb-2">Hỗ trợ khách hàng:</div>
              <div className="row box-list">
                <div className="box-item col-12 mb-2">
                  Khách hàng khởi hành từ:
                </div>
                <div className="contact-list">
                  <div className="contact-item">
                    <MdWifiCalling3 />
                    <span>Tour nước ngoài: 0989.633.789</span>
                  </div>
                  <div className="contact-item">
                    <MdWifiCalling3 />
                    <span>Tour trong nước: 0989.633.123</span>
                  </div>
                  <div className="contact-item">
                    <MdWifiCalling3 />
                    <span>Dịch vụ phòng: 0989.633.456</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="inner-wrap-box col-xl-4 col-lg-4 col-md-6 col-sm-6 col-6">
              <div className="box-title mb-2">Bản đồ</div>
              <div className="row box-list">
                <div className="box-item col-12">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3725.2922764181035!2d105.78484157552302!3d20.98091798941959!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135accdd8a1ad71%3A0xa2f9b16036648187!2zSOG7jWMgdmnhu4duIEPDtG5nIG5naOG7hyBCxrB1IGNow61uaCB2aeG7hW4gdGjDtG5n!5e0!3m2!1svi!2s!4v1741276851043!5m2!1svi!2s"
                    style={{
                      border: 0,
                      width: "100%",
                      aspectRatio: "2/1",
                      maxWidth: "300px",
                    }}
                    allowfullscreen=""
                    loading="lazy"
                    referrerpolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </div>
            </div>
            <div className="inner-wrap-box col-xl-4 col-lg-4 col-md-12 col-sm-12 col-12">
              <div className="row">
                <div className="footer-image">
                  <img src={logoFooter} alt="Logo Footer"></img>
                </div>
                <div className="box-title mt-3">
                  Kết nối với chúng tôi
                  <div className="box-social mt-2">
                    <FaFacebookF />
                    <FaGithub />
                    <FaLinkedinIn />
                    <FaTiktok />
                    <FaYoutube />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;
