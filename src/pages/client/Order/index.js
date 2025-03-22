import { Breadcrumb, message, Pagination, Select, Spin, Tag } from "antd";
import { useCallback, useEffect, useState } from "react";
import { getOrderList } from "../../../services/client/order.service";
import styles from "./Order.module.scss";
import { Link } from "react-router-dom";

function Order() {
  const [orders, setOrders] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(true);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);
  const [objectPagination, setObjectPagination] = useState({
    total: 0,
    currentPage: 1,
    pageSize: 2,
  });

  useEffect(() => {
    document.title = "Danh sách đơn hàng";
  });

  const fetchOrders = useCallback(async () => {
    try {
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
      const response = await getOrderList(params);
      if (response.code === 200) {
        setOrders(response.orders);
        setObjectPagination((prev) => ({ ...prev, total: response.total }));
        setLoading(false);
      }
    } catch (error) {
      messageApi.open({
        type: "error",
        content: error.message,
      });
    }
  }, [
    objectPagination.currentPage,
    objectPagination.pageSize,
    messageApi,
    sortOrder,
  ]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // console.log(objectPagination);

  const handleSort = (type, value) => {
    if (!value) {
      if (type === "time") {
        setSelectedTime(null);
      } else if (type === "price") {
        setSelectedPrice(null);
      }
      setSortOrder(null);
      setOrders(orders); // Reset danh sách về ban đầu
      return;
    }

    if (type === "time") {
      setSelectedTime(value);
      setSelectedPrice(null);
      setSortOrder(value);
    }

    if (type === "price") {
      setSelectedTime(null);
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
      {contextHolder}
      <Spin spinning={loading} tip="Đang tải dữ liệu...">
        <div className="container">
          <Breadcrumb className={styles["bread-crumb"]}>
            <Breadcrumb.Item className={styles["bread-crumb__item"]}>
              <Link to="/">Trang chủ</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item className={styles["bread-crumb__item"]}>
              Đơn hàng
            </Breadcrumb.Item>
          </Breadcrumb>
          <div className={styles["head-control"]}>
            <span className={styles["head-control__title"]}>
              Sắp xếp theo:{" "}
            </span>
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
                value={selectedPrice}
                onChange={(value) => handleSort("price", value)}
                placeholder="Giá"
                allowClear
              >
                <Select.Option value="totalPrice-asc">
                  Giá tăng dần
                </Select.Option>
                <Select.Option value="totalPrice-desc">
                  Giá giảm dần
                </Select.Option>
              </Select>
            </span>
          </div>
          {orders.length > 0 ? (
            <>
              <div className={`row ${styles["order"]}`}>
                {orders.map((item) => (
                  <Link
                    key={item._id}
                    to={`/orders/detail/${item._id}`}
                    className={`col-12 ${styles["order__item"]}`}
                    style={{ textDecoration: "none", color: "inherit" }} // 🔹 Giữ nguyên định dạng
                  >
                    <div className={`mb-1 ${styles["order__name"]}`}>
                      <span className={`${styles["order__bold"]}`}>
                        Mã đơn hàng:
                      </span>{" "}
                      {item._id}
                    </div>
                    <div className={`mb-1 ${styles["order__name"]}`}>
                      <span className={`${styles["order__bold"]}`}>
                        Họ và tên:
                      </span>{" "}
                      {item.userInfo.fullName}
                    </div>
                    <div className={`mb-1 ${styles["order__phone"]}`}>
                      <span className={`${styles["order__bold"]}`}>
                        Số điện thoại:{" "}
                      </span>
                      {item.userInfo.phone}
                    </div>
                    <div className={`mb-1 ${styles["order__address"]}`}>
                      <span className={`${styles["order__bold"]}`}>
                        Địa chỉ:{" "}
                      </span>
                      {item.userInfo.address}
                    </div>
                    <div className={`mb-1 ${styles["orders__status"]}`}>
                      <span className={`${styles["order__bold"]}`}>
                        Trạng thái:{" "}
                      </span>
                      {item.isPaid ? (
                        <Tag color="green">Đã thanh toán</Tag>
                      ) : (
                        <Tag color="red">Chưa thanh toán</Tag>
                      )}
                    </div>
                    <div className={`mb-1 ${styles["orders__quantity"]}`}>
                      <span className={`${styles["order__bold"]}`}>
                        Số lượng tour:{" "}
                      </span>{" "}
                      {item.tours.length}
                    </div>
                    <div className={`${styles["order__totalPrice"]}`}>
                      <span className={`${styles["order__bold"]}`}>
                        Tổng tiền:{" "}
                      </span>{" "}
                      {item.totalPrice.toLocaleString()} VNĐ
                    </div>
                  </Link>
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
            </>
          ) : (
            <p>Bạn chưa có đơn hàng nào</p>
          )}
        </div>
      </Spin>
    </>
  );
}

export default Order;
