import { Button } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

function ButtonViewDestination(props) {
  const { record } = props;
  return (
    <>
      <Link to={`/admin/destinations/detail/${record.slug}`}>
        <Button icon={<EyeOutlined />} />
      </Link>
    </>
  );
}

export default ButtonViewDestination;
