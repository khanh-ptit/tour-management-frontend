import { Button, Col, Input, Row, Select, Switch } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import "./HeadControlAccount.scss";
import { useSelector } from "react-redux";

function HeadControlAccount({ setSearchText, setSortOrder, setFilterStatus }) {
  const { permissions } = useSelector((state) => state.roleReducer);

  return (
    <div className="mb-50 mt-20">
      <Row gutter={[20, 20]} align="middle">
        <Col span={24}>
          <div className="control-header"></div>
        </Col>
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
            <Select.Option value="inactive">Dừng hoạt động</Select.Option>
          </Select>
        </Col>
        {permissions.includes("accounts_create") && (
          <Col
            xs={12}
            sm={6}
            md={6}
            lg={6}
            xl={6}
            xxl={6}
            style={{ display: "flex", justifyContent: "center" }}
          >
            <Link className="control-header__item" to="/admin/accounts/create">
              <Button
                color="primary"
                variant="outlined"
                icon={<PlusOutlined />}
                className="add-room-btn"
              >
                Thêm tài khoản
              </Button>
            </Link>
          </Col>
        )}
      </Row>
    </div>
  );
}

export default HeadControlAccount;
