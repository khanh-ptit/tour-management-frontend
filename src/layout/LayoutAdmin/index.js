import { Layout, Button, Badge } from "antd";
import "./LayoutAdmin.scss";
import logo from "../../images/logo.png";
import logoFold from "../../images/logo-fold.png";
import { SearchOutlined, MenuFoldOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { Link, Outlet } from "react-router-dom";
import MenuSider from "../../components/admin/MenuSider";

const { Sider, Content } = Layout;

function LayoutAdmin() {
  const [collapsed, setCollapsed] = useState(true);

  useEffect(() => {
    // Cập nhật favicon
    const favicon = document.querySelector("link[rel='icon']");
    if (favicon) {
      favicon.href = logoFold;
    } else {
      const newFavicon = document.createElement("link");
      newFavicon.rel = "icon";
      newFavicon.type = "image/png";
      newFavicon.href = logoFold;
      document.head.appendChild(newFavicon);
    }
  }, []);

  return (
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
  );
}

export default LayoutAdmin;
