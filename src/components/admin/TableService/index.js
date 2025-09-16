import { Spin, Table } from "antd";
import ButtonViewRole from "../ButtonViewRole";
import ButtonEditRole from "../ButtonEditRole";
import ButtonDeleteService from "../ButtonDeleteService";
import ButtonEditService from "../ButtonEditService";

function TableService(props) {
  const { services, onReload, loading, pagination, handlePagination } = props;

  const columns = [
    { title: "STT", key: "index", render: (_, __, index) => index + 1 },
    { title: "Tiêu đề", dataIndex: "name", key: "name" },
    { title: "Mô tả", dataIndex: "description", key: "description" },
    {
      title: "Giá (VNĐ)",
      key: "price",
      render: (_, record) => (
        <p className="table-tour__new-price">
          {record.price.toLocaleString()} VNĐ
        </p>
      ),
    },
    {
      title: "Hành động",
      align: "center",
      render: (_, record) => (
        <div className="button__wrap">
          <ButtonViewRole record={record} />
          <ButtonEditService onReload={onReload} record={record} />
          <ButtonDeleteService onReload={onReload} record={record} />
        </div>
      ),
    },
  ];

  return (
    <>
      <Spin spinning={loading} tip="Đang tải dữ liệu...">
        <Table
          dataSource={services}
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

export default TableService;
