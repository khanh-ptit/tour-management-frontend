import { useCallback, useEffect, useState } from "react";
import { getTourCategoryList } from "../../../services/admin/tour-category.service";
import TableTourCategories from "../../../components/admin/TableTourCategories";
import HeadControlTourCategory from "../../../components/admin/HeadControlTourCategory";
import GridTourCategory from "../../../components/admin/GridTourCategory";

function TourCategories() {
  const [tourCategories, setTourCategories] = useState([]);
  const [isGrid, setIsGrid] = useState(false);
  const [reload, setReload] = useState(false);
  const [loading, setLoading] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 4,
    total: 0,
  });

  useEffect(() => {
    setPagination((prev) => ({
      ...prev,
      pageSize: isGrid ? 6 : 4,
      current: 1, // Reset về trang 1 khi thay đổi kiểu hiển thị
    }));
  }, [isGrid]);

  const onReload = () => {
    setReload(!reload);
  };

  const fetchTourCategories = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.current,
        limit: pagination.pageSize, // Sử dụng pageSize động
      };

      const result = await getTourCategoryList(params);
      if (result) {
        setTourCategories(result.tourCategories);
        setPagination((prev) => ({ ...prev, total: result.total }));
      }
    } catch (error) {
      console.error("Lỗi khi fetch dữ liệu:", error);
    } finally {
      setLoading(false);
    }
  }, [pagination.current, pagination.pageSize, reload]); // Thêm pagination.pageSize vào dependency

  useEffect(() => {
    fetchTourCategories();
  }, [fetchTourCategories]);

  const handlePagination = (page, pageSize) => {
    setPagination((prev) => ({
      ...prev,
      current: page,
      pageSize: pageSize,
    }));
  };

  useEffect(() => {
    document.title = "Danh mục tour | Admin";
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
      <HeadControlTourCategory setIsGrid={handleChangeView} />
      {isGrid ? (
        <GridTourCategory tourCategories={tourCategories} />
      ) : (
        <TableTourCategories
          loading={loading}
          pagination={pagination}
          handlePagination={handlePagination}
          onReload={onReload}
          tourCategories={tourCategories}
        />
      )}
    </>
  );
}

export default TourCategories;
