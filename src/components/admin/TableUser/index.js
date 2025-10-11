import { Spin, Table, Tag } from "antd";
import moment from "moment";
import ButtonDeleteUser from "../ButtonDeleteUser";
import ButtonEditUser from "../ButtonEditUser";
import ButtonViewUser from "../ButtonViewUser";
import { useSelector } from "react-redux";

function TableUser(props) {
  const { permissions } = useSelector((state) => state.roleReducer);

  const { users, onReload, loading, pagination, handlePagination } = props;

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
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        if (status === "active") {
          return <Tag color="green">Hoạt động</Tag>;
        } else if (status === "inactive") {
          return <Tag color="red">Dừng hoạt động</Tag>;
        } else if (status === "initial") {
          return <Tag color="yellow">Chưa kích hoạt</Tag>;
        } else {
          return <Tag color="orange">Quên mật khẩu</Tag>;
        }
      },
    },
    {
      title: "Hành động",
      align: "center",
      render: (_, record) => (
        <div className="button__wrap">
          <ButtonViewUser record={record} />
          {permissions.includes("users_edit") && (
            <ButtonEditUser onReload={onReload} record={record} />
          )}
          {permissions.includes("users_delete") && (
            <ButtonDeleteUser onReload={onReload} record={record} />
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
          dataSource={users}
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

export default TableUser;
