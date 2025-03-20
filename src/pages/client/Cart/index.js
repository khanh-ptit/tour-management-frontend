import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCart, updateCart } from "../../../services/client/cart.service";
import moment from "moment";
import { Breadcrumb, message, Modal, Popconfirm } from "antd";
import { Link } from "react-router-dom";
import { MdOutlineDeleteOutline } from "react-icons/md";
import styles from "./Cart.module.scss";
import { updateCartQuantity } from "../../../actions/cart";

function Cart() {
  const { isAuthenticated } = useSelector((state) => state.authReducer);
  const [tours, setTours] = useState([]);
  const [deletingIndex, setDeletingIndex] = useState(null); // Xóa bằng nút thùng rác
  const [subtractIndex, setSubtractIndex] = useState(null); // Xóa bằng nút giảm số lượng
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const [totalCartPrice, setTotalCartPrice] = useState(0);
  const [messageApi, contextHolder] = message.useMessage();
  const [selectedTours, setSelectedTours] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await getCart();
        if (response.code === 200) {
          setTours(response.cart.tours);
          let total = 0;
          for (const item of tours) {
            total += item.tourId.newPrice * item.peopleQuantity;
          }
        }
      } catch (error) {
        console.error(error.message);
      }
    };
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated]);

  const handleAdd = async (index) => {
    const updatedTours = [...tours];
    updatedTours[index].peopleQuantity += 1;
    const objectSend = {
      tours: updatedTours,
    };
    try {
      await updateCart(objectSend);
      setTours(updatedTours);
    } catch (error) {
      messageApi.open({
        type: "error",
        message: error.message || "Đã xảy ra lỗi!",
      });
    }
  };

  const handleSubtract = async (index) => {
    if (tours[index].peopleQuantity > 1) {
      const updatedTours = [...tours];
      updatedTours[index].peopleQuantity -= 1;
      const objectSend = {
        tours: updatedTours,
      };
      try {
        await updateCart(objectSend);
        setTours(updatedTours);
      } catch (error) {
        messageApi.open({
          type: "error",
          message: error.message || "Đã xảy ra lỗi!",
        });
      }
    } else {
      setSubtractIndex(index); // Chỉ hiển thị Popconfirm khi giảm về 1
    }
  };

  const deleteItemFromCart = async (tourId) => {
    // Lọc ra danh sách tour mới, bỏ tour có tourId bị xóa
    const updatedTours = tours.filter((item) => item.tourId._id !== tourId);

    const objectSend = {
      tours: updatedTours,
    };

    try {
      await updateCart(objectSend);
      setTours(updatedTours); // Cập nhật state để giao diện phản ánh thay đổi
      const cartResponse = await getCart();
      dispatch(updateCartQuantity(cartResponse.cart.tours.length));
    } catch (error) {
      messageApi.open({
        type: "error",
        message: error.message || "Đã xảy ra lỗi!",
      });
    }

    setDeletingIndex(null);
    setSubtractIndex(null);
  };

  const deleteAllItem = async () => {
    const objectSend = {
      tours: [],
    };

    try {
      await updateCart(objectSend);
      setTours([]); // Cập nhật state để giao diện phản ánh thay đổi
      const cartResponse = await getCart();
      dispatch(updateCartQuantity(cartResponse.cart.tours.length));
      messageApi.open({
        type: "success",
        content: "Đã xóa tất cả các tour trong giỏ hàng!",
      });
    } catch (error) {
      messageApi.open({
        type: "error",
        message: error.message || "Đã xảy ra lỗi!",
      });
    }
    setIsModalOpen(false);
  };

  const handleSelectTour = (tourId) => {
    setSelectedTours((prevSelected) => {
      if (prevSelected.includes(tourId)) {
        return prevSelected.filter((id) => id !== tourId); // Bỏ chọn
      } else {
        return [...prevSelected, tourId]; // Chọn thêm
      }
    });
  };

  const totalCartPrice = tours
    .filter((item) => selectedTours.includes(item.tourId._id)) // Chỉ tính tour đã chọn
    .reduce(
      (total, item) => total + item.tourId.newPrice * item.peopleQuantity,
      0
    );

  return (
    <>
      {contextHolder}
      <div className="container">
        <Breadcrumb className={styles["bread-crumb"]}>
          <Breadcrumb.Item className={styles["bread-crumb__item"]}>
            <Link to="/">Trang chủ</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item className={styles["bread-crumb__item"]}>
            Giỏ hàng
          </Breadcrumb.Item>
        </Breadcrumb>

        {!isAuthenticated ? (
          <div className={`${styles["page__blank"]}`}>
            <p>Vui lòng đăng nhập/đăng ký để xem giỏ hàng của mình!</p>
          </div>
        ) : (
          <>
            {tours.length > 0 ? (
              <div className={`row ${styles["cart__list"]}`}>
                <div className={`col-12 ${styles["cart__head"]}`}>
                  <div className={`${styles["cart__head--title"]}`}>
                    Giỏ hàng
                  </div>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="button"
                  >
                    Xóa tất cả
                  </button>
                </div>

                {tours.map((item, index) => (
                  <div key={index} className={`col-12 ${styles["cart__item"]}`}>
                    <input
                      type="checkbox"
                      className={`${styles["tour__checkbox"]}`}
                      checked={selectedTours.includes(item.tourId._id)}
                      onChange={() => handleSelectTour(item.tourId._id)}
                    />

                    <div className={`${styles["tour__image"]}`}>
                      <img src={item.tourId.images[0]} alt="Tour" />
                    </div>

                    <div
                      className={`d-flex flex-column ${styles["tour__wrap"]}`}
                    >
                      <div className={`${styles["tour__name"]}`}>
                        {item.tourId.name}
                      </div>

                      <div
                        className={`col-12 d-flex flex-wrap my-1 ${styles["tour__quantity"]}`}
                      >
                        <span style={{ marginRight: "5px" }}>
                          Số lượng người:{" "}
                        </span>
                        <div className="button__wrap">
                          <Popconfirm
                            title="Xác nhận xóa?"
                            description="Bạn có chắc chắn muốn xóa tour này khỏi giỏ hàng không?"
                            onConfirm={() =>
                              deleteItemFromCart(item.tourId._id)
                            }
                            onCancel={() => setSubtractIndex(null)}
                            okText="Xóa"
                            cancelText="Hủy"
                            open={subtractIndex === index} // Chỉ mở Popconfirm khi giảm về 1
                          >
                            <button
                              style={{
                                border: "1px solid #ddd",
                                padding: "1px 8px",
                                borderRadius: "0px",
                                marginRight: "0px",
                              }}
                              onClick={() => handleSubtract(index)}
                              className="button"
                            >
                              -
                            </button>
                          </Popconfirm>

                          <input
                            type="number"
                            min={1}
                            style={{
                              maxWidth: "40px",
                              border: "1px solid #ddd",
                              textAlign: "center",
                              borderRight: "none",
                              borderLeft: "none",
                            }}
                            className={`${styles["tour__quantity--input"]}`}
                            value={item.peopleQuantity}
                            readOnly
                          />

                          <button
                            style={{
                              border: "1px solid #ddd",
                              padding: "1px 8px",
                              borderRadius: "0px",
                            }}
                            onClick={() => handleAdd(index)}
                            className="button"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className={`${styles["tour__departure-date"]}`}>
                        <span>Ngày xuất phát: </span>
                        {moment(item.tourId.departureDate).format("DD/MM/YYYY")}
                      </div>
                      <div className={`${styles["tour__departure-date"]}`}>
                        <span>Ngày trở về: </span>
                        {moment(item.tourId.returnDate).format("DD/MM/YYYY")}
                      </div>
                    </div>

                    <div className={`${styles["tour__totalPrice"]}`}>
                      {(
                        item.tourId.newPrice * item.peopleQuantity
                      ).toLocaleString()}{" "}
                      VNĐ
                    </div>

                    <Popconfirm
                      title="Xác nhận xóa?"
                      description="Bạn có chắc chắn muốn xóa tour này khỏi giỏ hàng không?"
                      onConfirm={() => deleteItemFromCart(item.tourId._id)}
                      onCancel={() => setDeletingIndex(null)}
                      okText="Xóa"
                      cancelText="Hủy"
                      open={deletingIndex === index} // Chỉ mở Popconfirm khi bấm nút xóa
                    >
                      <button
                        onClick={() => setDeletingIndex(index)}
                        className={`button ${styles["tour__delete"]}`}
                      >
                        <MdOutlineDeleteOutline style={{ fontSize: "24px" }} />
                      </button>
                    </Popconfirm>
                  </div>
                ))}

                <div
                  className={`col-12 my-3 text-end ${styles["cart__totalPrice"]}`}
                >
                  Tổng tiền: {totalCartPrice.toLocaleString()} VNĐ
                </div>

                <button className="button button__primary mb-5">
                  Thanh toán
                </button>
              </div>
            ) : (
              <div className={`${styles["page__blank"]}`}>
                <p>Bạn không có tour nào trong giỏ hàng!</p>
              </div>
            )}
          </>
        )}
      </div>
      <Modal
        open={isModalOpen}
        title="Xác nhận xóa"
        onOk={deleteAllItem}
        onCancel={() => setIsModalOpen(false)}
        okText="Xóa"
        cancelText="Hủy"
      >
        <p>
          Bạn có chắc chắn muốn xóa tất cả các tour này khỏi giỏ hàng không?
        </p>
      </Modal>
    </>
  );
}

export default Cart;
