import {
  Button,
  Col,
  Form,
  Input,
  message,
  Modal,
  Row,
  Select,
  Upload,
} from "antd";
import {
  CloseCircleOutlined,
  EditOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { uploadToCloudinary } from "../../../services/uploadToCloudinary.service";
import { editUser } from "../../../services/admin/user.service";
const { Option } = Select;

function ButtonEditUser(props) {
  const { record, onReload } = props;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [avatar, setAvatar] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    if (isModalOpen) {
      form.setFieldsValue({
        fullName: record.fullName,
        email: record.email,
        phone: record.phone,
        status: record.status,
      });
      setAvatar(record.avatar || "");
      setPreviewUrl(record.avatar || "");
    }
  }, [isModalOpen, record, form]);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const hideModal = () => {
    setIsModalOpen(false);
    form.resetFields();
    setAvatar(record.avatar || "");
    setPreviewUrl(record.avatar || "");
  };

  const handleUpload = async (file) => {
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl); // Hiển thị preview trước khi upload

    try {
      const uploadedImageUrl = await uploadToCloudinary(file);
      if (uploadedImageUrl) {
        setAvatar(uploadedImageUrl);
      }
    } catch (error) {
      console.error("Upload error:", error);
    }
    return false; // Ngăn antd upload tự động
  };

  const handleRemoveImage = (index) => {
    setAvatar("");
    setPreviewUrl("");
  };

  const onFinish = async (values) => {
    const updatedUserData = {
      ...values,
      avatar,
    };
    const result = await editUser(record._id, updatedUserData);
    if (result.code === 200) {
      messageApi.open({
        type: "success",
        content: "Cập nhật người dùng thành công!",
      });
      onReload();
      hideModal();
    }
  };

  return (
    <>
      {contextHolder}
      <Modal
        footer={null}
        onCancel={hideModal}
        open={isModalOpen}
        title="Chỉnh sửa điểm đến"
        width={800}
        style={{ maxWidth: "90vw" }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          className="form"
        >
          <Row gutter={[20]}>
            <Col span={24}>
              <Form.Item
                name="fullName"
                label="Họ và tên"
                rules={[{ required: true }]}
              >
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="email"
                label="Email"
                rules={[{ required: true }]}
              >
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="phone"
                label="Số điện thoại"
                rules={[{ required: true }]}
              >
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="status"
                label="Trạng thái"
                rules={[{ required: true }]}
              >
                <Select>
                  <Option value="active">Hoạt động</Option>
                  <Option value="inactive">Dừng hoạt động</Option>
                  <Option value="initial">Chưa kích hoạt</Option>
                  <Option value="forgot">Quên mật khẩu</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {/* Upload avatar */}
          <Form.Item label="Ảnh avatar">
            <Upload beforeUpload={handleUpload} showUploadList={false}>
              <Button disabled icon={<UploadOutlined />}>
                Chọn ảnh
              </Button>
            </Upload>

            {/* Hiển thị preview nếu có ảnh */}
            <div>
              {previewUrl && (
                <div
                  style={{
                    marginTop: 10,
                    position: "relative",
                    display: "inline-block",
                  }}
                >
                  <img
                    src={previewUrl}
                    alt="avatar Preview"
                    style={{
                      width: 120,
                      height: 120,
                      objectFit: "cover",
                      borderRadius: 10,
                      border: "1px solid #ddd",
                    }}
                  />
                  <CloseCircleOutlined
                    style={{
                      position: "absolute",
                      top: 5,
                      right: 5,
                      fontSize: 18,
                      color: "red",
                      cursor: "pointer",
                      background: "white",
                      borderRadius: "50%",
                    }}
                    onClick={handleRemoveImage}
                  />
                </div>
              )}
            </div>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Cập nhật người dùng
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <Button
        onClick={showModal}
        color="primary"
        variant="outlined"
        icon={<EditOutlined />}
      />
    </>
  );
}
export default ButtonEditUser;
