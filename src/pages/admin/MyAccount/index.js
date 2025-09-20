import {
  Card,
  Avatar,
  Descriptions,
  Tag,
  Typography,
  List,
  Divider,
  Button,
  Spin,
  Modal,
  Form,
  Input,
  Row,
  Col,
  Upload,
  message,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  CheckCircleTwoTone,
  CloseCircleTwoTone,
  SwapOutlined,
  UploadOutlined,
  CloseCircleOutlined,
  CheckOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import {
  changePassword,
  editInfo,
  getInfo,
} from "../../../services/admin/my-account.service";
import moment from "moment";
import { uploadToCloudinary } from "../../../services/uploadToCloudinary.service";
import { useDispatch } from "react-redux";
import { updateAccount } from "../../../actions/account";

const { Title, Text } = Typography;

function MyAccount() {
  const [account, setAccount] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalInfoOpen, setIsModalInfoOpen] = useState(false);
  const [form] = Form.useForm();
  const [infoForm] = Form.useForm();
  const [avatar, setAvatar] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [messageApi, contextHolder] = message.useMessage();
  const dispatch = useDispatch();

  useEffect(() => {
    document.title = "Thông tin tài khoản";
  }, []);

  useEffect(() => {
    if (isModalInfoOpen) {
      infoForm.setFieldsValue({
        fullName: account.fullName,
        email: account.email,
        phone: account.phone,
      });
      setAvatar(account.avatar);
      setPreviewUrl(account.avatar);
    }
  }, [isModalInfoOpen, account, infoForm]);

  useEffect(() => {
    const fetchAccount = async () => {
      const response = await getInfo();
      if (response.code === 200) {
        setAccount(response.account);
      }
    };
    fetchAccount();
  }, []);

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

  const handleOpenModal = () => {
    setIsModalOpen(true);
    form.setFieldsValue({
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handleOpenInfoModal = () => {
    setIsModalInfoOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleInfoCancel = () => {
    setIsModalInfoOpen(false);
  };

  const onFinish = async (values) => {
    console.log(values);
    try {
      const response = await changePassword(values);
      if (response.code === 200) {
        messageApi.open({
          type: "success",
          content: response.message,
        });
        setIsModalOpen(false);
      }
    } catch (error) {
      messageApi.error(error.message);
    }
  };

  const onFinishInfo = async (values) => {
    const updateObj = {
      ...values,
      avatar,
    };
    delete updateObj.email;
    try {
      const response = await editInfo(updateObj);
      if (response.code === 200) {
        messageApi.open({
          type: "success",
          content: response.message,
        });
        const refreshed = await getInfo();
        if (refreshed.code === 200) {
          setAccount(refreshed.account);
        }
        dispatch(updateAccount(refreshed.account));

        infoForm.resetFields();
        setIsModalInfoOpen(false);
      }
    } catch (error) {
      messageApi.error(error.message);
    }
  };

  return (
    <>
      {contextHolder}
      {!account ? (
        <Spin tip="Đang tải dữ liệu..." size="default">
          <div style={{ minHeight: "100vh" }} />
        </Spin>
      ) : (
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <Card style={{ marginBottom: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <Avatar size={120} src={account.avatar} icon={<UserOutlined />} />
              <div style={{ marginLeft: "16px" }} className="ml-3">
                <Title level={4} style={{ marginBottom: 4 }}>
                  {account.fullName}
                </Title>
                <Text type="secondary">
                  <MailOutlined /> {account.email}
                </Text>
                <br />
                <Text>
                  <PhoneOutlined /> {account.phone}
                </Text>
              </div>
            </div>
          </Card>

          <Card title="Thông tin chi tiết" style={{ marginBottom: 24 }}>
            <Descriptions column={1} bordered size="middle">
              <Descriptions.Item label="Trạng thái">
                {account.status === "active" ? (
                  <Tag
                    color="green"
                    icon={<CheckCircleTwoTone twoToneColor="#52c41a" />}
                  >
                    Đang hoạt động
                  </Tag>
                ) : (
                  <Tag
                    color="red"
                    icon={<CloseCircleTwoTone twoToneColor="#ff4d4f" />}
                  >
                    Dừng hoạt động
                  </Tag>
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày tạo">
                {moment(account.createdAt).format("hh:ss DD/MM/YYYY")}
              </Descriptions.Item>
              <Descriptions.Item label="Cập nhật gần nhất">
                {moment(account.updatedAt).format("hh:ss DD/MM/YYYY")}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          <Card className="mb-4" title="Vai trò & Quyền hạn">
            <p>
              <b>Vai trò:</b> {account.roleId?.title}
            </p>
            <Divider orientation="left">Quyền hạn</Divider>
            <List
              size="small"
              dataSource={account.roleId?.permissions || []}
              renderItem={(perm) => (
                <List.Item>
                  <Tag color="blue">{perm}</Tag>
                </List.Item>
              )}
              grid={{ gutter: 8, column: 3 }}
            />
          </Card>

          <Button
            onClick={handleOpenInfoModal}
            icon={<SwapOutlined />}
            type="primary"
          >
            Thay đổi thông tin
          </Button>

          <Button
            onClick={handleOpenModal}
            style={{ marginLeft: "16px" }}
            color="red"
            variant="outlined"
          >
            Đổi mật khẩu
          </Button>
        </div>
      )}

      <Modal
        footer={null}
        title="Đổi mật khẩu"
        open={isModalOpen}
        onCancel={handleCancel}
        style={{ minWidth: "36vw" }}
      >
        <p style={{ color: "red", fontSize: "14px" }}>
          Lưu ý mật khẩu phải có ít nhất 6 ký tự bao gồm chữ, số, ký tự đặc biệt
        </p>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          className="form"
        >
          <Form.Item
            name="oldPassword"
            label="Mật khẩu cũ"
            rules={[{ required: true }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="newPassword"
            label="Mật khẩu mới"
            rules={[{ required: true }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label="Xác nhận mật khẩu mới"
            rules={[{ required: true }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item style={{ textAlign: "right" }}>
            <Button type="primary" htmlType="submit">
              Đổi mật khẩu
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        open={isModalInfoOpen}
        footer={null}
        title="Thay đổi thông tin"
        onCancel={handleInfoCancel}
        style={{ minWidth: "60vw" }}
      >
        <Form
          form={infoForm}
          layout="vertical"
          onFinish={onFinishInfo}
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
              <Form.Item
                name="email"
                label="Email"
                rules={[{ required: true }]}
              >
                <Input disabled />
              </Form.Item>
              <Form.Item
                name="phone"
                label="Số điện thoại"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

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
            <Button icon={<CheckOutlined />} type="primary" htmlType="submit">
              Cập nhật thông tin
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default MyAccount;
