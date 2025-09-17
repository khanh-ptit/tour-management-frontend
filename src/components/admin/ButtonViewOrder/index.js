import { Button } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

function ButtonViewOrder(props) {
  const { record } = props;
  return (
    <>
      <Link to={`/admin/orders/detail/${record._id}`}>
        <Button icon={<EyeOutlined />} />
      </Link>
    </>
  );
}

export default ButtonViewOrder;
