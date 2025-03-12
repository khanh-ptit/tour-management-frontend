import { Button, Col, Form, Input, message, Row, Upload } from "antd";
import { useEffect, useState } from "react";
import { uploadToCloudinary } from "../../../services/uploadToCloudinary.service";
import { useNavigate } from "react-router-dom";
import { UploadOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { createDestination } from "../../../services/admin/destination.service";

function CreateDestination() {
  useEffect(() => {
    document.title = "Thêm mới điểm đến | Admin";
  }, []);

  // console.log(tourCategoryList);

  const [form] = Form.useForm();
  const [thumbnail, setThumbnail] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  // Xử lý upload nhiều ảnh
  const handleUpload = async (file) => {
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl); // Hiển thị preview trước khi upload

    try {
      const uploadedImageUrl = await uploadToCloudinary(file);
      if (uploadedImageUrl) {
        setThumbnail(uploadedImageUrl);
      }
    } catch (error) {
      console.error("Upload error:", error);
    }
    return false; // Ngăn antd upload tự động
  };

  const handleRemoveImage = (index) => {
    setThumbnail("");
    setPreviewUrl("");
  };

  const onFinish = async (values) => {
    // Tách ngày xuất phát và ngày trở về

    // Tạo object chứa dữ liệu tour
    const destinationData = {
      ...values,
      thumbnail,
    };

    console.log("Tour Category Data:", destinationData);

    // Gửi request lưu dữ liệu vào database (nếu có API)
    const result = await createDestination(destinationData);
    if (result) {
      messageApi.open({
        type: "success",
        content: result.message,
      });
      form.resetFields();
      setTimeout(() => {
        navigate("/admin/destinations");
      }, 2000);
    }
  };

  return (
    <>
      {contextHolder}
      <h2 className="create__title">Thêm mới điểm đến</h2>
      <Form form={form} layout="vertical" onFinish={onFinish} className="form">
        <Row gutter={[20]}>
          <Col span={24}>
            <Form.Item
              name="name"
              label="Tên điểm đến"
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
        </Row>

        {/* Upload Thumbnail */}
        <Form.Item label="Ảnh Thumbnail">
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
                  alt="Thumbnail Preview"
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
            Tạo điểm đến
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}

export default CreateDestination;
