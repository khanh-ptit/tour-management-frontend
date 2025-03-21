import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCart, updateCart } from "../../../services/client/cart.service";
import moment from "moment";
import {
  Breadcrumb,
  Col,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Radio,
  Row,
  Select,
} from "antd";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { MdOutlineDeleteOutline } from "react-icons/md";
import styles from "./Cart.module.scss";
import { addToursOrder, updateCartQuantity } from "../../../actions/cart";
import { createOrder } from "../../../services/client/order.service";
const { Option } = Select;

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
  const navigate = useNavigate();

  const [form] = Form.useForm();
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);

  // Fetch danh sách tỉnh/thành phố
  useEffect(() => {
    axios.get("https://provinces.open-api.vn/api/p/").then((res) => {
      setProvinces(res.data);
    });
  }, []);

  // Fetch danh sách huyện/quận khi chọn tỉnh
  useEffect(() => {
    if (selectedProvince) {
      axios
        .get(`https://provinces.open-api.vn/api/p/${selectedProvince}?depth=2`)
        .then((res) => {
          setDistricts(res.data.districts);
          setWards([]); // Reset danh sách xã/phường
          form.setFieldsValue({ district: null, ward: null }); // Reset giá trị form
        });
    }
  }, [selectedProvince]);

  // Fetch danh sách xã/phường khi chọn huyện
  useEffect(() => {
    if (selectedDistrict) {
      axios
        .get(`https://provinces.open-api.vn/api/d/${selectedDistrict}?depth=2`)
        .then((res) => {
          setWards(res.data.wards);
          form.setFieldsValue({ ward: null }); // Reset giá trị xã/phường
        });
    }
  }, [selectedDistrict]);

  const getProvinceName = async (code) => {
    const response = await fetch(`https://provinces.open-api.vn/api/p/${code}`);
    const data = await response.json();
    return data.name;
  };

  const getDistrictName = async (code) => {
    const response = await fetch(`https://provinces.open-api.vn/api/d/${code}`);
    const data = await response.json();
    return data.name;
  };

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

  const handleSubmit = async (data) => {
    const provinceName = await getProvinceName(data.province);
    const districtName = await getDistrictName(data.district);

    let address = `${data.ward}, ${districtName}, ${provinceName}, ${data.street}`;
    if (selectedTours.length === 0) {
      messageApi.open({
        type: "error",
        content: "Vui lòng chọn ít nhất một tour trước khi thanh toán!",
      });
      return;
    }

    let toursOrder = tours
      .filter((item) => selectedTours.includes(item.tourId._id))
      .map((item) => ({
        tourId: item.tourId._id,
        price: item.tourId.newPrice,
        peopleQuantity: item.peopleQuantity,
      }));

    let remainingTours = tours.filter(
      (item) => !selectedTours.includes(item.tourId._id)
    );

    const objectTours = {
      tours: remainingTours,
    };

    const objectSend = {
      userInfo: {
        fullName: data.fullName,
        phone: data.phone,
        address: address,
      },
      tours: toursOrder,
      isPaid: false,
      totalPrice: totalCartPrice,
    };
    try {
      // console.log(objectSend);
      const response = await createOrder(objectSend);
      if (response.code === 200) {
        const orderId = response.orderId;
        await updateCart(objectTours);
        setTours(remainingTours);
        const cartResponse = await getCart();
        dispatch(updateCartQuantity(cartResponse.cart.tours.length));
        localStorage.setItem("createOrderSuccessMessage", response.message);
        navigate(`/orders/detail/${orderId}`);
      }
    } catch (error) {
      messageApi.open({
        type: "error",
        content: error.message,
      });
    }
  };

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
              <>
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
                    <div
                      key={index}
                      className={`col-12 ${styles["cart__item"]}`}
                    >
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
                        <Link to={`/tours/detail/${item.tourId.slug}`}>
                          <div className={`${styles["tour__name"]}`}>
                            {item.tourId.name}
                          </div>
                        </Link>

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
                          {moment(item.tourId.departureDate).format(
                            "DD/MM/YYYY"
                          )}
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
                          <MdOutlineDeleteOutline
                            style={{ fontSize: "24px" }}
                          />
                        </button>
                      </Popconfirm>
                    </div>
                  ))}

                  <div
                    className={`col-12 my-3 text-end ${styles["cart__totalPrice"]}`}
                  >
                    Tổng tiền: {totalCartPrice.toLocaleString()} VNĐ
                  </div>
                </div>
                <div className={`row ${styles["cart__list"]}`}>
                  <div className={`col-12 ${styles["cart__head"]}`}>
                    <div className={`${styles["cart__head--title"]}`}>
                      Thông tin khách hàng
                    </div>
                  </div>
                  <Form form={form} layout="vertical" onFinish={handleSubmit}>
                    <Row gutter={[20]}>
                      <Col span={24}>
                        <Form.Item
                          label="Giới tính"
                          name="gender"
                          rules={[
                            {
                              required: true,
                              message: "Giới tính không được để trống",
                            },
                          ]}
                        >
                          <Radio.Group>
                            <Radio value="male">Nam</Radio>
                            <Radio value="female">Nữ</Radio>
                          </Radio.Group>
                        </Form.Item>
                      </Col>
                      <Col xxl={12} xl={12} lg={12} md={12} sm={24} xs={24}>
                        <Form.Item
                          name="fullName"
                          label="Họ và Tên"
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng nhập họ và tên!",
                            },
                          ]}
                        >
                          <Input placeholder="Ví dụ: Lê Văn A" />
                        </Form.Item>
                      </Col>
                      <Col xxl={12} xl={12} lg={12} md={12} sm={24} xs={24}>
                        <Form.Item
                          name="phone"
                          label="Số điện thoại"
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng nhập số điện thoại!",
                            },
                          ]}
                        >
                          <Input placeholder="Ví dụ: 0123456789" />
                        </Form.Item>
                      </Col>
                      <Col xxl={12} xl={12} lg={12} md={12} sm={24} xs={24}>
                        <Form.Item
                          name="province"
                          label="Tỉnh/Thành phố"
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng chọn tỉnh/thành phố!",
                            },
                          ]}
                        >
                          <Select
                            placeholder="Chọn tỉnh/thành phố"
                            onChange={(value) => setSelectedProvince(value)}
                          >
                            {provinces.map((province) => (
                              <Option key={province.code} value={province.code}>
                                {province.name}
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>

                      {/* Chọn huyện/quận */}
                      <Col xxl={12} xl={12} lg={12} md={12} sm={24} xs={24}>
                        <Form.Item
                          name="district"
                          label="Huyện/Quận"
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng chọn huyện/quận!",
                            },
                          ]}
                        >
                          <Select
                            placeholder="Chọn huyện/quận"
                            disabled={!districts.length}
                            onChange={(value) => setSelectedDistrict(value)}
                          >
                            {districts.map((district) => (
                              <Option key={district.code} value={district.code}>
                                {district.name}
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>

                      {/* Chọn xã/phường */}
                      <Col xxl={12} xl={12} lg={12} md={12} sm={24} xs={24}>
                        <Form.Item
                          name="ward"
                          label="Xã/Phường"
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng chọn xã/phường!",
                            },
                          ]}
                        >
                          <Select
                            placeholder="Chọn xã/phường"
                            disabled={!wards.length}
                          >
                            {wards.map((ward) => (
                              <Option key={ward.code} value={ward.name}>
                                {ward.name}
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col xxl={12} xl={12} lg={12} md={12} sm={24} xs={24}>
                        <Form.Item label="Số nhà, tên đường,..." name="street">
                          <Input placeholder="Ví dụ: 72 ngõ 87 Yên Xá..." />
                        </Form.Item>
                      </Col>
                      <Col span={24}>
                        <Form.Item name="note" label="Ghi chú">
                          <Input.TextArea
                            rows={5}
                            placeholder="Bạn muốn nhắn điều gì với chúng tôi?"
                          />
                        </Form.Item>
                      </Col>
                      <Col span={24}>
                        <Form.Item>
                          <button
                            className={`button button__primary ${styles["payment__button"]}`}
                            htmlType="submit"
                          >
                            Thanh toán
                          </button>
                        </Form.Item>
                      </Col>
                    </Row>
                  </Form>
                </div>
              </>
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
