import { useEffect, useState } from "react";
import { getRoomList } from "../../../services/admin/room.service";
import { Table, Tag, Button, Input, Select, Spin, Row, Col } from "antd";
import "./TableRoom.scss";
import ButtonDeleteRoom from "../ButtonDeleteRoom";
import ButtonEditRoom from "../ButtonEditRoom";
import ButtonViewRoom from "../ButtonViewRoom";
import { PlusOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

function TableRoom() {
  const [rooms, setRooms] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [sortOrder, setSortOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 4,
    total: 0,
  });
  const [reload, setReload] = useState(false);

  const onReload = () => {
    setReload(!reload);
  };

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.current,
        limit: pagination.pageSize,
      };
      if (searchText) params.name = searchText;
      if (sortOrder) {
        const [sortKey, sortValue] = sortOrder.split("-");
        params.sortKey = sortKey;
        params.sortValue = sortValue;
      }
      if (filterStatus) params.status = filterStatus;

      const result = await getRoomList(params);
      if (result) {
        setRooms(result.rooms);
        setPagination((prev) => ({ ...prev, total: result.total }));
      }
    } catch (error) {
      console.error("Lỗi khi fetch dữ liệu:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRooms();
  }, [searchText, sortOrder, filterStatus, pagination.current, reload]); // Gọi API khi filter hoặc trang thay đổi

  const handleSearch = (value) => setSearchText(value);
  const handleSortPrice = (value) => setSortOrder(value);
  const handleFilterStatus = (value) => setFilterStatus(value);
  const handlePagination = (page, pageSize) => {
    // console.log(`Trang hiện tại: ${page}, Số bản ghi mỗi trang: ${pageSize}`);
    setPagination({ ...pagination, current: page, pageSize: pageSize });
  };

  const columns = [
    {
      title: "STT",
      key: "index",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Tên phòng",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Ảnh",
      dataIndex: "images",
      key: "images",
      render: (images) => (
        <div className="table__image">
          <img
            src={images?.[0]}
            alt="Room Image"
            className="table__image-img"
          />
        </div>
      ),
    },
    {
      title: "Giá (VNĐ)",
      dataIndex: "price",
      key: "price",
      render: (price) => price.toLocaleString() + " VNĐ",
    },
    {
      title: "Sức chứa",
      dataIndex: "capacity",
      key: "capacity",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        if (status === "available") {
          return <Tag color="green">Còn phòng</Tag>;
        }
        if (status === "booked") {
          return <Tag color="red">Hết phòng</Tag>;
        }
        return <Tag color="orange">Đang bảo trì</Tag>;
      },
    },
    {
      title: "Tiện ích",
      dataIndex: "amenities",
      key: "amenities",
      render: (amenities) => (
        <div className="table__amenities">
          {amenities.map((item, index) => (
            <Tag color="blue" key={index}>
              {item}
            </Tag>
          ))}
        </div>
      ),
    },
    {
      title: "Hành động",
      align: "center",
      render: (_, record) => (
        <div className="button__wrap">
          <Link to={`/admin/rooms/detail/${record.slug}`}>
            <ButtonViewRoom />
          </Link>
          <ButtonEditRoom record={record} />
          <ButtonDeleteRoom onReload={onReload} record={record} />
        </div>
      ),
    },
  ];

  return (
    <div>
      {/* Phần điều khiển */}
      <div className="mb-20">
        <Row gutter={[20, 20]}>
          <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6}>
            <Input.Search
              placeholder="Tìm kiếm theo tên phòng"
              allowClear
              onSearch={handleSearch}
              style={{ width: "100%" }}
            />
          </Col>
          <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6}>
            <Select
              placeholder="Sắp xếp theo giá"
              allowClear
              onChange={handleSortPrice}
              style={{ width: "100%" }}
            >
              <Select.Option value="price-asc">Giá tăng dần</Select.Option>
              <Select.Option value="price-desc">Giá giảm dần</Select.Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6}>
            <Select
              placeholder="Lọc trạng thái"
              allowClear
              onChange={handleFilterStatus}
              style={{ width: "100%" }}
            >
              <Select.Option value="available">Còn phòng</Select.Option>
              <Select.Option value="booked">Hết phòng</Select.Option>
              <Select.Option value="maintenance">Đang bảo trì</Select.Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6}>
            <Link to="/admin/rooms/create">
              <Button
                type="primary"
                icon={<PlusOutlined />}
                className="add-room-btn"
              >
                Thêm phòng
              </Button>
            </Link>
          </Col>
        </Row>
      </div>

      {/* Bảng dữ liệu */}
      <Spin spinning={loading} tip="Đang tải dữ liệu...">
        <Table
          dataSource={rooms}
          columns={columns}
          rowKey="_id"
          scroll={{ x: "max-content" }}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            onChange: handlePagination,
          }}
        />
      </Spin>
    </div>
  );
}

export default TableRoom;
