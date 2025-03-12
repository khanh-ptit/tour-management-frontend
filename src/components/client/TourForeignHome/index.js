import { useEffect, useState } from "react";
import { getToursByCategory } from "../../../services/client/home.service";
import styles from "./TourForeignHome.module.scss";
import { Link } from "react-router-dom";
import { Spin } from "antd";

function TourForeignHome() {
  const [tours, setTour] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTours = async () => {
    const result = await getToursByCategory("tour-nuoc-ngoai");
    if (result.code === 200) {
      setTour(result.tours);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTours();
  }, []);

  return (
    <>
      <Spin spinning={loading} tip="Đang tải dữ liệu...">
        <div className={`row ${styles["tour__list"]}`}>
          {tours.map((item) => (
            <div
              key={item._id}
              className={`col-xl-3 col-lg-4 col-md-4 col-sm-6 col-12 ${styles["tour__item"]}`}
            >
              <div className={styles["tour__image"]}>
                <img src={item.images[0]} alt={item.name} />
                <div className={styles["tour__overlay"]}>
                  <Link to={`tours/detail/${item.slug}`}>
                    <button
                      className={`button button__primary ${styles["tour__button"]}`}
                    >
                      Xem chi tiết
                    </button>
                  </Link>
                  <button className={`button ${styles["tour__button"]}`}>
                    Thêm vào giỏ hàng
                  </button>
                </div>
              </div>

              <div className={styles["tour__content"]}>
                <div className={styles["tour__title"]}>{item.name}</div>
                <div className={styles["tour__old-price"]}>
                  Giá niêm yết: {item.totalPrice.toLocaleString()} VNĐ
                </div>
                <div className={styles["tour__new-price"]}>
                  Giá ưu đãi: {item.newPrice.toLocaleString()} VNĐ
                </div>
                <div className={styles["tour__duration"]}>
                  Thời gian: {item.duration}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center my-2">
          <Link to="/tour-categories/tour-nuoc-ngoai">
            <button className="button button__primary button__primary--outlined">
              Xem thêm
            </button>
          </Link>
        </div>
      </Spin>
    </>
  );
}

export default TourForeignHome;
