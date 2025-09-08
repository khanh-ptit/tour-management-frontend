import { Button, Col, Form, Input, message, Modal, Row } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { editRole } from "../../../services/admin/role.service";

function ButtonEditRole(props) {
  const { record, onReload } = props;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    if (isModalOpen) {
      form.setFieldsValue({
        title: record.title,
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
      const response = await editRole(record._id, roleData);

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
          content: response.message || "Có lỗi xảy ra khi tạo nhóm quyền",
        });
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật nhóm quyền:", error);
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
        title="Chỉnh sửa nhóm quyền"
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
                name="title"
                label="Tên nhóm quyền"
                rules={[{ required: true }]}
              >
                <Input />
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
              Cập nhật nhóm quyền
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
export default ButtonEditRole;
