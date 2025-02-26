import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getRoomDetail } from "../../../services/admin/room.service";
import { Button, Col, Row, Spin, Tag } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "./RoomDetail.scss";

const STATUS_CONFIG = {
  available: { text: "Còn phòng", color: "green" },
  booked: { text: "Hết phòng", color: "red" },
  maintenance: { text: "Đang bảo trì", color: "orange" },
};

function RoomDetail() {
  const { slug } = useParams();
  const [room, setRoom] = useState(null);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [spinning, setSpinning] = useState(true);

  useEffect(() => {
    if (room) {
      document.title = `Chi tiết phòng | ${room.name}`;
    }
  }, [room]);

  useEffect(() => {
    async function fetchRoom() {
      setSpinning(true);
      try {
        const result = await getRoomDetail(slug);
        setRoom(result);
        setSpinning(false);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu phòng:", error);
      }
    }
    fetchRoom();
  }, [slug]);

  return (
    <Spin spinning={!room} tip="Đang tải dữ liệu...">
      <div className="container room-detail" style={{ minHeight: "500px" }}>
        {room && (
          <Row gutter={[20, 20]}>
            {/* Hình ảnh phòng */}
            <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
              <div className="room-detail__images">
                {/* Swiper ảnh lớn */}
                <Swiper
                  spaceBetween={10}
                  navigation
                  thumbs={{ swiper: thumbsSwiper }}
                  modules={[Navigation, Thumbs]}
                  className="room-detail__main-swiper"
                >
                  {room.images.map((img, index) => (
                    <SwiperSlide key={index}>
                      <img
                        src={img}
                        alt={`Ảnh ${index + 1}`}
                        className="room-detail__main-image"
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
                  className="room-detail__thumb-swiper"
                >
                  {room.images.map((img, index) => (
                    <SwiperSlide key={index}>
                      <img
                        src={img}
                        alt={`Thumbnail ${index + 1}`}
                        className="room-detail__thumb"
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </Col>

            {/* Thông tin phòng */}
            <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
              <div className="room-detail__info">
                <h2 className="room-detail__title">{room.name}</h2>
                <p className="room-detail__price">
                  Giá: <strong>{room.price.toLocaleString()} VNĐ</strong>
                </p>
                <p className="room-detail__capacity">
                  <b>Sức chứa:</b> {room.capacity} người
                </p>
                <p className="room-detail__status">
                  <b>Trạng thái:</b>{" "}
                  <Tag color={STATUS_CONFIG[room.status]?.color || "default"}>
                    {STATUS_CONFIG[room.status]?.text || "Không xác định"}
                  </Tag>
                </p>

                <div className="room-detail__amenities">
                  <div>Tiện ích:</div>
                  {room.amenities.map((item, index) => (
                    <Tag key={index} color="blue">
                      {item}
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
              <p className="room-detail__desc">
                <b>Mô tả:</b> {room.description}
              </p>
            </Col>
          </Row>
        )}
      </div>
    </Spin>
  );
}

export default RoomDetail;
