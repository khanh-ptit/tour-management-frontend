import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
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
import { updateRoom } from "../../../services/admin/room.service";
const { Option } = Select;

function ButtonEditRoom(props) {
  const { record, onReload } = props;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [imageUrls, setImageUrls] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    if (isModalOpen) {
      form.setFieldsValue(record);
      setImageUrls(record.images || []);
      setPreviewUrls(record.images || []);
    }
  }, [isModalOpen, record]);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const hideModal = () => {
    setIsModalOpen(false);
    form.resetFields();
    setImageUrls(record.images || []);
    setPreviewUrls(record.images || []);
  };

  const handleUpload = async (files) => {
    const uploadedUrls = [...imageUrls];
    const previews = [...previewUrls];

    for (const file of files) {
      const objectUrl = URL.createObjectURL(file);
      previews.push(objectUrl);

      try {
        const uploadedImageUrl = await uploadToCloudinary(file);
        if (uploadedImageUrl) {
          uploadedUrls.push(uploadedImageUrl);
        }
      } catch (error) {
        console.error("Upload error:", error);
      }
    }

    setPreviewUrls(previews);
    setImageUrls(uploadedUrls);
  };

  const handleRemoveImage = (index) => {
    const newPreviewUrls = [...previewUrls];
    const newImageUrls = [...imageUrls];
    newPreviewUrls.splice(index, 1);
    newImageUrls.splice(index, 1);
    setPreviewUrls(newPreviewUrls);
    setImageUrls(newImageUrls);
  };

  const onFinish = async (values) => {
    const updatedRoomData = { ...values, images: imageUrls };
    const result = await updateRoom(record.slug, updatedRoomData);
    if (result) {
      messageApi.open({
        type: "success",
        content: "Cập nhật phòng thành công!",
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
        title="Chỉnh sửa phòng"
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
                name="name"
                label="Tên phòng"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="description"
                label="Mô tả"
                rules={[{ required: true }]}
              >
                <Input.TextArea rows={3} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="price"
                label="Giá (VND)"
                rules={[{ required: true }]}
              >
                <InputNumber min={0} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="capacity"
                label="Số người tối đa"
                rules={[{ required: true }]}
              >
                <InputNumber min={1} max={10} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true }]}
          >
            <Select>
              <Option value="available">Còn phòng</Option>
              <Option value="booked">Hết phòng</Option>
              <Option value="maintenance">Đang bảo trì</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="amenities"
            label="Tiện ích"
            rules={[{ required: true }]}
          >
            <Select mode="multiple">
              <Option value="WiFi">WiFi</Option>
              <Option value="Máy lạnh">Máy lạnh</Option>
              <Option value="Tivi">Tivi</Option>
              <Option value="Minibar">Minibar</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Hình ảnh">
            <Upload
              multiple
              beforeUpload={(file) => {
                handleUpload([file]);
                return false;
              }}
              showUploadList={false}
            >
              <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
            </Upload>
            <div
              style={{
                marginTop: 10,
                display: "flex",
                gap: 10,
                flexWrap: "wrap",
              }}
            >
              {previewUrls.map((url, index) => (
                <div key={index} style={{ position: "relative" }}>
                  <img
                    src={url}
                    alt={`Preview ${index}`}
                    style={{
                      width: 100,
                      height: 100,
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
                    onClick={() => handleRemoveImage(index)}
                  />
                </div>
              ))}
            </div>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Lưu thay đổi
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <Button onClick={showModal} icon={<EditOutlined />} />
    </>
  );
}
export default ButtonEditRoom;
