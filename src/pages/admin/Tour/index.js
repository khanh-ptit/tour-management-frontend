import { useCallback, useEffect, useState } from "react";
import HeadControlTour from "../../../components/admin/HeadControlTour";
import { getTourList } from "../../../services/admin/tour.service";
import GridTour from "../../../components/admin/GridTour";
import TableTour from "../../../components/admin/TableTour";
import { useNavigate } from "react-router-dom";
import { Spin } from "antd";
import { useSelector } from "react-redux";

function Tours() {
  const [tours, setTours] = useState([]);
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

  const fetchTour = useCallback(async () => {
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

      const response = await getTourList(params);
      if (response.code === 200) {
        setTours(response.tours);
        setPagination((prev) => ({ ...prev, total: response.total }));
      }
    } catch (error) {
      if (error.code === 403) {
        navigate("/admin/error/403");
      }
      console.error("Lỗi khi fetch dữ liệu:", error);
    } finally {
      setLoading(false);
    }
  }, [searchText, sortOrder, filterStatus, isGrid, reload, pagination.current]);

  useEffect(() => {
    fetchTour();
  }, [fetchTour]);

  const handlePagination = (page, pageSize) => {
    setPagination({ current: page, pageSize });
  };

  useEffect(() => {
    document.title = "Quản lý tour | Admin";
    if (!permissions.includes("tours_view")) {
      navigate("/admin/error/403");
    }
  }, []);

  const handleChangeView = () => {
    setIsGrid((prev) => !prev);
    setPagination((prev) => ({
      ...prev,
      current: 1,
    }));
  };

  if (tours.length === 0) {
    return (
      <>
        <Spin spinning={loading} tip="Đang tải dữ liệu...">
          <div style={{ height: "80vh" }}></div>
        </Spin>
      </>
    );
  }

  return (
    <>
      <HeadControlTour
        setSearchText={setSearchText}
        setSortOrder={setSortOrder}
        setFilterStatus={setFilterStatus}
        setIsGrid={handleChangeView}
      />
      {isGrid ? (
        <GridTour tours={tours} />
      ) : (
        <TableTour
          loading={loading}
          pagination={pagination}
          handlePagination={handlePagination}
          onReload={onReload}
          tours={tours}
        />
      )}
    </>
  );
}

export default Tours;
