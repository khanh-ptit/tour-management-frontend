import { Spin, Table } from "antd";
import ButtonViewDestination from "../ButtonViewDestination";
import ButtonDeleteDestination from "../ButtonDeleteDestination";
import ButtonEditDestination from "../ButtonEditDestination";
import moment from "moment";
import { useSelector } from "react-redux";

function TableDestination(props) {
  const { loading, pagination, handlePagination, onReload, destinations } =
    props;
  const { permissions } = useSelector((state) => state.roleReducer);

  const column = [
    { title: "STT", key: "index", render: (_, __, index) => index + 1 },
    { title: "Tên điểm đến", key: "name", dataIndex: "name" },
    {
      title: "Ảnh",
      dataIndex: "thumbnail",
      key: "thumbnail",
      render: (thumbnail) =>
        thumbnail ? (
          <div className="table__image">
            <img src={thumbnail} alt="Destination" className="table__image" />
          </div>
        ) : (
          "N/A"
        ),
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Hành động",
      align: "center",
      render: (_, record) => (
        <div className="button__wrap">
          <ButtonViewDestination record={record} />
          {permissions.includes("destinations_edit") && (
            <ButtonEditDestination
              destinations={destinations}
              record={record}
              onReload={onReload}
            />
          )}
          {permissions.includes("destinations_delete") && (
            <ButtonDeleteDestination record={record} onReload={onReload} />
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
          columns={column}
          dataSource={destinations}
          scroll={{ x: "max-content" }}
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

export default TableDestination;
