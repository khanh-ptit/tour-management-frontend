import { Spin, Table, Tag } from "antd";
import ButtonDeleteAccount from "../ButtonDeleteAccount";
import ButtonEditAccount from "../ButtonEditAccount";
import moment from "moment";
import ButtonViewUser from "../ButtonViewUser";
import { useSelector } from "react-redux";

function TableAccount(props) {
  const { permissions } = useSelector((state) => state.roleReducer);

  const { accounts, onReload, loading, pagination, handlePagination } = props;

  const columns = [
    { title: "STT", key: "index", render: (_, __, index) => index + 1 },
    { title: "Họ và tên", dataIndex: "fullName", key: "fullName" },
    {
      title: "Ảnh",
      dataIndex: "avatar",
      key: "avatar",
      render: (url) =>
        url ? (
          <div className="table__avatar">
            <img src={url} alt="Avatar" className="table__avatar" />
          </div>
        ) : (
          "N/A"
        ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (email) => email,
    },
    {
      title: "Nhóm quyền",
      dataIndex: "roleId",
      key: "roleId",
      render: (record) => record.title,
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
      title: "Hành động",
      align: "center",
      render: (_, record) => (
        <div className="button__wrap">
          <ButtonViewUser record={record} />
          {permissions.includes("accounts_edit") && (
            <ButtonEditAccount onReload={onReload} record={record} />
          )}
          {permissions.includes("accounts_delete") && (
            <ButtonDeleteAccount onReload={onReload} record={record} />
          )}
        </div>
      ),
    },
    {
      title: "Thời gian tạo",
      align: "center",
      render: (_, record) => (
        <p>{moment(record.createdAt).format("hh:mm DD/MM/YYYY")}</p>
      ),
    },
  ];

  return (
    <>
      <Spin spinning={loading} tip="Đang tải dữ liệu...">
        <Table
          dataSource={accounts}
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

export default TableAccount;
