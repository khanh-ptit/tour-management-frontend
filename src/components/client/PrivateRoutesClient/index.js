import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { Spin } from "antd";
import { checkAuthClient } from "../../../services/client/auth.service";

const PrivateRoutesClient = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const fetchApi = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setIsAuthenticated(false);
          return;
        }
        const response = await checkAuthClient(token);
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
      <Spin tip="Đang tải dữ liệu...">
        <div style={{ width: "100vh", height: "100vh" }}></div>
      </Spin>
    );

  return isAuthenticated ? <Outlet /> : <Navigate to="/user/login" replace />;
};

export default PrivateRoutesClient;
