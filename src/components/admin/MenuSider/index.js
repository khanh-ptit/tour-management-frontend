import { Menu } from "antd";
import {
  DashboardOutlined,
  BorderOuterOutlined,
  PicLeftOutlined,
  AppstoreAddOutlined,
  RadiusSettingOutlined,
} from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";

function MenuSider() {
  const location = useLocation(); // Lấy URL hiện tại

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
      label: <Link to="/list-room">List Room</Link>,
      icon: <RadiusSettingOutlined />,
      key: "/list-room",
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
