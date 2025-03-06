import { Link } from "react-router-dom";
import logoTopTenTravel from "../../../images/client/logoTopTenTravel.png";
import "./Header.scss";
import { Badge, Button, Dropdown, Input, Menu, Popover } from "antd";
import {
  ShoppingCartOutlined,
  MenuOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useState } from "react";

const { Search } = Input;

function Header() {
  const [isPopoverVisible, setIsPopoverVisible] = useState(false);
  const [bookingCode, setBookingCode] = useState("");

  // Toggle popover
  const togglePopover = () => {
    setIsPopoverVisible(!isPopoverVisible);
  };

  // Menu Dropdown
  const menuItems = (
    <Menu className="header__dropdown">
      <Menu.Item key="1">
        <Link to="/about">Giới thiệu</Link>
      </Menu.Item>
      <Menu.Item key="2">
        <Link to="/news">Tin tức</Link>
      </Menu.Item>
      <Menu.Item key="3">
        <Link to="/contact">Liên hệ</Link>
      </Menu.Item>
      <Menu.Item key="4">
        <Link to="/user/register">Đăng ký</Link>
      </Menu.Item>
      <Menu.Item key="5">
        <Link to="/user/login">Đăng nhập</Link>
      </Menu.Item>
    </Menu>
  );

  // Nội dung popover (input nhập mã booking)
  const popoverContent = (
    <div className="search-booking">
      <Input
        placeholder="Nhập mã booking"
        value={bookingCode}
        onChange={(e) => setBookingCode(e.target.value)}
        suffix={<SearchOutlined style={{ cursor: "pointer" }} />}
      />
    </div>
  );

  return (
    <header className="header">
      {/* Top Menu */}
      <div className="header__top">
        <div className="container">
          <ul className="header__menu">
            <li>
              <Link to="/about">Giới thiệu</Link>
            </li>
            <li>
              <Link to="/news">Tin tức</Link>
            </li>
            <li>
              <Link to="/contact">Liên hệ</Link>
            </li>
            <li>
              <Link to="/user/register">Đăng ký</Link>
            </li>
            <li>
              <Link to="/user/login">Đăng nhập</Link>
            </li>
            {/* Dropdown menu cho mobile */}
            <Dropdown
              overlay={menuItems}
              trigger={["click"]}
              placement="bottomRight"
              overlayClassName="header__dropdown"
            >
              <Button className="btn-menu" icon={<MenuOutlined />} />
            </Dropdown>
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

            {/* Search Box */}
            <div className="col-xl-6 col-lg-6 col-md-5 col-sm-8 col-7 header__search mt-md-3">
              <Search
                placeholder="Hôm nay bạn muốn du lịch ở đâu?"
                enterButton
              />
            </div>

            {/* Booking & Cart */}
            <div className="col-xl-3 col-lg-3 col-md-3 col-sm-4 col-5 d-flex justify-content-center align-items-center mt-md-3">
              {/* Button với Popover */}
              <Popover
                content={popoverContent}
                title="Tra cứu Booking"
                trigger="click"
                visible={isPopoverVisible}
                onVisibleChange={setIsPopoverVisible}
                placement="bottom"
              >
                <button
                  className="header__booking button button__primary me-3"
                  onClick={togglePopover}
                >
                  Tra cứu Booking
                </button>
              </Popover>

              {/* Giỏ hàng */}
              <Link to="/carts">
                <Badge count={5}>
                  <ShoppingCartOutlined className="header__cart-icon" />
                </Badge>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
