import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button, Col, Row, Spin, Tag } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import {
  getTourCategoryDetail,
  getTourCategoryList,
} from "../../../services/admin/tour-category.service";
import { useSelector } from "react-redux";

function TourCategoryDetail() {
  const { slug } = useParams();
  const [tourCategory, setTourCategory] = useState(null);
  const [tourCategoryList, setTourCategoryList] = useState([]);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const { permissions } = useSelector((state) => state.roleReducer);
  const navigate = useNavigate();

  useEffect(() => {
    if (!permissions.includes("tour-categories_view")) {
      navigate("/admin/error/403");
    }
    if (tourCategory) {
      document.title = `Danh mục tour | ${tourCategory.name}`;
    }
  }, [tourCategory]);

  useEffect(() => {
    async function fetchTourCategoryDetail() {
      try {
        const result = await getTourCategoryDetail(slug);
        setTourCategory(result.tourCategory);
      } catch (error) {
        if (error.code === 404) {
          navigate("/admin/error/404");
        }
        console.error("Lỗi khi lấy dữ liệu danh mục:", error);
      }
    }
    fetchTourCategoryDetail();

    const fetchTourCategoryList = async () => {
      try {
        const result = await getTourCategoryList();
        setTourCategoryList(result.tourCategories);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu danh mục", error);
      }
    };
    fetchTourCategoryList();
  }, [slug]);

  return (
    <Spin spinning={!tourCategory} tip="Đang tải dữ liệu...">
      <div className="container tour-detail" style={{ minHeight: "500px" }}>
        {tourCategory && (
          <Row gutter={[20, 20]}>
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
                  {/* {tourCategory.thumbnail.map((img, index) => ( */}
                  <SwiperSlide>
                    <img
                      src={tourCategory.thumbnail}
                      alt={`Ảnh`}
                      className="tour-detail__main-image"
                    />
                  </SwiperSlide>
                  {/* ))} */}
                </Swiper>

                {/* Swiper ảnh nhỏ */}
                <Swiper
                  onSwiper={setThumbsSwiper}
                  spaceBetween={10}
                  slidesPerView={4}
                  modules={[Thumbs]}
                  className="tour-detail__thumb-swiper"
                >
                  {/* {tourCategory.thumbnail.map((img, index) => ( */}
                  <SwiperSlide>
                    <img
                      src={tourCategory.thumbnail}
                      alt={`Thumbnail`}
                      className="tour-detail__thumb"
                    />
                  </SwiperSlide>
                  {/* ))} */}
                </Swiper>
              </div>
            </Col>

            {/* Thông tin phòng */}
            <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
              <div className="tour-detail__info">
                <h2 className="tour-detail__title">{tourCategory.name}</h2>
                <p className="tour-detail__return">
                  <b>Danh mục cha: </b>
                  {tourCategoryList.find(
                    (cat) => cat._id === tourCategory.categoryParentId
                  )?.name || "Không có"}
                </p>

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
                <b>Mô tả:</b> {tourCategory.description}
              </p>
            </Col>
          </Row>
        )}
      </div>
    </Spin>
  );
}

export default TourCategoryDetail;
