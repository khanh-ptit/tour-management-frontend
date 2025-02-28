import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { checkAuth } from "../../../services/admin/auth.service";
import { Spin } from "antd";

const PrivateRoutesAdmin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const fetchApi = async () => {
      try {
        const response = await checkAuth();
        if (response.user) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        setIsAuthenticated(false);
      }
    };

    fetchApi();
  }, []);

  if (isAuthenticated === null)
    return (
      <>
        <Spin tip="Đang tải dữ liệu...">
          <div style={{ width: "100vh", height: "100vh" }}></div>
        </Spin>
      </>
    );
  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/admin/auth/login" replace />
  );
};

export default PrivateRoutesAdmin;
