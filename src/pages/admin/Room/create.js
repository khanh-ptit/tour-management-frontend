import { useEffect, useState } from "react";
import {
  Form,
  Input,
  InputNumber,
  Upload,
  Select,
  Button,
  message,
  Row,
  Col,
} from "antd";
import { UploadOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { uploadToCloudinary } from "../../../services/uploadToCloudinary.service";
import { createRoom } from "../../../services/admin/room.service";
import { useNavigate } from "react-router-dom";
import "./CreateRoom.scss";

const { Option } = Select;

function CreateRoom() {
  useEffect(() => {
    document.title = "Thêm mới phòng";
  }, []);

  const [form] = Form.useForm();
  const [imageUrls, setImageUrls] = useState([]); // Danh sách URL ảnh sau khi upload
  const [previewUrls, setPreviewUrls] = useState([]); // Danh sách preview ảnh
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  // Xử lý upload nhiều ảnh
  const handleUpload = async (files) => {
    const uploadedUrls = [...imageUrls];
    const previews = [...previewUrls];

    for (const file of files) {
      const objectUrl = URL.createObjectURL(file);
      previews.push(objectUrl); // Lưu URL preview tạm thời

      try {
        const uploadedImageUrl = await uploadToCloudinary(file);
        // const uploadedImageUrl = undefined;
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

  // Xóa ảnh khỏi danh sách
  const handleRemoveImage = (index) => {
    const newPreviewUrls = [...previewUrls];
    const newImageUrls = [...imageUrls];

    newPreviewUrls.splice(index, 1);
    newImageUrls.splice(index, 1);

    setPreviewUrls(newPreviewUrls);
    setImageUrls(newImageUrls);
  };

  const onFinish = async (values) => {
    const roomData = { ...values, images: imageUrls };
    console.log("Room Data:", roomData);
    const result = await createRoom(roomData);
    if (result) {
      messageApi.open({
        type: "success",
        content: "Tạo phòng thành công ",
      });
      form.resetFields();
      setTimeout(() => {
        navigate("/admin/rooms");
      }, 2000);
    }
  };

  return (
    <>
      {contextHolder}
      <h2 className="create__title">Thêm mới phòng</h2>
      <Form form={form} layout="vertical" onFinish={onFinish} className="form">
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
          <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
            <Form.Item
              name="price"
              label="Giá (VND)"
              rules={[{ required: true }]}
            >
              <InputNumber type="number" min={0} style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
            <Form.Item
              name="capacity"
              label="Số người tối đa"
              rules={[{ required: true }]}
            >
              <InputNumber
                type="number"
                min={1}
                max={10}
                style={{ width: "100%" }}
              />
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
          <Select mode="multiple" placeholder="Chọn tiện ích">
            <Option value="WiFi">WiFi</Option>
            <Option value="Máy lạnh">Máy lạnh</Option>
            <Option value="Tivi">Tivi</Option>
            <Option value="Minibar">Minibar</Option>
          </Select>
        </Form.Item>

        {/* Upload nhiều hình ảnh */}
        <Form.Item label="Hình ảnh">
          <Upload
            multiple
            beforeUpload={(file) => {
              handleUpload([file]); // Gửi file dưới dạng mảng
              return false; // Ngăn upload tự động của antd
            }}
            showUploadList={false}
          >
            <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
          </Upload>

          {/* Hiển thị preview + nút xóa */}
          <div
            style={{
              marginTop: 10,
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
            }}
          >
            {previewUrls.map((url, index) => (
              <div
                key={index}
                style={{ position: "relative", display: "inline-block" }}
              >
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
            Tạo phòng
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}

export default CreateRoom;
