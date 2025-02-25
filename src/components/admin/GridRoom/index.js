import { Badge, Card, Col, Pagination, Row, Spin, Tag } from "antd";
import "./GridRoom.scss";
import ButtonViewRoom from "../ButtonViewRoom";
import ButtonEditRoom from "../ButtonEditRoom";
import ButtonDeleteRoom from "../ButtonDeleteRoom";

const STATUS_CONFIG = {
  available: { text: "Còn phòng", color: "green" },
  booked: { text: "Hết phòng", color: "red" },
  maintenance: { text: "Đang bảo trì", color: "orange" },
};

function GridRoom({ loading, handlePagination, onReload, pagination, rooms }) {
  const handlePaginationChange = (page, pageSize) => {
    handlePagination(page, pageSize);
  };

  return (
    <>
      <Spin spinning={loading} tip="Đang tải dữ liệu...">
        <Row gutter={[20, 20]}>
          {rooms.map((item) => {
            const status = STATUS_CONFIG[item.status] || {
              text: "Không xác định",
              color: "gray",
            };

            return (
              <Col
                key={item._id}
                xxl={8}
                xl={8}
                lg={12}
                md={12}
                sm={24}
                xs={24}
              >
                <Badge.Ribbon text={status.text} color={status.color}>
                  <Card title={item.name}>
                    <p className="card__price">
                      Giá: <strong>{item.price.toLocaleString()} VNĐ</strong>
                    </p>
                    <p className="card__capacity">
                      <strong>Sức chứa:</strong> {item.capacity} người
                    </p>
                    <div className="card__amenities">
                      <strong>Tiện ích:</strong>
                      {item.amenities.map((itemAmen, index) => (
                        <Tag key={index} color="blue">
                          {itemAmen}
                        </Tag>
                      ))}
                    </div>
                    <div className="card__action">
                      <ButtonViewRoom record={item} />
                      <ButtonEditRoom onReload={onReload} record={item} />
                      <ButtonDeleteRoom onReload={onReload} record={item} />
                    </div>
                  </Card>
                </Badge.Ribbon>
              </Col>
            );
          })}
        </Row>

        {/* Pagination */}
        <Pagination
          align="center"
          style={{ marginTop: "20px" }}
          current={pagination.current} // Cập nhật trang hiện tại
          pageSize={pagination.pageSize} // Số phần tử trên mỗi trang
          total={pagination.total} // Tổng số phần tử
          onChange={handlePaginationChange} // Gọi lại API khi đổi trang
        />
      </Spin>
    </>
  );
}

export default GridRoom;
