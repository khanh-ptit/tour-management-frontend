import { Layout, Button, Badge } from "antd";
import "./LayoutAdmin.scss";
import logo from "../../images/logo.png";
import logoFold from "../../images/logo-fold.png";
import { SearchOutlined, MenuFoldOutlined } from "@ant-design/icons";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
// import Notification from "../../components/Notification";
import MenuSider from "../../components/admin/MenuSider";
import { Outlet } from "react-router-dom";
const { Sider, Content } = Layout;

function LayoutAdmin() {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <>
      <Helmet>
        <title>Trang tổng quan</title>
        <link rel="icon" type="image/png" href={logoFold} />
      </Helmet>
      <Layout className="layout-admin">
        <header className="header">
          <Link
            className={collapsed ? "header__logo" : "header__logo--collapsed"}
          >
            {collapsed ? (
              <img src={logo} alt="Logo" />
            ) : (
              <img src={logoFold} alt="Logo" />
            )}
          </Link>
          <div className="header__nav">
            <div className="header__nav--left">
              <Button
                type="text"
                className="header__collapse"
                onClick={() => setCollapsed(!collapsed)}
                icon={<MenuFoldOutlined />}
              ></Button>
              <Button
                type="text"
                className="header__search"
                icon={<SearchOutlined />}
              ></Button>
            </div>
            <div className="header__nav--right">
              <Badge dot>{/* <Notification /> */}</Badge>
            </div>
          </div>
        </header>
        <Layout>
          <Sider theme={"light"} collapsed={!collapsed} className="sider">
            <MenuSider />
          </Sider>
          <Content className="content">
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </>
  );
}

export default LayoutAdmin;
