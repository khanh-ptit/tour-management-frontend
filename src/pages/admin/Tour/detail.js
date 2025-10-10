import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button, Col, Row, Spin, Tag } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs } from "swiper/modules";
import moment from "moment";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "./TourDetail.scss";
import { getTourDetail } from "../../../services/admin/tour.service";
import { useSelector } from "react-redux";

function TourDetail() {
  const { slug } = useParams();
  const [tour, setTour] = useState(null);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const { permissions } = useSelector((state) => state.roleReducer);
  const navigate = useNavigate();

  useEffect(() => {
    if (!permissions.includes("tours_view")) {
      navigate("/admin/error/403");
    }

    if (tour) {
      document.title = `Chi tiết tour | ${tour.name}`;
    }
  }, [tour]);

  useEffect(() => {
    async function fetchTour() {
      // setSpinning(true);
      try {
        // const result = await get(slug);
        const result = await getTourDetail(slug);
        setTour(result);
        // setSpinning(false);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu phòng:", error);
      }
    }
    fetchTour();
  }, [slug]);

  return (
    <Spin spinning={!tour} tip="Đang tải dữ liệu...">
      <div className="container tour-detail" style={{ minHeight: "500px" }}>
        {tour && (
          <Row gutter={[20, 20]}>
            {/* Hình ảnh phòng */}
            <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
              <div className="tour-detail__images">
                {/* Swiper ảnh lớn */}
                <Swiper
                  spaceBetween={10}
                  navigation
                  thumbs={{ swiper: thumbsSwiper }}
                  modules={[Navigation, Thumbs]}
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
            </Col>

            {/* Thông tin phòng */}
            <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
              <div className="tour-detail__info">
                <h2 className="tour-detail__title">{tour.name}</h2>
                <p className="tour-detail__price">
                  Giá niêm yết:{" "}
                  <strong>{tour.totalPrice.toLocaleString()} VNĐ</strong>
                </p>
                <p className="tour-detail__new-price">
                  Giá ưu đãi:{" "}
                  <strong>{tour.newPrice.toLocaleString()} VNĐ</strong>
                </p>

                <p className="tour-detail__category">
                  <strong>Danh mục:</strong> {tour.categoryId.name}
                </p>
                <p className="tour-detail__departure">
                  <b>Ngày xuất phát:</b>{" "}
                  {moment(tour.departureDate).format("DD/MM/YYYY")}
                </p>
                <p className="tour-detail__return">
                  <b>Ngày trở về:</b>{" "}
                  {moment(tour.returnDate).format("DD/MM/YYYY")}
                </p>
                <p className="tour-detail__duration">
                  <b>Thời gian:</b> {tour.duration}
                </p>
                <p className="tour-detail__status">
                  <b>Trạng thái: </b>
                  {tour.status === "active" ? (
                    <Tag color="green">Hoạt động</Tag>
                  ) : (
                    <Tag color="red">Dừng hoạt động</Tag>
                  )}
                </p>

                <div className="tour-detail__services">
                  <div>Tiện ích:</div>
                  {tour.services.map((item, index) => (
                    <Tag key={index} color="blue">
                      {item.name}
                    </Tag>
                  ))}
                </div>

                <Button
                  color="primary"
                  variant="solid"
                  className="mt-20"
                  icon={<EditOutlined />}
                >
                  Chỉnh sửa
                </Button>
              </div>
            </Col>

            <Col span={24}>
              <p className="tour-detail__desc">
                <b>Mô tả:</b> {tour.description}
              </p>
            </Col>
          </Row>
        )}
      </div>
    </Spin>
  );
}

export default TourDetail;
