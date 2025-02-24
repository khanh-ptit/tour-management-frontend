import { Badge, Card, Col, Row, Tag } from "antd";
import "./GridRoom.scss";
import ButtonViewRoom from "../ButtonViewRoom";
import ButtonEditRoom from "../ButtonEditRoom";
import ButtonDeleteRoom from "../ButtonDeleteRoom";

const STATUS_CONFIG = {
  available: { text: "Còn phòng", color: "green" },
  booked: { text: "Hết phòng", color: "red" },
  maintenance: { text: "Đang bảo trì", color: "orange" },
};

function GridRoom(props) {
  const { loading, onPaginate, onReload, pagination, rooms } = props;

  return (
    <>
      {rooms.length > 0 && (
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
                      <div>
                        <strong>Tiện ích:</strong>{" "}
                      </div>
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
      )}
    </>
  );
}

export default GridRoom;
