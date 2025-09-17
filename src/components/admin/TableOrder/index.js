import { Spin, Table, Tag } from "antd";
import ButtonEditTour from "../ButtonEditTour";
import "./TableTour.scss";
import moment from "moment";
import ButtonDeleteOrder from "../ButtonDeleteOrder";
import ButtonViewOrder from "../ButtonViewOrder";
import { useEffect } from "react";

function TableOrder(props) {
  const { orders, onReload, loading, pagination, handlePagination } = props;
  const columns = [
    { title: "STT", key: "index", render: (_, __, index) => index + 1 },
    {
      title: "Tên khách hàng",
      key: "name",
      render: (_, record) => <>{record.userInfo.fullName}</>,
    },
    {
      title: "Số điện thoại",
      key: "phone",
      render: (_, record) => <>{record.userInfo.phone}</>,
    },
    {
      title: "Số lượng tour",
      key: "phone",
      render: (_, record) => <>{record.tours.length}</>,
    },
    {
      title: "Giá (VNĐ)",
      key: "price",
      render: (_, record) => (
        <p className="table-tour__new-price">
          {record.totalPrice.toLocaleString()} VNĐ
        </p>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "isPaid",
      key: "isPaid",
      render: (isPaid) =>
        isPaid === true ? (
          <Tag color="green">Đã thanh toán</Tag>
        ) : (
          <Tag color="red">Chưa thanh toán</Tag>
        ),
    },
    {
      title: "Hành động",
      align: "center",
      render: (_, record) => (
        <div className="button__wrap">
          <ButtonViewOrder record={record} />
          <ButtonEditTour onReload={onReload} record={record} />
          <ButtonDeleteOrder onReload={onReload} record={record} />
        </div>
      ),
    },
    {
      title: "Thời gian tạo",
      align: "center",
      render: (_, record) => (
        <p>{moment(record.createdAt).format("hh:mm:ss DD/MM/YYYY")}</p>
      ),
    },
  ];

  useEffect(() => {
    document.title = "Quản lý đơn hàng | Admin";
  });

  return (
    <>
      <Spin spinning={loading} tip="Đang tải dữ liệu...">
        <Table
          dataSource={orders}
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

export default TableOrder;
