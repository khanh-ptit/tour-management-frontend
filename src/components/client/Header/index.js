import { Link, useNavigate } from "react-router-dom";
import removeAccents from "../../../utils/removeAccents";
import logoTopTenTravel from "../../../images/client/logoTopTenTravel.png";
import {
  Avatar,
  Badge,
  Button,
  Dropdown,
  Input,
  Menu,
  message,
  Space,
} from "antd";
import {
  ShoppingCartOutlined,
  MenuOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./Header.scss";
import { logout } from "../../../actions/auth";
import { getCart } from "../../../services/client/cart.service";
import { updateCartQuantity } from "../../../actions/cart";
import { getTourCategoryClientList } from "../../../services/client/tour-category.service";

const { Search } = Input;

function Header() {
  const destinationsData = useSelector((state) => state.destinationReducer);
  const dispatch = useDispatch();

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
  const [messageApi, contextHolder] = message.useMessage();
  const { isAuthenticated, user } = useSelector((state) => state.authReducer);
  const { userUpdate } = useSelector((state) => state.userReducer);
  const { cartQuantity } = useSelector((state) => state.cartReducer);
  const [categoryTree, setCategoryTree] = useState([]);

  const buildCategoryTree = (categories) => {
    const map = {};
    const roots = [];

    categories.forEach((cat) => {
      map[cat._id] = { ...cat, children: [] };
    });

    categories.forEach((cat) => {
      if (cat.categoryParentId) {
        map[cat.categoryParentId]?.children.push(map[cat._id]);
      } else {
        roots.push(map[cat._id]);
      }
    });

    return roots;
  };

  const renderCategoryMenu = (tree) => (
    <Menu className="header__category-menu" style={{ marginBottom: "100px" }}>
      {tree.map((parent) => (
        <Menu.SubMenu key={parent._id} title={parent.name.trim()}>
          {parent.children.map((child) => (
            <Menu.Item key={child._id}>
              <Link to={`/tour-categories/${child.slug}`}>
                {child.name.replace(/^---\s*/, "")}
              </Link>
            </Menu.Item>
          ))}
        </Menu.SubMenu>
      ))}
    </Menu>
  );

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await getCart();
        if (response.code === 200) {
          dispatch(updateCartQuantity(response.cart.tours.length));
        }
      } catch (error) {
        console.error(error);
      }
    };

    const fetchTourCategories = async () => {
      try {
        const response = await getTourCategoryClientList();
        if (response.code === 200) {
          setCategoryTree(buildCategoryTree(response.tourCategories));
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchTourCategories();

    if (isAuthenticated) {
      fetchCart();
    } else {
      dispatch(updateCartQuantity(0)); // Reset giỏ hàng khi đăng xuất
    }
  }, [isAuthenticated, dispatch]);

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
  }, [isAuthenticated]);

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

  const handleLogout = () => {
    if (localStorage.getItem("user") && localStorage.getItem("token")) {
      dispatch(logout());
      dispatch(updateCartQuantity(0)); // Reset giỏ hàng về 0
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      messageApi.success("Đăng xuất thành công!");
      navigate("/");
    }
  };

  const handleMenuClick = (e) => {
    if (e.key === "6") {
      // Key của Menu.Item đăng xuất
      handleLogout();
    }
  };

  // Menu Dropdown
  const menuItems = (
    <Menu className="header__dropdown" onClick={handleMenuClick}>
      <Menu.Item key="1">
        <Link to="/about">Giới thiệu</Link>
      </Menu.Item>
      <Menu.Item key="2">
        <Link to="/news">Tin tức</Link>
      </Menu.Item>
      <Menu.Item key="3">
        <Link to="/contact">Liên hệ</Link>
      </Menu.Item>
      {isAuthenticated ? (
        <Menu.Item key="6">
          <span style={{ cursor: "pointer" }}>Đăng xuất</span>
        </Menu.Item>
      ) : (
        <>
          <Menu.Item key="4">
            <Link to="/user/register">Đăng ký</Link>
          </Menu.Item>
          <Menu.Item key="5">
            <Link to="/user/login">Đăng nhập</Link>
          </Menu.Item>
        </>
      )}
    </Menu>
  );

  const accountMenu = {
    items: [
      {
        key: "/user/profile",
        label: <Link to="/user/profile">Thông tin tài khoản</Link>,
      },
      {
        type: "divider",
      },
      {
        key: "/user/logout",
        label: "Đăng xuất",
        danger: true,
        onClick: handleLogout,
      },
    ],
  };

  return (
    <>
      {contextHolder}
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
                <Dropdown
                  overlay={renderCategoryMenu(categoryTree)}
                  trigger={["hover"]}
                  placement="bottom"
                  overlayClassName="header__category-dropdown"
                >
                  <span className="header__menu-link">Danh mục tour</span>
                </Dropdown>
              </li>
              {!isAuthenticated ? (
                <>
                  <li>
                    <Link to="/user/register">Đăng ký</Link>
                  </li>
                  <li>
                    <Link to="/user/login">Đăng nhập</Link>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Dropdown
                      menu={accountMenu}
                      placement="bottomRight"
                      trigger={["hover"]}
                      overlayClassName="header__category-dropdown"
                    >
                      <Space style={{ cursor: "pointer" }}>
                        <Avatar
                          src={userUpdate?.avatar || user.avatar}
                          size="small"
                          icon={<UserOutlined />}
                        />
                        <span>{userUpdate?.fullName || user.fullName}</span>
                      </Space>
                    </Dropdown>
                  </li>
                </>
              )}

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
                            <img src={item.thumbnail} alt={item.name} />
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

                <Link
                  className="header__booking button button__primary me-3"
                  to={"/orders"}
                >
                  Tra cứu Booking
                </Link>

                {/* Giỏ hàng */}
                <Link to="/cart">
                  <Badge count={cartQuantity}>
                    <ShoppingCartOutlined className="header__cart-icon" />
                  </Badge>
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
