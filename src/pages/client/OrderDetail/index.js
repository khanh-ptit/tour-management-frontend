import { message, Modal, Spin, Tag } from "antd";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
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
  const [countdown, setCountdown] = useState(180);
  const [showPayment, setShowPayment] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const isPaidRef = useRef(null); // Lưu trạng thái thanh toán trước đó

  useEffect(() => {
    document.title = "Thông tin đơn hàng";
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
        if (error.code === 404) {
          navigate("/error/404");
          return;
        }
        if (error.code === 400) {
          navigate("/error/400");
          return;
        }
        messageApi.open({ type: "error", content: error.message });
      }
    };

    fetchOrder();
  }, [id, messageApi]);

  useEffect(() => {
    if (!order || order.isPaid || !paymentUrl) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setShowPayment(false);
          setIsModalOpen(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [order, paymentUrl]);

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
  }, [id, order, messageApi]);

  if (!order)
    return (
      <Spin spinning={!order} tip="Đang tải dữ liệu...">
        <div style={{ minHeight: "50vh" }}></div>
      </Spin>
    );

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" + s : s}`;
  };

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
                <div className={`mb-1 ${styles["order__create"]}`}>
                  <span className={`${styles["order__bold"]}`}>
                    Thời gian tạo:{" "}
                  </span>
                  {moment(order.createdAt).format("HH:MM DD/MM/YYYY")}
                </div>
              </div>
              <div className="col-xl-4 col-lg-4 col-md-4 col-sm-12 col-12">
                {!order.isPaid && !!paymentUrl && showPayment && (
                  <div className="row">
                    <div className="col-12 text-center">
                      <img
                        src={paymentUrl}
                        alt="QR Code"
                        style={{ width: "200px", height: "200px" }}
                      />
                    </div>

                    <div
                      className={`mt-2 text-center ${styles["order__head--count-down"]}`}
                    >
                      Phiên thanh toán sẽ hết hạn sau: {formatTime(countdown)}
                    </div>
                  </div>
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
      <Modal
        title="Thông báo"
        open={isModalOpen}
        onOk={() => {
          setIsModalOpen(false);
          window.location.reload(); // ✅ reload lại trang khi xác nhận
        }}
        onCancel={() => setIsModalOpen(false)}
        okText="Tải lại"
        cancelText="Đóng"
      >
        <p>
          Phiên thanh toán đã hết hạn, vui lòng tải lại trang để lấy mã QR mới.
        </p>
      </Modal>
    </>
  );
}

export default OrderDetail;
