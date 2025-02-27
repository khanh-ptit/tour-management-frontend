import { Button, Col, Input, Row, Select, Switch } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import "./HeadControlTour.scss";

function HeadControlTour({
  setSearchText,
  setSortOrder,
  setFilterStatus,
  setIsGrid,
}) {
  return (
    <div className="mb-50 mt-20">
      <Row gutter={[20, 20]} align="middle">
        <Col span={24}>
          <div className="control-header">
            <Switch
              onChange={setIsGrid}
              className="control-header__item"
              checkedChildren="Lưới"
              unCheckedChildren="Bảng"
            />
            <Link className="control-header__item" to="/admin/tours/create">
              <Button
                color="primary"
                variant="outlined"
                icon={<PlusOutlined />}
                className="add-room-btn"
              >
                Thêm tour
              </Button>
            </Link>
          </div>
        </Col>
        <Col xs={24} sm={12} md={6} lg={6} xl={6} xxl={6}>
          <Input.Search
            placeholder="Tìm kiếm theo tên tour"
            allowClear
            onSearch={setSearchText}
            style={{ width: "100%" }}
          />
        </Col>
        <Col xs={12} sm={6} md={6} lg={6} xl={6} xxl={6}>
          <Select
            placeholder="Sắp xếp theo giá"
            allowClear
            onChange={setSortOrder}
            style={{ width: "100%" }}
          >
            <Select.Option value="price-asc">Giá tăng dần</Select.Option>
            <Select.Option value="price-desc">Giá giảm dần</Select.Option>
          </Select>
        </Col>
        <Col xs={12} sm={6} md={6} lg={6} xl={6} xxl={6}>
          <Select
            placeholder="Lọc trạng thái"
            allowClear
            onChange={setFilterStatus}
            style={{ width: "100%" }}
          >
            <Select.Option value="active">Hoạt động</Select.Option>
            <Select.Option value="inactive">Dừng hoạt động</Select.Option>
          </Select>
        </Col>
      </Row>
    </div>
  );
}

export default HeadControlTour;
