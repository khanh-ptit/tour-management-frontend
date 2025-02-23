import { Layout, Button, Badge, Drawer } from "antd";
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
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [drawerVisible, setDrawerVisible] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Layout className="layout-admin">
      <header className="header">
        <Link
          className={!collapsed ? "header__logo" : "header__logo--collapsed"}
        >
          {!collapsed ? (
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
              onClick={() => {
                if (isMobile) {
                  setDrawerVisible(true); // Mở menu trên mobile
                } else {
                  setCollapsed(!collapsed); // Toggle trên PC
                }
              }}
              icon={<MenuFoldOutlined />}
            />
            <Button
              type="text"
              className="header__search"
              icon={<SearchOutlined />}
            />
          </div>
          <div className="header__nav--right">
            <Badge dot>{/* <Notification /> */}</Badge>
          </div>
        </div>
      </header>

      <Layout>
        {!isMobile ? (
          <Sider theme={"light"} collapsed={collapsed} className="sider">
            <MenuSider />
          </Sider>
        ) : (
          <Drawer
            title="Menu"
            placement="left"
            onClose={() => setDrawerVisible(false)}
            open={drawerVisible}
          >
            <MenuSider />
          </Drawer>
        )}
        <Content className="content">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}

export default LayoutAdmin;
