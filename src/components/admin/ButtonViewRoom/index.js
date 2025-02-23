import { Button } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

function ButtonViewRoom(props) {
  const { record } = props;
  return (
    <>
      <Link to={`/admin/rooms/detail/${record.slug}`}>
        <Button icon={<EyeOutlined />} />
      </Link>
    </>
  );
}

export default ButtonViewRoom;
