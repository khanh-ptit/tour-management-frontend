import { useCallback, useEffect, useState } from "react";
import { getTourByCategory } from "../../../services/client/tour.service";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Breadcrumb, Pagination, Select, Spin } from "antd";
import styles from "./Tour.module.scss";

function Tour() {
  const [tours, setTours] = useState([]);
  const { slug } = useParams();
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const navigate = useNavigate();

  // State lưu trạng thái của từng Select
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedName, setSelectedName] = useState(null);
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [objectPagination, setObjectPagination] = useState({
    total: 0,
    currentPage: 1,
    pageSize: 8,
  });
  const [sortOrder, setSortOrder] = useState(null);

  useEffect(() => {
    if (title !== "") {
      document.title = `Danh mục | ${title}`;
    }
  });

  const fetchTours = useCallback(async () => {
    setLoading(true);
    const params = {
      page: objectPagination.currentPage,
      limit: objectPagination.pageSize,
    };

    if (sortOrder !== null) {
      const [sortKey, sortValue] = sortOrder.split("-");
      params.sortKey = sortKey;
      params.sortValue = sortValue;
    }
    try {
      const response = await getTourByCategory(slug, params);
      if (response.code === 200) {
        setTours(response.tours);
        setObjectPagination((prev) => ({ ...prev, total: response.total }));
        setLoading(false);
        setTitle(response.title);
      }
    } catch (error) {
      if (error.code === 404) {
        navigate("/error/404");
        return;
      }
    }
  }, [objectPagination.currentPage, sortOrder, slug]);

  useEffect(() => {
    fetchTours();
  }, [fetchTours, slug]);

  const handleSort = (type, value) => {
    if (!value) {
      if (type === "time") {
        setSelectedTime(null);
      } else if (type === "name") {
        setSelectedName(null);
      } else if (type === "price") {
        setSelectedPrice(null);
      }
      setSortOrder(null);
      setTours(tours); // Reset danh sách về ban đầu
      return;
    }

    if (type === "time") {
      setSelectedTime(value);
      setSelectedName(null);
      setSelectedPrice(null);
      setSortOrder(value);
    }

    if (type === "name") {
      setSelectedTime(null);
      setSelectedName(value);
      setSelectedPrice(null);
      setSortOrder(value);
    }

    if (type === "price") {
      setSelectedTime(null);
      setSelectedName(null);
      setSelectedPrice(value);
      setSortOrder(value);
    }
  };

  const handlePagination = async (value) => {
    console.log(value);
    setObjectPagination((prev) => ({ ...prev, currentPage: parseInt(value) }));
  };

  return (
    <>
      <div className="container">
        <Breadcrumb className={styles["bread-crumb"]}>
          <Breadcrumb.Item className={styles["bread-crumb__item"]}>
            <Link to="/">Trang chủ</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item className={styles["bread-crumb__item"]}>
            {title}
          </Breadcrumb.Item>
        </Breadcrumb>
        <div className={styles["head-control"]}>
          <span className={styles["head-control__title"]}>Sắp xếp theo: </span>
          <span className={styles["select"]}>
            <Select
              style={{ width: "100%" }}
              value={selectedTime}
              onChange={(value) => handleSort("time", value)}
              placeholder="Thời gian"
              allowClear
            >
              <Select.Option value="createdAt-desc">Mới nhất</Select.Option>
              <Select.Option value="createdAt-asc">Cũ nhất</Select.Option>
            </Select>
          </span>

          <span className={styles["select"]}>
            <Select
              style={{ width: "100%" }}
              value={selectedName}
              onChange={(value) => handleSort("name", value)}
              placeholder="Tên"
              allowClear
            >
              <Select.Option value="name-asc">Từ A - Z</Select.Option>
              <Select.Option value="name-desc">Từ Z - A</Select.Option>
            </Select>
          </span>

          <span className={styles["select"]}>
            <Select
              style={{ width: "100%" }}
              value={selectedPrice}
              onChange={(value) => handleSort("price", value)}
              placeholder="Giá"
              allowClear
            >
              <Select.Option value="newPrice-asc">Giá tăng dần</Select.Option>
              <Select.Option value="newPrice-desc">Giá giảm dần</Select.Option>
            </Select>
          </span>
        </div>
        <Spin
          spinning={loading}
          tip="Đang tải dữ liệu..."
          wrapperClassName={styles["tour__spin-wrapper"]}
        >
          <div className={`row ${styles["tour__list"]}`}>
            {tours.length > 0 &&
              tours.map((item) => (
                <div
                  key={item._id}
                  className={`col-xl-3 col-lg-4 col-md-4 col-sm-6 col-12 ${styles["tour__item"]}`}
                >
                  <div className={styles["tour__image"]}>
                    <img src={item.images[0]} alt={item.name} />
                    <div className={styles["tour__discountPercentage"]}>
                      -{item.discountPercentage}%
                    </div>
                    <div className={styles["tour__overlay"]}>
                      <Link to={`/tours/detail/${item.slug}`}>
                        <button
                          className={`button button__primary ${styles["tour__button"]}`}
                        >
                          Xem chi tiết
                        </button>
                      </Link>
                      <button className={`button ${styles["tour__button"]}`}>
                        Thêm vào giỏ hàng
                      </button>
                    </div>
                  </div>

                  <div className={styles["tour__content"]}>
                    <div className={styles["tour__title"]}>{item.name}</div>
                    <div className={styles["tour__old-price"]}>
                      Giá niêm yết: {item.totalPrice.toLocaleString()} VNĐ
                    </div>
                    <div className={styles["tour__new-price"]}>
                      Giá ưu đãi: {item.newPrice.toLocaleString()} VNĐ
                    </div>
                    <div className={styles["tour__duration"]}>
                      Thời gian: {item.duration}
                    </div>
                  </div>
                </div>
              ))}
          </div>
          <Pagination
            style={{ marginBottom: "20px" }}
            align="center"
            current={objectPagination.currentPage}
            pageSize={parseInt(objectPagination.pageSize)}
            total={parseInt(objectPagination.total)}
            onChange={handlePagination}
          />
        </Spin>
      </div>
    </>
  );
}

export default Tour;
