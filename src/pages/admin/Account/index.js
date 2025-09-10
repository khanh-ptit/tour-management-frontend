import { useCallback, useEffect, useState } from "react";
import GridTour from "../../../components/admin/GridTour";
import { getAccountList } from "../../../services/admin/account.service";
import TableAccount from "../../../components/admin/TableAccount";
import HeadControlAccount from "../../../components/admin/HeadControlAccount";

function Accounts() {
  const [accounts, setAccounts] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [sortOrder, setSortOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState(null);
  const [isGrid, setIsGrid] = useState(false);
  const [reload, setReload] = useState(false);
  const [loading, setLoading] = useState(null);
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

  const fetchAccount = useCallback(async () => {
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
      console.log("🚀 ~ Accounts ~ params:", params);

      const result = await getAccountList(params);
      if (result) {
        setAccounts(result.accounts);
        setPagination((prev) => ({ ...prev, total: result.total }));
      }
    } catch (error) {
      console.error("Lỗi khi fetch dữ liệu:", error);
    } finally {
      setLoading(false);
    }
  }, [searchText, sortOrder, filterStatus, isGrid, reload, pagination.current]);

  useEffect(() => {
    fetchAccount();
  }, [fetchAccount]);

  const handlePagination = (page, pageSize) => {
    setPagination({ current: page, pageSize });
  };

  useEffect(() => {
    document.title = "Quản lý tài khoản | Admin";
  }, []);

  const handleChangeView = () => {
    setIsGrid((prev) => !prev);
    setPagination((prev) => ({
      ...prev,
      current: 1,
    }));
  };

  return (
    <>
      <HeadControlAccount
        setSearchText={setSearchText}
        setSortOrder={setSortOrder}
        setFilterStatus={setFilterStatus}
        setIsGrid={handleChangeView}
      />
      {isGrid ? (
        <GridTour accounts={accounts} />
      ) : (
        <TableAccount
          loading={loading}
          pagination={pagination}
          handlePagination={handlePagination}
          onReload={onReload}
          accounts={accounts}
        />
      )}
    </>
  );
}

export default Accounts;
