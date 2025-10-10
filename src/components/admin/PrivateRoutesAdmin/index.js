import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { checkAuth } from "../../../services/admin/auth.service";
import { Spin } from "antd";
import { useDispatch } from "react-redux";
import { getPermissions } from "../../../actions/role";

const PrivateRoutesAdmin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchApi = async () => {
      try {
        const response = await checkAuth();
        if (response.user) {
          setIsAuthenticated(true);
          dispatch(getPermissions(response.role));
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
