import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { checkAuth } from "../../../services/admin/auth.service";

const PrivateRoutesAdmin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const fetchApi = async () => {
      try {
        const response = await checkAuth();
        console.log(response);
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

  if (isAuthenticated === null) return <p>Loading...</p>;
  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/admin/auth/login" replace />
  );
};

export default PrivateRoutesAdmin;
