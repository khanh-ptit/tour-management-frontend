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
import { getRoleList } from "../../../services/admin/role.service";
import {
  createAccount,
  editAccount,
} from "../../../services/admin/account.service";
const { Option } = Select;

function ButtonEditAccount(props) {
  const { record, onReload } = props;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [avatar, setAvatar] = useState("");
  const [previewUrl, setPreviewUrl] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    if (isModalOpen) {
      form.setFieldsValue({
        fullName: record.fullName,
        email: record.email,
        phone: record.phone,
        status: record.status,
        roleId: record.roleId._id,
      });
      setAvatar(record.avatar || "");
      setPreviewUrl(record.avatar || "");

      const fetchRoles = async () => {
        const roleResponse = await getRoleList();
        if (roleResponse.code === 200) {
          setRoles(roleResponse.roles);
        }
      };

      fetchRoles();
    }
  }, [isModalOpen, record]);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const hideModal = () => {
    setIsModalOpen(false);
    form.resetFields();
    setAvatar(record.avatar);
    setPreviewUrl(record.avatar);
  };

  // Xử lý upload nhiều ảnh
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
    const accountData = {
      ...values,
      avatar: avatar, // ghép avatar đúng field
    };

    try {
      const response = await editAccount(record._id, accountData);

      if (response.code === 200) {
        messageApi.open({
          type: "success",
          content: response.message,
        });
        onReload();
        hideModal();
      } else {
        messageApi.open({
          type: "error",
          content: response.message,
        });
      }
    } catch (error) {
      messageApi.open({
        type: "error",
        content: error.message,
      });
    }
  };

  return (
    <>
      {contextHolder}
      <Modal
        footer={null}
        onCancel={hideModal}
        open={isModalOpen}
        title="Chỉnh sửa tour"
        width={800}
        style={{ maxWidth: "90vw" }}
      >
        <h2 className="create__title">Chỉnh sửa tài khoản</h2>
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
                <Input />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="email"
                label="Email"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="password"
                label="Mật khẩu"
                rules={[{ required: false }]}
              >
                <Input.Password placeholder="Để trống nếu không muốn thay đổi" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="phone"
                label="Số điện thoại"
                rules={[{ required: true }]}
              >
                <Input name="phone" style={{ width: "100%" }} />
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
                </Select>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="roleId"
                label="Nhóm quyền"
                rules={[{ required: true }]}
              >
                <Select>
                  {roles.map((role) => (
                    <Option value={role._id}>{role.title}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {/* Upload nhiều hình ảnh */}
          <Form.Item label="Ảnh avatar">
            <Upload beforeUpload={handleUpload} showUploadList={false}>
              <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
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
              Cập nhật tài khoản
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
export default ButtonEditAccount;
