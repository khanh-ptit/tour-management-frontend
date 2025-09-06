import { useEffect, useState } from "react";
import {
  getTourByCategory,
  getTourDetail,
} from "../../../services/client/tour.service";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Breadcrumb, message, Spin, Tag } from "antd";
import moment from "moment";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Thumbs, Navigation, Pagination } from "swiper/modules";
import { useDispatch, useSelector } from "react-redux";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { IoCartOutline } from "react-icons/io5";
import { IoIosWallet } from "react-icons/io";
import styles from "./TourDetail.module.scss";
import customStyles from "./Tour.module.scss";
import { IoChatbubbleEllipsesSharp } from "react-icons/io5";
import { addToCart, getCart } from "../../../services/client/cart.service";
import { updateCartQuantity } from "../../../actions/cart";
import { useOutletContext } from "react-router-dom";

function TourDetailClient() {
  const { slug } = useParams();
  const [tour, setTour] = useState({});
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [quantity, setQuantity] = useState(0);
  const [referenceTours, setReferenceTours] = useState([]);
  const [referenceSlug, setReferenceSlug] = useState(null);
  const [destinationName, setDestinationName] = useState(null);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useSelector((state) => state.authReducer);
  const [messageApi, contextHolder] = message.useMessage();
  const { setIsChatOpen } = useOutletContext();
  const dispatch = useDispatch();

  const domesticTour = useSelector(
    (state) => state.destinationReducer.domestic
  );
  const foreignTour = useSelector((state) => state.destinationReducer.foreign);

  const navigate = useNavigate();

  useEffect(() => {
    if (tour.name) {
      document.title = `${tour.name}`;
    }
  }, [tour]); // Cập nhật khi `tour` thay đổi

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll mượt lên đầu trang
  }, [slug]); // Kích hoạt khi slug thay đổi

  useEffect(() => {
    const fetchTour = async () => {
      setLoading(true);
      const response = await getTourDetail(slug);
      if (response.code === 200) {
        setTour(response.tour);

        const fetchedDestinationName = response.tour.destinationId?.name || ""; // Lấy trực tiếp từ API
        setDestinationName(fetchedDestinationName); // Cập nhật state

        if (domesticTour.some((dest) => dest.name === fetchedDestinationName)) {
          setReferenceSlug("tour-trong-nuoc");
        } else if (
          foreignTour.some((dest) => dest.name === fetchedDestinationName)
        ) {
          setReferenceSlug("tour-nuoc-ngoai");
        } else {
          setLoading(false);
        }
        const fetchReferenceTours = async () => {
          const result = await getTourByCategory(referenceSlug);
          if (result.code === 200) {
            setReferenceTours(result.tours);
            setLoading(false);
          }
        };
        if (referenceSlug !== null) fetchReferenceTours();
      } else if (response.code === 404) {
        navigate("/error/404");
      }
    };
    fetchTour();
  }, [slug, navigate, domesticTour, foreignTour, referenceSlug]); // Đảm bảo dependencies được cập nhật

  const handleAdd = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleSubtract = () => {
    if (quantity < 1) {
      return;
    }
    setQuantity((prev) => prev - 1);
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      messageApi.open({
        type: "error",
        content: "Vui lòng đăng nhập trước khi thêm giỏ hàng!",
      });
    } else {
      if (quantity === 0) {
        messageApi.open({
          type: "error",
          content: "Vui lòng chọn số lượng người!",
        });
        return;
      }

      const cartId = localStorage.getItem("cartId");
      const objectSend = {
        cartId: cartId,
        tourId: tour._id,
        peopleQuantity: quantity,
      };
      try {
        const response = await addToCart(objectSend);
        console.log(response);
        messageApi.open({
          type: "success",
          content: "Đã thêm tour vào giỏ hàng!",
        });
        setQuantity(0);

        const cartResponse = await getCart();
        dispatch(updateCartQuantity(cartResponse.cart.tours.length));
      } catch (error) {
        messageApi.open({
          type: "error",
          content: error.message || "Đã xảy ra lỗi khi thêm vào giỏ hàng!",
        });
      }
    }
  };

  const handleChatButton = () => {
    if (!isAuthenticated) {
      messageApi.open({
        type: "error",
        content: "Vui lòng đăng nhập để chat với admin!",
      });
    } else {
      setIsChatOpen(true);
    }
  };

  return (
    <>
      {contextHolder}
      <div className="container">
        <Spin spinning={loading} tip="Đang tải dữ liệu...">
          <div style={{ minHeight: "50vh" }}>
            {tour && tour.categoryId && (
              <>
                <Breadcrumb className={styles["bread-crumb"]}>
                  <Breadcrumb.Item className={styles["bread-crumb__item"]}>
                    <Link to="/">Trang chủ</Link>
                  </Breadcrumb.Item>
                  <Breadcrumb.Item className={styles["bread-crumb__item"]}>
                    <Link
                      to={`/tour-categories/${tour.categoryId?.slug || ""}`}
                    >
                      {tour.categoryId?.name || "Danh mục"}
                    </Link>
                  </Breadcrumb.Item>
                  <Breadcrumb.Item className={styles["bread-crumb__item"]}>
                    {tour.name}
                  </Breadcrumb.Item>
                </Breadcrumb>
                <div className={`row ${styles["tour-detail"]}`}>
                  <div
                    className={`col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12 ${styles["tour__image"]}`}
                  >
                    <Swiper
                      spaceBetween={10}
                      thumbs={{ swiper: thumbsSwiper }}
                      modules={[Autoplay, Thumbs]}
                      className="tour-detail__main-swiper"
                    >
                      {tour.images.map((img, index) => (
                        <SwiperSlide key={index}>
                          <img
                            src={img}
                            alt={`Ảnh ${index + 1}`}
                            className="tour-detail__main-image"
                          />
                        </SwiperSlide>
                      ))}
                    </Swiper>

                    {/* Swiper ảnh nhỏ */}
                    <Swiper
                      onSwiper={setThumbsSwiper}
                      spaceBetween={10}
                      slidesPerView={4}
                      modules={[Thumbs]}
                      className="tour-detail__thumb-swiper"
                    >
                      {tour.images.map((img, index) => (
                        <SwiperSlide key={index}>
                          <img
                            src={img}
                            alt={`Thumbnail ${index + 1}`}
                            className="tour-detail__thumb"
                          />
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>
                  <div
                    className={`col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12 ${styles["tour__content"]}`}
                  >
                    <div className="row">
                      <div className={`col-12 mb-3 ${styles["tour__name"]}`}>
                        {tour.name}
                      </div>
                      <div className={`col-12 mb-1 ${styles["tour__price"]}`}>
                        <div className={`${styles["tour__new-price"]}`}>
                          {tour.newPrice.toLocaleString()} VNĐ
                        </div>
                        <div className={`${styles["tour__old-price"]}`}>
                          {tour.totalPrice.toLocaleString()} VNĐ
                        </div>
                        <Tag
                          color="blue"
                          style={{ fontSize: "0.9rem" }}
                          className={`${styles["tour__discount-percentage"]}`}
                        >
                          -{tour.discountPercentage}%
                        </Tag>
                      </div>
                      <div
                        className={`col-12 mb-1 ${styles["tour__new-price"]}`}
                      ></div>
                      <div
                        className={`col-12 mb-1 ${styles["tour__duration"]}`}
                      >
                        <span>Thời gian: </span>
                        {tour.duration}
                      </div>
                      <div
                        className={`col-12 mb-1 ${styles["tour__departure-date"]}`}
                      >
                        <span>Ngày xuất phát: </span>
                        {/* {tour.departureDate} */}
                        {moment(tour.departureDate).format("DD/MM/YYYY")}
                      </div>
                      <div
                        className={`col-12 mb-1 ${styles["tour__return-date"]}`}
                      >
                        <span>Ngày trở về: </span>
                        {/* {tour.returnDate} */}
                        {moment(tour.returnDate).format("DD/MM/YYYY")}
                      </div>
                      <div
                        className={`col-12 mb-1 ${styles["tour__services"]}`}
                      >
                        {tour.services.length > 0 && (
                          <>
                            <span>Dịch vụ kèm theo: </span>
                            {tour.services.map((item) => (
                              <Tag
                                color="blue"
                                key={item._id}
                                className={`${styles["tour__services__item"]}`}
                              >
                                {item.name}
                              </Tag>
                            ))}
                          </>
                        )}
                      </div>
                      <div
                        className={`col-12 my-3 ${styles["tour__quantity"]}`}
                      >
                        <span style={{ marginRight: "5px" }}>
                          Số lượng người:{" "}
                        </span>
                        <button
                          style={{
                            border: "1px solid #ddd",
                            padding: "1px 8px",
                            borderRadius: "0px",
                          }}
                          onClick={handleSubtract}
                          className="button"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          min={0}
                          style={{
                            maxWidth: "40px",
                            border: "1px solid #ddd",
                            textAlign: "center",
                            borderRight: "none",
                            borderLeft: "none",
                          }}
                          value={quantity}
                        />
                        <button
                          style={{
                            border: "1px solid #ddd",
                            padding: "1px 8px",
                            borderRadius: "0px",
                          }}
                          onClick={handleAdd}
                          className="button"
                        >
                          +
                        </button>
                      </div>
                      <div className={`col-12 mt-4`}>
                        <div className="row">
                          <div
                            className={`col-xl-6 col-lg-6 col-12 mb-2 ${styles["tour__button--wrap"]}`}
                          >
                            <button
                              onClick={handleAddToCart}
                              className="w-100 button button__primary"
                            >
                              <IoCartOutline
                                style={{ fontSize: "24px", marginRight: "5px" }}
                              />
                              <span>Thêm vào giỏ hàng</span>
                            </button>
                          </div>
                          <div
                            className={`col-xl-6 col-lg-6 col-12 mb-2 ${styles["tour__button--wrap"]}`}
                          >
                            <button className="w-100 button button__danger">
                              <IoIosWallet
                                style={{ fontSize: "24px", marginRight: "5px" }}
                              />
                              <span>Mua ngay</span>
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className={`col-12 mt-2 mb-4`}>
                        <button
                          className="button button__green w-100"
                          // onClick={() => setIsChatOpen(true)}
                          onClick={handleChatButton}
                        >
                          <IoChatbubbleEllipsesSharp
                            style={{ fontSize: "24px", marginRight: "5px" }}
                          />
                          <span>Chat với chúng tôi!</span>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className={`col-12 ${styles["tour__description"]}`}>
                    <span>Mô tả: </span>
                    {tour.description}
                  </div>
                </div>
              </>
            )}
          </div>
        </Spin>
        <div className={`${styles["tour-reference"]}`}>
          <div className="box-head__title">Có thể bạn quan tâm</div>
          <div className={`row ${customStyles["tour__list"]} mb-4`}>
            <Swiper
              spaceBetween={20} // Khoảng cách giữa các item
              slidesPerView={1} // Mặc định hiển thị 1 item trên mobile
              navigation // Thêm nút next/prev
              pagination={{ clickable: true }} // Thêm dấu chấm bên dưới
              breakpoints={{
                640: { slidesPerView: 2 }, // 2 item khi màn hình >= 640px
                1024: { slidesPerView: 3 }, // 3 item khi màn hình >= 1024px
                1200: { slidesPerView: 4 }, // 4 item khi màn hình >= 1200px
              }}
              modules={[Navigation, Pagination]}
              className={customStyles["tour__swiper"]}
            >
              {referenceTours.map((item) => (
                <SwiperSlide key={item._id}>
                  <div className={`${customStyles["tour__item"]}`}>
                    <div className={customStyles["tour__image"]}>
                      <img src={item.images[0]} alt={item.name} />
                      <div className={customStyles["tour__discountPercentage"]}>
                        -{item.discountPercentage}%
                      </div>
                      <div className={customStyles["tour__overlay"]}>
                        <Link to={`/tours/detail/${item.slug}`}>
                          <button
                            className={`button button__primary ${customStyles["tour__button"]}`}
                          >
                            Xem chi tiết
                          </button>
                        </Link>
                        <button
                          className={`button ${customStyles["tour__button"]}`}
                        >
                          Thêm vào giỏ hàng
                        </button>
                      </div>
                    </div>

                    <div className={customStyles["tour__content"]}>
                      <div className={customStyles["tour__title"]}>
                        {item.name}
                      </div>
                      <div className={customStyles["tour__old-price"]}>
                        Giá niêm yết: {item.totalPrice.toLocaleString()} VNĐ
                      </div>
                      <div className={customStyles["tour__new-price"]}>
                        Giá ưu đãi: {item.newPrice.toLocaleString()} VNĐ
                      </div>
                      <div className={customStyles["tour__duration"]}>
                        Thời gian: {item.duration}
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </>
  );
}

export default TourDetailClient;
