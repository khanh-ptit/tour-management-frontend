import { useEffect, useState } from "react";
import { Form, Input, Upload, Select, Button, message, Row, Col } from "antd";
import { UploadOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { uploadToCloudinary } from "../../../services/uploadToCloudinary.service";
import { useNavigate } from "react-router-dom";
import { getRoleList } from "../../../services/admin/role.service";
import { createAccount } from "../../../services/admin/account.service";
// import "./CreateRoom.scss";

const { Option } = Select;

function CreateAccount() {
  const [roles, setRoles] = useState([]);
  useEffect(() => {
    document.title = "Thêm mới tài khoản | Admin";
    const fetchRoles = async () => {
      const response = await getRoleList();
      if (response.code === 200) {
        setRoles(response.roles);
      }
    };
    fetchRoles();
  }, []);

  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [avatar, setAvatar] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const navigate = useNavigate();

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
      avatar, // ghép avatar đúng field
    };

    try {
      const response = await createAccount(accountData);

      if (response.code === 201) {
        messageApi.open({
          type: "success",
          content: "Tạo tài khoản thành công",
        });
        form.resetFields();
        setTimeout(() => navigate("/admin/accounts"), 2000);
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
      <h2 className="create__title">Thêm mới tài khoản</h2>
      <Form form={form} layout="vertical" onFinish={onFinish} className="form">
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
            <Form.Item name="email" label="Email" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="password"
              label="Mật khẩu"
              rules={[{ required: true }]}
            >
              <Input type="password" />
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
                  alt="Avatar Preview"
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
            Tạo tài khoản
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}

export default CreateAccount;
