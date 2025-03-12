import { Spin, Table } from "antd";
import ButtonViewDestination from "../ButtonViewDestination";
import ButtonDeleteDestination from "../ButtonDeleteDestination";
import ButtonEditDestination from "../ButtonEditDestination";

function TableDestination(props) {
  const { loading, pagination, handlePagination, onReload, destinations } =
    props;

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
          <ButtonEditDestination
            destinations={destinations}
            record={record}
            onReload={onReload}
          />
          <ButtonDeleteDestination record={record} onReload={onReload} />
        </div>
      ),
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
