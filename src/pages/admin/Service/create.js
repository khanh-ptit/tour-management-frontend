import { useEffect } from "react";
import { Form, Input, InputNumber, Button, Row, Col, message } from "antd";
import { useNavigate } from "react-router-dom";
import { createService } from "../../../services/admin/service.service";

function CreateService() {
  useEffect(() => {
    document.title = "Thêm mới dịch vụ | Admin";
  }, []);

  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = async (values) => {
    try {
      const serviceData = { ...values };
      const response = await createService(serviceData);

      if (response.code === 201) {
        messageApi.open({
          type: "success",
          content: response.message || "Tạo thành công dịch vụ",
        });
        form.resetFields();
        setTimeout(() => {
          navigate("/admin/services");
        }, 2000);
      } else {
        messageApi.open({
          type: "error",
          content: response.message || "Có lỗi xảy ra khi tạo dịch vụ",
        });
      }
    } catch (error) {
      console.error("Lỗi khi tạo dịch vụ:", error);
      messageApi.open({
        type: "error",
        content:
          error.message || "Không thể kết nối tới server, vui lòng thử lại!",
      });
    }
  };

  return (
    <>
      {contextHolder}
      <h2 className="create__title">Thêm mới dịch vụ</h2>
      <Form form={form} layout="vertical" onFinish={onFinish} className="form">
        <Row gutter={[20]}>
          <Col span={24}>
            <Form.Item
              name="name"
              label="Tên dịch vụ"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="price"
              label="Giá (VND)"
              rules={[{ required: true }]}
            >
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item name="description" label="Mô tả">
              <Input.TextArea rows={3} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Tạo dịch vụ
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}

export default CreateService;
