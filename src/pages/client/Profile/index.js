import { useEffect, useMemo, useState } from "react";
import {
  changePasswordUser,
  editInfoUser,
  getOrderStatistic,
  getProfile,
} from "../../../services/client/user.service";
import {
  Card,
  Avatar,
  Descriptions,
  Tag,
  Typography,
  Button,
  Spin,
  Modal,
  Form,
  Input,
  Row,
  Col,
  Upload,
  message,
  Checkbox,
  Dropdown,
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
  MoreOutlined,
} from "@ant-design/icons";
import moment from "moment";
import { Line, Pie } from "@ant-design/charts";
import styles from "./Profile.module.scss";
import { uploadToCloudinary } from "../../../services/uploadToCloudinary.service";
import { useDispatch } from "react-redux";

const { Title, Text } = Typography;

function Profile() {
  const [profile, setProfile] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [orderPercentage, setOrderPercentage] = useState(null);
  const [monthlySpend, setMonthlySpend] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalInfoOpen, setIsModalInfoOpen] = useState(false);
  const [form] = Form.useForm();
  const [infoForm] = Form.useForm();
  const [avatar, setAvatar] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [profileResponse, orderStatisticResponse] = await Promise.all([
          getProfile(),
          getOrderStatistic(),
        ]);

        if (profileResponse.code === 200) {
          setProfile(profileResponse.user);
        }

        if (orderStatisticResponse.code === 200) {
          setOrderPercentage(orderStatisticResponse.orderPercentage);
          setMonthlySpend(orderStatisticResponse.monthlySpend);
          setOrderPercentage(orderStatisticResponse.orderPercentage);
        }
      } catch (error) {
        messageApi.error(error.message || "Lỗi máy chủ");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
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
      const response = await changePasswordUser(values);
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
      const response = await editInfoUser(updateObj);
      if (response.code === 200) {
        messageApi.open({
          type: "success",
          content: response.message,
        });
        const refreshed = await getProfile();
        if (refreshed.code === 200) {
          setProfile(refreshed.user);
        }
        // dispatch(updateAccount(refreshed.account));
        infoForm.resetFields();
        setIsModalInfoOpen(false);
      }
    } catch (error) {
      messageApi.error(error.message);
    }
  };

  useEffect(() => {
    if (profile) {
      infoForm.setFieldsValue({
        fullName: profile.fullName,
        email: profile.email,
        phone: profile.phone,
      });
      setAvatar(profile.avatar);
      setPreviewUrl(profile.avatar);
    }
  }, [profile]);

  const spendConfig = useMemo(
    () => ({
      data: monthlySpend,
      xField: "month",
      yField: "totalSpend",
      autoFit: true,
      smooth: true,
      yAxis: {
        title: {
          text: "Chi tiêu (VNĐ)",
          style: { fontSize: 14, fontWeight: 600 },
        },
        grid: null,
        label: {
          formatter: (val) => Number(val).toLocaleString("vi-VN"),
        },
      },
      xAxis: {
        title: {
          text: "Tháng",
          style: { fontSize: 14, fontWeight: 600 },
        },
        tickFormatter: (value) => {
          const [month, year] = value.split("-");
          return `T${month}/${year}`;
        },
      },
      tooltip: {
        title: (title) => {
          const [month, year] = title.split("-");
          return `Tháng ${month} năm ${year}`;
        },
        formatter: (item) => ({
          name: "Chi tiêu",
          value: `${Number(item.totalSpend).toLocaleString("vi-VN")} VNĐ`,
        }),
      },
      slider: {
        start: 0,
        end: 1,
      },
    }),
    [monthlySpend]
  );

  const orderStatusData = [
    {
      type: "Đã thanh toán",
      value: Number(orderPercentage?.paidOrderPercentage || 0),
    },
    {
      type: "Chưa thanh toán",
      value: Number(orderPercentage?.unpaidOrderPercentage || 0),
    },
  ];

  const orderStatusConfig = useMemo(
    () => ({
      data: [
        {
          type: "Đã thanh toán",
          value: Number(orderPercentage?.paidOrderPercentage || 0),
        },
        {
          type: "Chưa thanh toán",
          value: Number(orderPercentage?.unpaidOrderPercentage || 0),
        },
      ],
      angleField: "value",
      colorField: "type",
      radius: 0.8,
      label: {
        type: "inner",
        content: ({ value }) => `${value.toFixed(2)}%`,
      },
      tooltip: {
        formatter: (item) => ({
          name: item.type,
          value: `${item.value.toFixed(2)}%`,
        }),
      },
      color: ["#6395FA", "#63DAAB"],
      legend: {
        position: "bottom",
        layout: "horizontal",
        align: "center",
      },
    }),
    [orderPercentage]
  );

  return (
    <>
      {contextHolder}
      {loading ? (
        <Spin tip="Đang tải dữ liệu..." size="default">
          <div style={{ minHeight: "100vh" }} />
        </Spin>
      ) : (
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            marginTop: "20px",
            marginBottom: "20px",
          }}
        >
          <Card style={{ marginBottom: 24 }}>
            <div className="row align-items-center">
              {/* Avatar */}
              <div className="col-12 col-sm-4 col-md-3 col-lg-2 d-flex justify-content-center mb-3 mb-md-0">
                <Avatar
                  size={120}
                  src={profile.avatar}
                  icon={<UserOutlined />}
                />
              </div>

              {/* Thông tin */}
              <div className="col-12 col-sm-8 col-md-9 col-lg-10">
                <Title level={4} style={{ marginBottom: 4 }}>
                  {profile.fullName}
                </Title>
                <Text type="secondary">
                  <MailOutlined /> {profile.email}
                </Text>
                <br />
                <Text>
                  <PhoneOutlined /> {profile.phone}
                </Text>
              </div>
            </div>
          </Card>

          <Card
            title="Thông tin chi tiết"
            style={{ marginBottom: 24 }}
            extra={
              <Dropdown
                menu={{
                  items: [
                    {
                      key: "1",
                      label: "Thay đổi thông tin",
                      onClick: handleOpenInfoModal,
                    },
                    {
                      key: "2",
                      label: "Đổi mật khẩu",
                      onClick: handleOpenModal,
                    },
                  ],
                }}
                trigger={["click"]}
              >
                <Button icon={<MoreOutlined />} />
              </Dropdown>
            }
          >
            <Descriptions column={1} bordered size="middle">
              <Descriptions.Item label="Trạng thái">
                {profile.status === "active" ? (
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
                {moment(profile.createdAt).format("hh:ss DD/MM/YYYY")}
              </Descriptions.Item>
              <Descriptions.Item label="Cập nhật gần nhất">
                {moment(profile.updatedAt).format("hh:ss DD/MM/YYYY")}
              </Descriptions.Item>
              <Descriptions.Item label="Xác thực 2 yếu tố">
                <Checkbox />
              </Descriptions.Item>
            </Descriptions>
          </Card>

          <Card className="mb-4" title="Thống kê chi tiêu & đơn hàng">
            <Row gutter={[20, 20]}>
              <Col xs={24} sm={16}>
                <div className={styles["chart-card"]}>
                  <div className={`${styles["dashboard-admin__chart-title"]}`}>
                    Chi tiêu 6 tháng gần nhất
                  </div>
                  <Line {...spendConfig} />
                </div>
              </Col>
              <Col xs={24} sm={8}>
                <div className={styles["chart-card"]}>
                  <div className={`${styles["dashboard-admin__chart-title"]}`}>
                    Trạng thái đơn hàng
                  </div>
                  <Pie {...orderStatusConfig} />
                </div>
              </Col>
            </Row>
          </Card>
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

export default Profile;
