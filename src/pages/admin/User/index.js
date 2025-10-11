import { useCallback, useEffect, useState } from "react";
import { getUserList } from "../../../services/admin/user.service";
import { message } from "antd";
import HeadControlUser from "../../../components/admin/HeadControlUser";
import TableUser from "../../../components/admin/TableUser";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function UserPage() {
  const [users, setUsers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [sortOrder, setSortOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState(null);
  const [reload, setReload] = useState(false);
  const [loading, setLoading] = useState(null);
  const { permissions } = useSelector((state) => state.roleReducer);
  const navigate = useNavigate();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 4,
    total: 0,
  });
  const [messageApi, contextHolder] = message.useMessage();

  const onReload = () => {
    setReload(!reload);
  };

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.current,
        limit: pagination.pageSize,
      };

      if (searchText) {
        params.name = searchText;
      }

      if (sortOrder) {
        const [sortKey, sortValue] = sortOrder.split("-");
        params.sortKey = sortKey;
        params.sortValue = sortValue;
      }

      if (filterStatus) {
        params.status = filterStatus;
      }

      const response = await getUserList(params);
      if (response.code === 200) {
        setUsers(response.users);
        console.log(users);
        setPagination((prev) => ({ ...prev, total: response.total }));
      } else {
        messageApi.open({
          type: "error",
          message: response.message,
        });
      }
    } catch (error) {
      console.error("Lỗi khi fetch dữ liệu:", error);
    } finally {
      setLoading(false);
    }
  }, [searchText, sortOrder, filterStatus, reload, pagination.current]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handlePagination = (page, pageSize) => {
    setPagination({ current: page, pageSize });
  };

  useEffect(() => {
    if (!permissions.includes("users_view")) {
      navigate("/admin/error/403");
    }
    document.title = "Quản lý người dùng | Admin";
  }, []);

  return (
    <>
      {contextHolder}
      <HeadControlUser
        setSearchText={setSearchText}
        setSortOrder={setSortOrder}
        setFilterStatus={setFilterStatus}
      />
      <TableUser
        loading={loading}
        pagination={pagination}
        handlePagination={handlePagination}
        onReload={onReload}
        users={users}
      />
    </>
  );
}

export default UserPage;
