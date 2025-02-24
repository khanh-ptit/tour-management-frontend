import { Table, Tag, Spin } from "antd";
import ButtonDeleteRoom from "../ButtonDeleteRoom";
import ButtonEditRoom from "../ButtonEditRoom";
import ButtonViewRoom from "../ButtonViewRoom";
import "./TableRoom.scss";

function TableRoom({ rooms, loading, pagination, handlePagination, onReload }) {
  const columns = [
    { title: "STT", key: "index", render: (_, __, index) => index + 1 },
    { title: "Tên phòng", dataIndex: "name", key: "name" },
    {
      title: "Ảnh",
      dataIndex: "images",
      key: "images",
      render: (images) =>
        images?.length ? (
          <div className="table__image">
            <img src={images[0]} alt="Room" className="table__image" />
          </div>
        ) : (
          "N/A"
        ),
    },
    {
      title: "Giá (VNĐ)",
      dataIndex: "price",
      key: "price",
      render: (price) => price.toLocaleString() + " VNĐ",
    },
    { title: "Sức chứa", dataIndex: "capacity", key: "capacity" },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        if (status === "available") {
          return <Tag color="green">Còn phòng</Tag>;
        }
        if (status === "booked") {
          return <Tag color="red">Hết phòng</Tag>;
        }
        return <Tag color="orange">Đang bảo trì</Tag>;
      },
    },
    {
      title: "Tiện ích",
      dataIndex: "amenities",
      key: "amenities",
      render: (amenities) => {
        return (
          <div className="table__amenities">
            {amenities.map((item, index) => (
              <Tag color="blue" key={index}>
                {item}
              </Tag>
            ))}
          </div>
        );
      },
    },
    {
      title: "Hành động",
      align: "center",
      render: (_, record) => (
        <div className="button__wrap">
          <ButtonViewRoom record={record} />
          <ButtonEditRoom onReload={onReload} record={record} />
          <ButtonDeleteRoom onReload={onReload} record={record} />
        </div>
      ),
    },
  ];

  return (
    <Spin spinning={loading} tip="Đang tải dữ liệu...">
      <Table
        dataSource={rooms}
        columns={columns}
        rowKey="_id"
        scroll={{ x: "max-content" }}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          onChange: handlePagination,
        }}
      />
    </Spin>
  );
}

export default TableRoom;
