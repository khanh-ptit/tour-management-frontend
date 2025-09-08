import { Spin, Table } from "antd";
import ButtonViewRole from "../ButtonViewRole";
import ButtonDeleteRole from "../ButtonDeleteRole";
import ButtonEditRole from "../ButtonEditRole";

function TableRole(props) {
  const { roles, onReload, loading, pagination, handlePagination } = props;

  const columns = [
    { title: "STT", key: "index", render: (_, __, index) => index + 1 },
    { title: "Tiêu đề", dataIndex: "title", key: "title" },
    { title: "Mô tả", dataIndex: "description", key: "title" },
    {
      title: "Hành động",
      align: "center",
      render: (_, record) => (
        <div className="button__wrap">
          <ButtonViewRole record={record} />
          <ButtonEditRole onReload={onReload} record={record} />
          <ButtonDeleteRole onReload={onReload} record={record} />
        </div>
      ),
    },
  ];

  return (
    <>
      <Spin spinning={loading} tip="Đang tải dữ liệu...">
        <Table
          dataSource={roles}
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

export default TableRole;
