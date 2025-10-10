import { Spin, Table, Tag } from "antd";
import ButtonDeleteTour from "../ButtonDeleteTour";
import ButtonViewTour from "../ButtonViewTour";
import ButtonEditTour from "../ButtonEditTour";
import "./TableTour.scss";
import moment from "moment";
import { useSelector } from "react-redux";

function TableTour(props) {
  const { permissions } = useSelector((state) => state.roleReducer);

  const { tours, onReload, loading, pagination, handlePagination } = props;
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
      title: "Danh mục",
      key: "categoryId",
      dataIndex: "categoryId",
      render: (record) => {
        return record.name;
      },
    },
    {
      title: "Giá (VNĐ)",
      key: "price",
      render: (_, record) => (
        <>
          <p className="table-tour__old-price">
            {record.totalPrice.toLocaleString()} VNĐ
          </p>
          <p className="table-tour__new-price">
            {record.newPrice.toLocaleString()} VNĐ
          </p>
        </>
      ),
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
    // {
    //   title: "Dịch vụ",
    //   key: "services",
    //   dataIndex: "services",
    //   render: (services) =>
    //     services && services.length ? (
    //       <div className="table__amenities">
    //         {services.map((service, index) => (
    //           <Tag color="blue" key={index}>
    //             {service.name}
    //           </Tag>
    //         ))}
    //       </div>
    //     ) : (
    //       "Không có"
    //     ),
    // },
    {
      title: "Hành động",
      align: "center",
      render: (_, record) => (
        <div className="button__wrap">
          <ButtonViewTour record={record} />
          {permissions.includes("tours_edit") && (
            <ButtonEditTour onReload={onReload} record={record} />
          )}
          {permissions.includes("tours_delete") && (
            <ButtonDeleteTour onReload={onReload} record={record} />
          )}
        </div>
      ),
    },
    {
      title: "Thời gian tạo",
      align: "center",
      render: (_, record) => {
        if (record.createdBy)
          return (
            <>
              <p>{record.createdBy.accountId.fullName}</p>
              <p>{moment(record.createdBy.createdAt).format("DD/MM/YYYY")}</p>
            </>
          );
        else return <>N/A</>;
      },
    },
    {
      title: "Cập nhật lần cuối",
      align: "center",
      render: (_, record) => {
        if (record.updatedBy && record.updatedBy.length > 0) {
          const lastUpdate = record.updatedBy[record.updatedBy.length - 1];
          return (
            <>
              <p>{lastUpdate.accountId.fullName}</p>
              <p>{moment(lastUpdate.updatedAt).format("DD/MM/YYYY")}</p>
            </>
          );
        }
        return <p>N/A</p>;
      },
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
