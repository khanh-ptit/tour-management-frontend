import { Button } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

function ButtonViewTour(props) {
  const { record } = props;
  return (
    <>
      <Link to={`/admin/tours/detail/${record.slug}`}>
        <Button icon={<EyeOutlined />} />
      </Link>
    </>
  );
}

export default ButtonViewTour;
