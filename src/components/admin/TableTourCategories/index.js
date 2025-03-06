import { Spin, Table } from "antd";
import ButtonViewTourCategories from "../ButtonViewTourCategory";
import ButtonDeleteTourCategory from "../ButtonDeleteTourCategory";
import ButtonEditTourCategory from "../ButtonEditTourCategories";

function TableTourCategories(props) {
  const { loading, pagination, handlePagination, onReload, tourCategories } =
    props;

  const column = [
    { title: "STT", key: "index", render: (_, __, index) => index + 1 },
    { title: "Tên danh mục", key: "name", dataIndex: "name" },
    {
      title: "Danh mục cha",
      key: "categoryParentId",
      dataIndex: "categoryParentId",
      render: (categoryParentId) => {
        const parentCategory = tourCategories.find(
          (cat) => cat._id === categoryParentId
        );
        return parentCategory ? parentCategory.name : "--------";
      },
    },

    {
      title: "Ảnh",
      dataIndex: "thumbnail",
      key: "thumbnail",
      render: (thumbnail) =>
        thumbnail ? (
          <div className="table__image">
            <img
              src={thumbnail}
              alt="TourCategories"
              className="table__image"
            />
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
          <ButtonViewTourCategories record={record} />
          <ButtonEditTourCategory
            tourCategories={tourCategories}
            record={record}
            onReload={onReload}
          />
          <ButtonDeleteTourCategory record={record} onReload={onReload} />
        </div>
      ),
    },
  ];

  return (
    <>
      <Spin spinning={loading} tip="Đang tải dữ liệu...">
        <Table
          columns={column}
          dataSource={tourCategories}
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

export default TableTourCategories;
