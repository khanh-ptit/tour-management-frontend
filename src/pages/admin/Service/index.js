import { useCallback, useEffect, useState } from "react";
import { getServiceList } from "../../../services/admin/service.service";
import TableService from "../../../components/admin/TableService";
import HeadControlService from "../../../components/admin/HeadControlService";

function Serivces() {
  const [services, setServices] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [sortOrder, setSortOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState(null);
  const [reload, setReload] = useState(false);
  const [loading, setLoading] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 4,
    total: 0,
  });

  const onReload = () => {
    setReload(!reload);
  };

  const fetchServices = useCallback(async () => {
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

      const result = await getServiceList(params);
      if (result) {
        setServices(result.services);
        setPagination((prev) => ({ ...prev, total: result.total }));
      }
    } catch (error) {
      console.error("Lỗi khi fetch dữ liệu:", error);
    } finally {
      setLoading(false);
    }
  }, [searchText, sortOrder, filterStatus, reload, pagination.current]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const handlePagination = (page, pageSize) => {
    setPagination({ current: page, pageSize });
  };

  useEffect(() => {
    document.title = "Quản lý dịch vụ | Admin";
  }, []);

  return (
    <>
      <HeadControlService
        setSearchText={setSearchText}
        setSortOrder={setSortOrder}
      />
      <TableService
        loading={loading}
        pagination={pagination}
        handlePagination={handlePagination}
        onReload={onReload}
        services={services}
      />
    </>
  );
}

export default Serivces;
