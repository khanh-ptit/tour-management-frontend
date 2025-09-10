import { Button, message, Popconfirm } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { deleteTour } from "../../../services/admin/tour.service";
import { deleteAccount } from "../../../services/admin/account.service";

function ButtonDeleteAccount(props) {
  const { record, onReload } = props;
  const [messageApi, contextHolder] = message.useMessage();

  const handleDelete = async (record) => {
    const response = await deleteAccount(record._id);
    if (response.code === 200) {
      messageApi.open({
        type: "success",
        content: response.message,
        duration: 3, // Hiển thị 3 giây
      });

      // Đợi 3 giây rồi fetch lại API
      setTimeout(() => {
        onReload();
      }, 2000);
    }
  };

  return (
    <>
      {contextHolder}
      <Popconfirm
        title="Xác nhận xóa"
        description="Hành động không thể khôi phục"
        okText="Xóa"
        cancelText="Hủy"
        onConfirm={() => handleDelete(record)}
      >
        <Button danger icon={<DeleteOutlined />} />
      </Popconfirm>
    </>
  );
}

export default ButtonDeleteAccount;
