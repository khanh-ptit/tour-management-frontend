import { Spin, Table } from "antd";
import ButtonViewRole from "../ButtonViewRole";
import ButtonDeleteRole from "../ButtonDeleteRole";
import ButtonEditRole from "../ButtonEditRole";
import moment from "moment";
import { useSelector } from "react-redux";

function TableRole(props) {
  const { permissions } = useSelector((state) => state.roleReducer);

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
          {permissions.includes("roles_edit") && (
            <ButtonEditRole onReload={onReload} record={record} />
          )}
          {permissions.includes("roles_delete") && (
            <ButtonDeleteRole onReload={onReload} record={record} />
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
