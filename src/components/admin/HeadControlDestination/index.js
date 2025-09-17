import { Button, Col, Input, Row, Select, Switch } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import "./HeadControlDestination.scss";

function HeadControlDestination({ setIsGrid, setSearchText, setSortOrder }) {
  return (
    <div className="mb-50 mt-20">
      <Row gutter={[20, 20]} align="middle">
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
            placeholder="Sắp xếp theo..."
            allowClear
            onChange={setSortOrder}
            style={{ width: "100%" }}
          >
            <Select.Option value="createdAt-asc">Tạo sớm nhất</Select.Option>
            <Select.Option value="createdAt-desc">Tạo gần nhất</Select.Option>
          </Select>
        </Col>
        <Col xs={12} sm={6} md={6} lg={6} xl={6} xxl={6}></Col>
        <Col
          xs={12}
          sm={6}
          md={6}
          lg={6}
          xl={6}
          xxl={6}
          style={{ display: "flex", justifyContent: "center" }}
        >
          <Link
            className="control-header__item"
            to="/admin/destinations/create"
          >
            <Button
              color="primary"
              variant="outlined"
              icon={<PlusOutlined />}
              className="add-room-btn"
            >
              Thêm điểm du lịch
            </Button>
          </Link>
        </Col>
      </Row>
    </div>
  );
}

export default HeadControlDestination;
