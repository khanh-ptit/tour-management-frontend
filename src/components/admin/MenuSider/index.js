import { Menu } from "antd";
import {
  DashboardOutlined,
  BorderOuterOutlined,
  PicLeftOutlined,
  AppstoreAddOutlined,
  CustomerServiceOutlined,
  LaptopOutlined,
  InfoCircleOutlined,
  SwapOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./MenuSider.scss";
import { logout } from "../../../services/admin/auth.service";

function MenuSider() {
  const location = useLocation(); // Lấy URL hiện tại
  const navigate = useNavigate();

  const handleLogout = async (e) => {
    e.preventDefault();
    const result = await logout();
    if (result) {
      localStorage.setItem("logoutSuccessMessage", result.message);
      navigate("/admin/auth/login");
    }
  };

  const items = [
    {
      label: <Link to="/admin/dashboard">Tổng quan</Link>,
      key: "/admin/dashboard",
      icon: <DashboardOutlined />,
    },
    {
      label: <Link to="/admin/rooms">Quản lý phòng</Link>,
      icon: <BorderOuterOutlined />,
      key: "/admin/rooms",
    },
    {
      label: <Link to="/admin/tours">Quản lý tour du lịch</Link>,
      icon: <PicLeftOutlined />,
      key: "/admin/tours",
    },
    {
      label: <Link to="/admin/tour-categories">Danh mục tour</Link>,
      icon: <AppstoreAddOutlined />,
      key: "/admin/tour-categories",
    },
    {
      label: <Link to="/admin/services">Dịch vụ</Link>,
      icon: <CustomerServiceOutlined />,
      key: "/admin/services",
    },
    {
      type: "divider",
    },
    {
      label: "Tài khoản",
      icon: <LaptopOutlined />,
      key: "my-account",
      children: [
        {
          label: <Link to="/admin/my-account/info">Thông tin cá nhân</Link>,
          icon: <InfoCircleOutlined />,
          key: "/admin/my-account/info",
        },
        {
          label: (
            <Link to="/admin/my-account/change-password">Đổi mật khẩu</Link>
          ),
          icon: <SwapOutlined />,
          key: "/admin/my-account/change-password",
        },
        {
          label: (
            <Link onClick={handleLogout} to="/admin/auth/logout">
              Đăng xuất
            </Link>
          ),
          icon: <LogoutOutlined />,
        },
      ],
    },
  ];

  return (
    <Menu
      selectedKeys={[location.pathname]}
      // Dùng selectedKeys + useLocation cũng được
      // defaultSelectedKeys={["/"]} //  Cập nhật active theo URL
      defaultOpenKeys={["menu-3"]}
      mode="inline"
      items={items}
    />
  );
}

export default MenuSider;
