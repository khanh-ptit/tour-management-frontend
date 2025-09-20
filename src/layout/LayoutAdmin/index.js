import { Layout, Button, Badge, Drawer, Dropdown, Space, Avatar } from "antd";
import styles from "./LayoutAdmin.module.scss";
import logo from "../../images/logo.png";
import logoFold from "../../images/logo-fold.png";
import {
  BellOutlined,
  MenuFoldOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useState, useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import MenuSider from "../../components/admin/MenuSider";
import { getInfo } from "../../services/admin/my-account.service";
import { logout } from "../../services/admin/auth.service";
import { useSelector } from "react-redux";

const { Sider, Content } = Layout;

function LayoutAdmin() {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [account, setAccount] = useState({});
  const navigate = useNavigate();
  const { accountInfo } = useSelector((state) => state.accountReducer);

  useEffect(() => {
    const fetchAccount = async () => {
      const response = await getInfo();
      if (response.code === 200) {
        setAccount(response.account);
      }
    };
    fetchAccount();
  }, []);

  const handleLogout = async (e) => {
    e.preventDefault();
    const result = await logout();
    if (result) {
      localStorage.setItem("logoutSuccessMessage", result.message);
      navigate("/admin/auth/login");
    }
  };

  const accountMenu = {
    items: [
      {
        key: "/admin/my-account/info",
        label: <Link to="/admin/my-account/info">Thông tin tài khoản</Link>,
      },
      {
        type: "divider",
      },
      {
        key: "/admin/auth/logout",
        label: (
          <Link
            onClick={handleLogout}
            style={{ color: "red" }}
            to="/admin/auth/logout"
          >
            Đăng xuất
          </Link>
        ),
      },
    ],
  };

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
          </div>
          <div
            className={`${styles["header__nav--right"]} d-flex align-items-center`}
          >
            <Badge dot>
              <BellOutlined style={{ fontSize: "18px" }} />
            </Badge>

            <div className="mx-4">
              <Dropdown
                menu={accountMenu}
                placement="bottomRight"
                trigger={["hover"]}
              >
                <Space style={{ cursor: "pointer" }}>
                  <Avatar
                    src={accountInfo.avatar || account.avatar}
                    size="small"
                    icon={<UserOutlined />}
                  />
                  <span>{accountInfo.fullName || account.fullName}</span>
                </Space>
              </Dropdown>
            </div>
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
