import { Layout, Button, Badge, Drawer } from "antd";
import styles from "./LayoutAdmin.module.scss";
import logo from "../../images/logo.png";
import logoFold from "../../images/logo-fold.png";
import { SearchOutlined, MenuFoldOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { Link, Outlet } from "react-router-dom";
import MenuSider from "../../components/admin/MenuSider";

const { Sider, Content } = Layout;

function LayoutAdmin() {
  const [collapsed, setCollapsed] = useState(false);
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
    <Layout className={styles["layout-admin"]}>
      <header className={styles["header"]}>
        <Link
          to="/admin/dashboard"
          className={
            isMobile || collapsed
              ? styles["header__logo--collapsed"]
              : styles["header__logo"]
          }
        >
          <img src={isMobile || collapsed ? logoFold : logo} alt="Logo" />
        </Link>

        <div className={styles["header__nav"]}>
          <div className={styles["header__nav--left"]}>
            <Button
              type="text"
              className={styles["header__collapse"]}
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
              className={styles["header__search"]}
              icon={<SearchOutlined />}
            />
          </div>
          <div className={styles["header__nav--right"]}>
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
        <Content className={styles["content"]}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}

export default LayoutAdmin;
