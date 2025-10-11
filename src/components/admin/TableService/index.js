import { Spin, Table } from "antd";
import ButtonViewRole from "../ButtonViewRole";
import ButtonDeleteService from "../ButtonDeleteService";
import ButtonEditService from "../ButtonEditService";
import moment from "moment";
import { useSelector } from "react-redux";

function TableService(props) {
  const { permissions } = useSelector((state) => state.roleReducer);

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
          {permissions.includes("services_edit") && (
            <ButtonEditService onReload={onReload} record={record} />
          )}
          {permissions.includes("services_delete") && (
            <ButtonDeleteService onReload={onReload} record={record} />
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
