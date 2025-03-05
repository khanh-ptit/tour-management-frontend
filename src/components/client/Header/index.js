import { Link } from "react-router-dom";
import logoTopTenTravel from "../../../images/client/logoTopTenTravel.png";
import "./Header.scss";
import { Input } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";

const { Search } = Input;

function Header() {
  return (
    <>
      <header className="header">
        {/* Top Menu */}
        <div className="header__top">
          <div className="container">
            <ul className="header__menu">
              <li>
                <Link to="/about">Giới thiệu</Link>
              </li>
              <li>
                <Link to="/instruct">Cẩm nang du lịch</Link>
              </li>
              <li>
                <Link to="/hiring">Tuyển dụng</Link>
              </li>
              <li>
                <Link to="/news">Tin tức</Link>
              </li>
              <li>
                <Link to="/contact">Liên hệ</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Main Header */}
        <div className="container">
          <div className="header__main">
            <div className="row align-items-center text-center text-lg-start">
              {/* Logo */}
              <div className="col-xl-3 col-lg-3 col-md-4 col-sm-12 header__logo">
                <img src={logoTopTenTravel} alt="Logo" />
              </div>

              {/* Search */}
              <div className="col-xl-6 col-lg-6 col-md-5 col-sm-8 col-7 header__search mt-md-3">
                <Search
                  placeholder="Hôm nay bạn muốn du lịch ở đâu?"
                  enterButton
                />
              </div>

              {/* Booking & Cart */}
              <div className="col-xl-3 col-lg-3 col-md-3 col-sm-4 col-5 d-flex justify-content-center align-items-center mt-md-3">
                <button className="header__booking button button__primary me-3">
                  Tra cứu Booking
                </button>
                <Link to="/carts">
                  <ShoppingCartOutlined className="header__cart-icon" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

export default Header;
