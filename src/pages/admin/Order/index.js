import { useCallback, useEffect, useState } from "react";
import HeadControlTour from "../../../components/admin/HeadControlTour";
import GridTour from "../../../components/admin/GridTour";
import { getOrderList } from "../../../services/admin/order.service";

import TableOrder from "../../../components/admin/TableOrder";
import HeadControlOrder from "../../../components/admin/HeadControlOrder";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [sortOrder, setSortOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState(null);
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

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.current,
        limit: pagination.pageSize,
      };

      if (searchText) {
        params.keyword = searchText;
      }

      if (sortOrder) {
        const [sortKey, sortValue] = sortOrder.split("-");
        params.sortKey = sortKey;
        params.sortValue = sortValue;
      }

      if (filterStatus) {
        params.paidStatus = filterStatus;
      }

      const result = await getOrderList(params);
      if (result) {
        setOrders(result.orders);
        setPagination((prev) => ({ ...prev, total: result.total }));
      }
    } catch (error) {
      console.error("Lỗi khi fetch dữ liệu:", error);
    } finally {
      setLoading(false);
    }
  }, [searchText, sortOrder, filterStatus, isGrid, reload, pagination.current]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handlePagination = (page, pageSize) => {
    setPagination({ current: page, pageSize });
  };

  useEffect(() => {
    if (!permissions.includes("orders_view")) {
      navigate("/admin/error/403");
      return;
    }
    document.title = "Quản lý tour | Admin";
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
      <HeadControlOrder
        setSearchText={setSearchText}
        setSortOrder={setSortOrder}
        setFilterStatus={setFilterStatus}
        setIsGrid={handleChangeView}
      />
      {isGrid ? (
        <GridTour orders={orders} />
      ) : (
        <TableOrder
          loading={loading}
          pagination={pagination}
          handlePagination={handlePagination}
          onReload={onReload}
          orders={orders}
        />
      )}
    </>
  );
}

export default Orders;
