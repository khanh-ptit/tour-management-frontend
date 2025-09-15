import { Col, Input, Row, Select } from "antd";
import "./HeadControlUser.scss";

function HeadControlUser({ setSearchText, setSortOrder, setFilterStatus }) {
  return (
    <div className="mb-50 mt-20">
      <Row gutter={[20, 20]} align="middle">
        <Col xs={24} sm={12} md={6} lg={6} xl={6} xxl={6}>
          <Input.Search
            placeholder="Tìm kiếm theo tên tài khoản"
            allowClear
            onSearch={setSearchText}
            style={{ width: "100%" }}
          />
        </Col>
        <Col xs={12} sm={6} md={6} lg={6} xl={6} xxl={6}>
          <Select
            placeholder="Sắp xếp theo"
            allowClear
            onChange={setSortOrder}
            style={{ width: "100%" }}
          >
            <Select.Option value="createdAt-asc">Tạo sớm nhất</Select.Option>
            <Select.Option value="createdAt-desc">Tạo gần nhất</Select.Option>
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
            <Select.Option value="initial">Chưa kích hoạt</Select.Option>
            <Select.Option value="inactive">Dừng hoạt động</Select.Option>
            <Select.Option value="forgot">Quên mật khẩu</Select.Option>
          </Select>
        </Col>
      </Row>
    </div>
  );
}

export default HeadControlUser;
