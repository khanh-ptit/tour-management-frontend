import { Spin, Table, Tag } from "antd";
import ButtonViewTour from "../ButtonViewTour";
import ButtonDeleteAccount from "../ButtonDeleteAccount";
import ButtonEditAccount from "../ButtonEditAccount";

function TableUser(props) {
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
        } else {
          return <Tag color="yellow">Chưa kích hoạt</Tag>;
        }
      },
    },
    {
      title: "Hành động",
      align: "center",
      render: (_, record) => (
        <div className="button__wrap">
          <ButtonViewTour record={record} />
          <ButtonEditAccount onReload={onReload} record={record} />
          <ButtonDeleteAccount onReload={onReload} record={record} />
        </div>
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
