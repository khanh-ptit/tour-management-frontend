import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Row,
} from "antd";
import { EditOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { editService } from "../../../services/admin/service.service";

function ButtonEditService(props) {
  const { record, onReload } = props;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    if (isModalOpen) {
      form.setFieldsValue({
        name: record.name,
        price: record.price,
        description: record.description,
      });
    }
  }, [isModalOpen, record]);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const hideModal = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const onFinish = async (values) => {
    try {
      const roleData = { ...values };
      const response = await editService(record._id, roleData);

      if (response.code === 200) {
        messageApi.open({
          type: "success",
          content: response.message || "",
        });
        onReload();
        hideModal();
      } else {
        messageApi.open({
          type: "error",
          content: response.message || "Có lỗi xảy ra khi tạo dịch vụ",
        });
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật dịch vụ:", error);
      messageApi.open({
        type: "error",
        content:
          error.response?.data?.message ||
          "Không thể kết nối tới server, vui lòng thử lại!",
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
        title="Chỉnh sửa dịch vụ"
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
              Cập nhật dịch vụ
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
export default ButtonEditService;
