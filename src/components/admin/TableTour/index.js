import { Spin, Table, Tag } from "antd";
import ButtonDeleteTour from "../ButtonDeleteTour";
import ButtonViewTour from "../ButtonViewTour";
import ButtonEditTour from "../ButtonEditTour";

function TableTour(props) {
  const { tours, onReload, loading, pagination, handlePagination } = props;
  // console.log(tours);
  const columns = [
    { title: "STT", key: "index", render: (_, __, index) => index + 1 },
    { title: "Tên tour", dataIndex: "name", key: "name" },
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
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (price) => price.toLocaleString() + " VNĐ",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) =>
        status === "active" ? (
          <Tag color="green">Hoạt động</Tag>
        ) : (
          <Tag color="red">Dừng hoạt động</Tag>
        ),
    },
    {
      title: "Dịch vụ",
      key: "services",
      dataIndex: "services",
      render: (services) =>
        services && services.length ? (
          <div className="table__amenities">
            {services.map((service, index) => (
              <Tag color="blue" key={index}>
                {service.name}
              </Tag>
            ))}
          </div>
        ) : (
          "Không có"
        ),
    },
    {
      title: "Hành động",
      align: "center",
      render: (_, record) => (
        <div className="button__wrap">
          <ButtonViewTour record={record} />
          <ButtonEditTour onReload={onReload} record={record} />
          <ButtonDeleteTour onReload={onReload} record={record} />
        </div>
      ),
    },
  ];

  return (
    <>
      <Spin spinning={loading} tip="Đang tải dữ liệu...">
        <Table
          dataSource={tours}
          scroll={{ x: "max-content" }}
          columns={columns}
          rowKey="_id"
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            onChange: handlePagination,
          }}
        ></Table>
      </Spin>
    </>
  );
}

export default TableTour;
