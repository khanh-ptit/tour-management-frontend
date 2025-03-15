import { Link, useNavigate } from "react-router-dom";
import removeAccents from "../../../utils/removeAccents";
import logoTopTenTravel from "../../../images/client/logoTopTenTravel.png";
import { Badge, Button, Dropdown, Input, List, Menu, Popover } from "antd";
import {
  ShoppingCartOutlined,
  MenuOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import "./Header.scss";

const { Search } = Input;

function Header() {
  const destinationsData = useSelector((state) => state.destinationReducer);

  // Chuyển đổi dữ liệu thành mảng
  const destinations = Array.isArray(destinationsData)
    ? destinationsData
    : Object.values(destinationsData).flat();

  const navigate = useNavigate();
  const suggestionsRef = useRef(null);
  const inputSearchRef = useRef(null);
  const [isSuggestionsVisible, setIsSuggestionsVisible] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isPopoverVisible, setIsPopoverVisible] = useState(false);
  const [bookingCode, setBookingCode] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    setKeyword(value);

    // Chuyển đổi chuỗi nhập vào thành dạng không dấu, thay khoảng trắng thành '-'
    const normalizedValue = removeAccents(value)
      .toLowerCase()
      .replace(/\s+/g, "-");

    if (normalizedValue.trim()) {
      const filtered = destinations.filter((item) => {
        const normalizedName = removeAccents(item.name).toLowerCase();
        const normalizedSlug = item.slug.toLowerCase();
        return (
          normalizedName.includes(value.toLowerCase()) ||
          normalizedSlug.includes(normalizedValue)
        );
      });

      setSuggestions(filtered);
      setIsSuggestionsVisible(true);
    } else {
      setIsSuggestionsVisible(false);
      setSuggestions([]);
    }
  };

  // Hàm xử lý click bên ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target)
      ) {
        setIsSuggestionsVisible(false); // Ẩn khối suggestions
      }
    };

    // Thêm sự kiện lắng nghe click trên document
    document.addEventListener("mousedown", handleClickOutside);

    // Dọn dẹp sự kiện khi component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClickTour = () => {
    setIsSuggestionsVisible(false);
    setKeyword("");
  };

  // Hàm xử lý khi nhấn Enter
  const handleSubmit = () => {
    if (keyword.trim()) {
      setIsSuggestionsVisible(false);
      navigate(`/search?name=${encodeURIComponent(keyword)}`);
    }

    // Loại bỏ focus khỏi ô input
    if (inputSearchRef.current) {
      inputSearchRef.current.input.blur(); // Gọi blur() để loại bỏ focus
    }
  };

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
              <Link to="/">
                <img src={logoTopTenTravel} alt="Logo" />
              </Link>
            </div>

            {/* Search Box */}
            <div className="col-xl-6 col-lg-6 col-md-5 col-sm-8 col-7 header__search mt-md-3 position-relative">
              <Search
                value={keyword}
                onChange={handleChange}
                onSearch={handleSubmit}
                placeholder="Hôm nay bạn muốn du lịch ở đâu?"
                enterButton
                ref={inputSearchRef}
              />
              {isSuggestionsVisible && suggestions.length > 0 && (
                <div className="search-suggestions" ref={suggestionsRef}>
                  {suggestions.map((item, index) => (
                    <Link
                      onClick={handleClickTour}
                      to={`/destinations/${item.slug}`}
                    >
                      <div key={index} className="search-suggestions__tour">
                        <div className="tour__image">
                          <img src={item.thumbnail} />
                        </div>
                        <div className="tour__detail">
                          <div className="tour__name">{item.name}</div>
                          <div className="tour__quantity">
                            {item.quantity} tour
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
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
