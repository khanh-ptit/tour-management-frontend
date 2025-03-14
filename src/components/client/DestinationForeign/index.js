import { useEffect, useState } from "react";
import { getDestination } from "../../../services/client/home.service";
import styles from "./DestinationForeign.module.scss";
import { Spin } from "antd";
import { Link } from "react-router-dom";

function DestinationForeign() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const fetchDestinations = async () => {
      const result = await getDestination("tour-nuoc-ngoai");
      setDestinations(result.destinations);
      setLoading(false);
    };
    fetchDestinations();
  }, []);

  return (
    <Spin spinning={loading} tip="Đang tải dữ liệu...">
      <div className={`row g-3 ${styles["destination__list"]}`}>
        {/* Ô lớn (chiếm 2 hàng, 1 cột) */}
        {destinations.length > 0 && (
          <div className="col-md-4">
            <div
              className={`${styles["destination__item"]} ${styles["large"]}`}
            >
              <div className={styles["destination__image"]}>
                <img
                  className={styles["destination__image-item"]}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  src={destinations[0].thumbnail}
                  alt={destinations[0].name}
                />
                <div className={styles["destination__overlay"]}>
                  <Link to={`destinations/${destinations[0].slug}`}>
                    <button
                      className={`button button__primary ${styles["destination__button"]}`}
                    >
                      Xem chi tiết
                    </button>
                  </Link>
                </div>
              </div>

              <div className={styles["destination__content"]}>
                <div className={styles["destination__name"]}>
                  {destinations[0].name}
                </div>
                <div className={styles["destination__quantity"]}>
                  {destinations[0].quantity} Tour
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4 ô nhỏ (2 hàng, 2 cột) */}
        <div className="col-md-8">
          <div className="row g-3">
            {destinations.length > 1 &&
              destinations.slice(1, 5).map((item) => (
                <div key={item._id} className="col-md-6">
                  <div className={styles["destination__item"]}>
                    <div className={styles["destination__image"]}>
                      <img
                        className={styles["destination__image-item"]}
                        src={item.thumbnail}
                        alt={item.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                      <div className={styles["destination__overlay"]}>
                        <Link to={`destinations/${item.slug}`}>
                          <button
                            className={`button button__primary ${styles["destination__button"]}`}
                          >
                            Xem chi tiết
                          </button>
                        </Link>
                      </div>
                    </div>
                    <div className={styles["destination__content"]}>
                      <div className={styles["destination__name"]}>
                        {item.name}
                      </div>
                      <div className={styles["destination__quantity"]}>
                        {item.quantity} Tour
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </Spin>
  );
}

export default DestinationForeign;
