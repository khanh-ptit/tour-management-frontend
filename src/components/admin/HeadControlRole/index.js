import { Button, Col, Row, Switch } from "antd";
import { KeyOutlined, PlusOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import "./HeadControlRole.scss";

function HeadControlRole({ setIsGrid }) {
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
            <Link
              className="control-header__item"
              to="/admin/roles/permissions"
            >
              <Button
                color="red"
                variant="outlined"
                icon={<KeyOutlined />}
                className="add-room-btn"
              >
                Phân quyền
              </Button>
            </Link>
            <Link className="control-header__item" to="/admin/roles/create">
              <Button
                color="primary"
                variant="outlined"
                icon={<PlusOutlined />}
                className="add-room-btn"
              >
                Thêm mới nhóm quyền
              </Button>
            </Link>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default HeadControlRole;
