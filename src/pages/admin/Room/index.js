import { useCallback, useEffect, useState } from "react";
import TableRoom from "../../../components/admin/TableRoom";
import HeadControl from "../../../components/admin/HeadControl";
import GridRoom from "../../../components/admin/GridRoom";
import { getRoomList } from "../../../services/admin/room.service";

function Rooms() {
  const [searchText, setSearchText] = useState("");
  const [sortOrder, setSortOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState(null);
  const [isGrid, setIsGrid] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [reload, setReload] = useState(false);
  const [loading, setLoading] = useState(false);
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

  const fetchRooms = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.current,
        limit: pagination.pageSize,
      };

      if (searchText) {
        params.name = searchText;
      }

      if (filterStatus) {
        params.status = filterStatus;
      }

      if (sortOrder) {
        const [sortKey, sortValue] = sortOrder.split("-");
        params.sortKey = sortKey;
        params.sortValue = sortValue;
      }

      const result = await getRoomList(params);
      if (result) {
        setRooms(result.rooms);
        setPagination((prev) => ({ ...prev, total: result.total }));
      }
    } catch (error) {
      console.error("Lỗi khi fetch dữ liệu:", error);
    }
    setLoading(false);
  }, [searchText, sortOrder, filterStatus, pagination.current, reload, isGrid]);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  const handlePagination = (page, pageSize) => {
    setPagination({ current: page, pageSize });
  };

  useEffect(() => {
    document.title = "Quản lý phòng | Admin";
  }, []);

  const handleChangeView = () => {
    setIsGrid((prev) => !prev);
    setPagination((prev) => ({
      ...prev,
      current: 1, // Cập nhật current về 1 mỗi khi đổi chế độ
    }));
  };

  return (
    <>
      <HeadControl
        setSearchText={setSearchText}
        setSortOrder={setSortOrder}
        setFilterStatus={setFilterStatus}
        setIsGrid={handleChangeView}
      />
      {isGrid ? (
        <GridRoom
          rooms={rooms}
          loading={loading}
          pagination={pagination}
          handlePagination={handlePagination}
          onReload={onReload}
        />
      ) : (
        <TableRoom
          rooms={rooms}
          loading={loading}
          pagination={pagination}
          handlePagination={handlePagination}
          onReload={onReload}
        />
      )}
    </>
  );
}

export default Rooms;
