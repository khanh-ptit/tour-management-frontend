import { Button } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

function ButtonViewUser(props) {
  return (
    <>
      <Link to={`#`}>
        <Button icon={<EyeOutlined />} />
      </Link>
    </>
  );
}

export default ButtonViewUser;
