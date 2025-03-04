import { Button, Col, Row, Switch } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import "./HeadControlTour.scss";

function HeadControlTourCategory({
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
            <Link
              className="control-header__item"
              to="/admin/tour-categories/create"
            >
              <Button
                color="primary"
                variant="outlined"
                icon={<PlusOutlined />}
                className="add-room-btn"
              >
                Thêm danh mục tour
              </Button>
            </Link>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default HeadControlTourCategory;
