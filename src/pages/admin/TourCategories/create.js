import { useEffect, useState } from "react";
import { Form, Input, Upload, Button, message, Row, Col } from "antd";
import { UploadOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { uploadToCloudinary } from "../../../services/uploadToCloudinary.service";
import { useNavigate } from "react-router-dom";
import { getServiceList } from "../../../services/admin/service.service";
import { createTour } from "../../../services/admin/tour.service";
import {
  createTourCategory,
  getTourCategoryList,
} from "../../../services/admin/tour-category.service";
// import "./CreateRoom.scss";

function CreateTourCategory() {
  useEffect(() => {
    document.title = "Thêm mới tour | Admin";
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
    // Tách ngày xuất phát và ngày trở về

    // Tạo object chứa dữ liệu tour
    const tourCategoryData = {
      ...values,
      images: imageUrls,
    };

    console.log("Tour Category Data:", tourCategoryData);

    // Gửi request lưu dữ liệu vào database (nếu có API)
    const result = await createTourCategory(tourCategoryData);
    if (result) {
      messageApi.open({
        type: "success",
        content: result.message,
      });
      form.resetFields();
      setTimeout(() => {
        navigate("/admin/tour-categories");
      }, 2000);
    }
  };

  return (
    <>
      {contextHolder}
      <h2 className="create__title">Thêm mới danh mục tour du lịch</h2>
      <Form form={form} layout="vertical" onFinish={onFinish} className="form">
        <Row gutter={[20]}>
          <Col span={24}>
            <Form.Item
              name="name"
              label="Tên danh mục tour"
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
            Tạo danh mục tour
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}

export default CreateTourCategory;
