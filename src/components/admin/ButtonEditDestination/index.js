import { Button, Col, Form, Input, message, Modal, Row, Upload } from "antd";
import {
  CloseCircleOutlined,
  EditOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { uploadToCloudinary } from "../../../services/uploadToCloudinary.service";
import { updateDestination } from "../../../services/admin/destination.service";

function ButtonEditDestination(props) {
  const { record, onReload } = props;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [thumbnail, setThumbnail] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    if (isModalOpen) {
      form.setFieldsValue({
        name: record.name,
        description: record.description,
        categoryParentId: record.categoryParentId || "", // Đảm bảo không bị lỗi undefined
      });
      setThumbnail(record.thumbnail || "");
      setPreviewUrl(record.thumbnail || "");
    }
  }, [isModalOpen, record, form]);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const hideModal = () => {
    setIsModalOpen(false);
    form.resetFields();
    setThumbnail(record.thumbnail || "");
    setPreviewUrl(record.thumbnail || "");
  };

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
    const updatedDestinationData = {
      ...values,
      thumbnail,
    };
    const result = await updateDestination(record.slug, updatedDestinationData);
    // const result = undefined; // Gọi API cập nhật ở đây
    if (result.code === 200) {
      messageApi.open({
        type: "success",
        content: "Cập nhật điểm đến thành công!",
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
export default ButtonEditDestination;
