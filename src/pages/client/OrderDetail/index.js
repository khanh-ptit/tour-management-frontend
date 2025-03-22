import { message, Tag } from "antd";
import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  checkPaymentStatus,
  getOrderDetail,
} from "../../../services/client/order.service";
import styles from "./OrderDetail.module.scss";
import moment from "moment";

function OrderDetail() {
  const { id } = useParams();
  const [messageApi, contextHolder] = message.useMessage();
  const [order, setOrder] = useState(null);
  const [paymentUrl, setPaymentUrl] = useState(null);
  const isPaidRef = useRef(null); // Lưu trạng thái thanh toán trước đó

  useEffect(() => {
    const createOrderSuccessMessage = localStorage.getItem(
      "createOrderSuccessMessage"
    );
    if (createOrderSuccessMessage) {
      messageApi.open({ type: "success", content: createOrderSuccessMessage });
      localStorage.removeItem("createOrderSuccessMessage");
    }

    const fetchOrder = async () => {
      try {
        const response = await getOrderDetail(id);
        if (response.code === 200) {
          setOrder(response.order);
          setPaymentUrl(response.paymentUrl);
          isPaidRef.current = response.order.isPaid; // Lưu trạng thái thanh toán ban đầu
        }
      } catch (error) {
        messageApi.open({ type: "error", content: error.message });
      }
    };

    fetchOrder();
  }, [id]); // ❌ Xóa `order` khỏi dependency để tránh fetch liên tục

  useEffect(() => {
    if (!order || order.isPaid) return; // Dừng nếu order chưa có hoặc đã thanh toán

    const interval = setInterval(async () => {
      const paymentResponse = await checkPaymentStatus(id);
      if (paymentResponse.success && !isPaidRef.current) {
        isPaidRef.current = true; // Cập nhật trạng thái đã thanh toán
        messageApi.open({
          type: "success",
          content: "Đơn hàng đã được thanh toán!",
        });
        setOrder((prev) => ({ ...prev, isPaid: true })); // Cập nhật UI mà không fetch lại API
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [id, order]); // ⚠️ Vẫn giữ `id` nhưng tránh phụ thuộc vào `order` để tránh re-fetch

  if (!order) return <p>Đang tải...</p>;

  return (
    <>
      {contextHolder}
      {order && (
        <div className="container">
          <div className={`${styles["order__wrap"]}`}>
            <div className={`${styles["order__head"]}`}>
              <div className={`${styles["order__head--title"]}`}>
                Thông tin đơn hàng
              </div>
            </div>
            <div className={`row ${styles["order__info"]}`}>
              <div className="col-8">
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
                  <span className={`${styles["order__bold"]}`}>Địa chỉ: </span>
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
              </div>
              <div className="col-4">
                {!order.isPaid && !!paymentUrl && (
                  <>
                    <img
                      src={paymentUrl}
                      alt="QR Code"
                      style={{ width: "200px", height: "200px" }}
                    />
                  </>
                )}
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
                  <Link to={`/tours/detail/${item.tourId.slug}`}>
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
    </>
  );
}

export default OrderDetail;
