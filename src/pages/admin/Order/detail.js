import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Spin, Tag } from "antd";
import moment from "moment";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { getOrderDetailAdmin } from "../../../services/admin/order.service";
import styles from "./OrderDetail.module.scss";
import { useSelector } from "react-redux";

function OrderDetailAdmin() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const { permissions } = useSelector((state) => state.roleReducer);
  const navigate = useNavigate();

  useEffect(() => {
    if (!permissions.includes("orders_view")) {
      navigate("/admin/error/403");
    }
    if (order) {
      document.title = `Chi tiết đơn hàng`;
    }
  }, [order]);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const result = await getOrderDetailAdmin(id);
        setOrder(result.order);
        console.log("🚀 ~ fetchOrder ~ result.order:", result.order);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu đơn hàng:", error);
      }
    }
    fetchOrder();
  }, [id]);

  return (
    <Spin spinning={!order} tip="Đang tải dữ liệu...">
      <div className="" style={{ minHeight: "500px" }}>
        {order && (
          <div className="">
            <div className={`${styles["order__wrap"]}`}>
              <div className={`${styles["order__head"]}`}>
                <div className={`${styles["order__head--title"]}`}>
                  Thông tin đơn hàng
                </div>
              </div>
              <div className={`row ${styles["order__info"]}`}>
                <div className="col-xl-8 col-lg-8 col-md-8 col-sm-12 col-12">
                  <div className={`mb-1 ${styles["order__id"]}`}>
                    <span className={`${styles["order__bold"]}`}>
                      Mã đơn hàng:{" "}
                    </span>
                    {order._id}
                  </div>
                  <div className={`mb-1 ${styles["order__name"]}`}>
                    <span className={`${styles["order__bold"]}`}>
                      Họ và tên:{" "}
                    </span>
                    {order.userInfo.fullName}
                  </div>
                  <div className={`mb-1 ${styles["order__phone"]}`}>
                    <span className={`${styles["order__bold"]}`}>
                      Số điện thoại:{" "}
                    </span>
                    {order.userInfo.phone}
                  </div>
                  <div className={`mb-1 ${styles["order__address"]}`}>
                    <span className={`${styles["order__bold"]}`}>
                      Địa chỉ:{" "}
                    </span>
                    {order.userInfo.address}
                  </div>
                  <div className={`${styles["order__status"]}`}>
                    <span className={`${styles["order__bold"]}`}>
                      Trạng thái:{" "}
                    </span>
                    {order.isPaid ? (
                      <Tag style={{ display: "inline-block" }} color="green">
                        Đã thanh toán
                      </Tag>
                    ) : (
                      <Tag style={{ display: "inline-block" }} color="red">
                        Chưa thanh toán
                      </Tag>
                    )}
                  </div>
                  <div className={`mb-1 ${styles["order__create"]}`}>
                    <span className={`${styles["order__bold"]}`}>
                      Thời gian tạo:{" "}
                    </span>
                    {moment(order.createdAt).format("HH:MM DD/MM/YYYY")}
                  </div>
                </div>
              </div>
              <div className={`${styles["order__head"]}`}>
                <div className={`${styles["order__head--title"]}`}>
                  Danh sách tour
                </div>
              </div>
              {order.tours.map((item, index) => (
                <div key={index} className={`col-12 ${styles["order__item"]}`}>
                  <div className={`${styles["tour__image"]}`}>
                    <img src={item.tourId.images[0]} alt="Tour" />
                  </div>

                  <div className={`d-flex flex-column ${styles["tour__wrap"]}`}>
                    <Link to={`/admin/tours/detail/${item.tourId.slug}`}>
                      <div className={`${styles["tour__name"]}`}>
                        {item.tourId.name}
                      </div>
                    </Link>

                    <div
                      className={`col-12 d-flex flex-wrap my-1 ${styles["tour__quantity"]}`}
                    >
                      <span
                        className={`${styles["order__bold"]}`}
                        style={{ marginRight: "5px" }}
                      >
                        Số lượng người:{" "}
                      </span>{" "}
                      {item.peopleQuantity}
                    </div>

                    <div className={`${styles["tour__departure-date"]}`}>
                      <span className={`${styles["order__bold"]}`}>
                        Ngày xuất phát:{" "}
                      </span>
                      {moment(item.tourId.departureDate).format("DD/MM/YYYY")}
                    </div>
                    <div className={`${styles["tour__departure-date"]}`}>
                      <span className={`${styles["order__bold"]}`}>
                        Ngày trở về:{" "}
                      </span>
                      {moment(item.tourId.returnDate).format("DD/MM/YYYY")}
                    </div>
                  </div>

                  <div className={`${styles["tour__totalPrice"]}`}>
                    {(item.price * item.peopleQuantity).toLocaleString()} VNĐ
                  </div>
                </div>
              ))}
              <div
                className={`col-12 my-3 text-end ${styles["order__totalPrice"]}`}
              >
                Tổng tiền: {order.totalPrice.toLocaleString()} VNĐ
              </div>
            </div>
          </div>
        )}
      </div>
    </Spin>
  );
}

export default OrderDetailAdmin;
