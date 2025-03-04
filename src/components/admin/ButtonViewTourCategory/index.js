import { Button } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

function ButtonViewTourCategories(props) {
  const { record } = props;
  return (
    <>
      <Link to={`/admin/tour-categories/detail/${record.slug}`}>
        <Button icon={<EyeOutlined />} />
      </Link>
    </>
  );
}

export default ButtonViewTourCategories;
