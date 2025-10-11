import { useCallback, useEffect, useState } from "react";
import { getRoleList } from "../../../services/admin/role.service";
import TableRole from "../../../components/admin/TableRole";
import GridRole from "../../../components/admin/GridRole";
import HeadControlRole from "../../../components/admin/HeadControlRole";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function Roles() {
  const [roles, setRoles] = useState([]);
  const [isGrid, setIsGrid] = useState(false);
  const [reload, setReload] = useState(false);
  const [loading, setLoading] = useState(null);
  const { permissions } = useSelector((state) => state.roleReducer);
  const navigate = useNavigate();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 4,
    total: 0,
  });

  useEffect(() => {
    isGrid ? (pagination.pageSize = 6) : (pagination.pageSize = 4);
  }, [isGrid]);

  const onReload = () => {
    setReload(!reload);
  };

  const fetchTour = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.current,
        limit: pagination.pageSize,
      };

      const result = await getRoleList(params);
      if (result) {
        setRoles(result.roles);
        setPagination((prev) => ({ ...prev, total: result.total }));
      }
    } catch (error) {
      console.error("Lỗi khi fetch dữ liệu:", error);
    } finally {
      setLoading(false);
    }
  }, [isGrid, reload, pagination.current]);

  useEffect(() => {
    fetchTour();
  }, [fetchTour]);

  const handlePagination = (page, pageSize) => {
    setPagination({ current: page, pageSize });
  };

  useEffect(() => {
    if (!permissions.includes("roles_view")) {
      navigate("/admin/error/403");
    }
    document.title = "Quản lý nhóm quyền | Admin";
  }, []);

  const handleChangeView = () => {
    // console.log("*");
    setIsGrid((prev) => !prev);
    setPagination((prev) => ({
      ...prev,
      current: 1, // Cập nhật current về 1 mỗi khi đổi chế độ
    }));
  };

  return (
    <>
      <HeadControlRole setIsGrid={handleChangeView} />
      {isGrid ? (
        <GridRole roles={roles} />
      ) : (
        <TableRole
          loading={loading}
          pagination={pagination}
          handlePagination={handlePagination}
          onReload={onReload}
          roles={roles}
        />
      )}
    </>
  );
}

export default Roles;
