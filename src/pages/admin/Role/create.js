import { useEffect, useState } from "react";
import { Form, Input, Button, message, Row, Col } from "antd";
import { createRole } from "../../../services/admin/role.service";
import { useNavigate } from "react-router-dom";

function CreateRole() {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Thêm mới nhóm quyền | Admin";
  });

  const onFinish = async (values) => {
    try {
      const roleData = { ...values };
      const response = await createRole(roleData);

      if (response.code === 201) {
        messageApi.open({
          type: "success",
          content: response.message || "Tạo thành công nhóm quyền",
        });
        form.resetFields();
        setTimeout(() => {
          navigate("/admin/roles");
        }, 2000);
      } else {
        messageApi.open({
          type: "error",
          content: response.message || "Có lỗi xảy ra khi tạo nhóm quyền",
        });
      }
    } catch (error) {
      console.error("Lỗi khi tạo nhóm quyền:", error);
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
      <h2 className="create__title">Thêm mới nhóm quyền</h2>
      <Form form={form} layout="vertical" onFinish={onFinish} className="form">
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
            Tạo nhóm quyền
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}

export default CreateRole;
