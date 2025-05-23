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
  DatePicker,
} from "antd";
import {
  CloseCircleOutlined,
  EditOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { uploadToCloudinary } from "../../../services/uploadToCloudinary.service";
import { updateTour } from "../../../services/admin/tour.service";
import { getServiceList } from "../../../services/admin/service.service";
import { getTourCategoryList } from "../../../services/admin/tour-category.service";
import { getDestinationList } from "../../../services/admin/destination.service";
const { Option } = Select;
const { RangePicker } = DatePicker;

function ButtonEditTour(props) {
  const [services, setServices] = useState([]);
  const [tourCategories, setTourCategories] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [servicesPrice, setServicesPrice] = useState(0);
  const { record, onReload } = props;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [imageUrls, setImageUrls] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    if (isModalOpen) {
      form.setFieldsValue({
        name: record.name,
        categoryId: record.categoryId?._id || undefined,
        destinationId: record.destinationId || undefined,
        description: record.description,
        dates: [dayjs(record.departureDate), dayjs(record.returnDate)],
        price: record.price,
        duration: record.duration,
        status: record.status,
        discountPercentage: record.discountPercentage,
        services: record.services?.map((s) => s._id),
      });

      setImageUrls(record.images || []);
      setPreviewUrls(record.images || []);
      setTotalPrice(record.totalPrice);

      const fetchData = async () => {
        const [servicesRes, categoriesRes, destinationsRes] = await Promise.all(
          [getServiceList(), getTourCategoryList(), getDestinationList()]
        );

        setServices(servicesRes);
        setTourCategories(categoriesRes.tourCategories);
        setDestinations(destinationsRes.destinations);
      };

      fetchData();
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
    const [departureDate, returnDate] = values.dates || [];
    delete values.dates;
    const updatedTourData = {
      ...values,
      images: imageUrls,
      departureDate: departureDate ? departureDate.toISOString() : null,
      returnDate: returnDate ? returnDate.toISOString() : null,
      servicesPrice,
      totalPrice,
    };
    console.log(updatedTourData);
    const result = await updateTour(record.slug, updatedTourData);
    // const result = undefined; // Gọi API cập nhật ở đây
    if (result) {
      messageApi.open({
        type: "success",
        content: "Cập nhật tour thành công!",
      });
      onReload();
      hideModal();
    }
  };

  const handleServiceChange = (selectedServiceIds) => {
    const totalServicePrice = selectedServiceIds.reduce((acc, id) => {
      const service = services.find((s) => s._id === id);
      return acc + (service ? service.price : 0);
    }, 0);
    setServicesPrice(totalServicePrice);
    setTotalPrice(form.getFieldValue("price") + totalServicePrice);
  };

  const handlePriceChange = (value) => {
    setTotalPrice(value + servicesPrice);
  };

  return (
    <>
      {contextHolder}
      <Modal
        footer={null}
        onCancel={hideModal}
        open={isModalOpen}
        title="Chỉnh sửa tour"
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
                label="Tên tour"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="categoryId"
                label="Danh mục"
                rules={[{ required: true, message: "Vui lòng chọn danh mục!" }]}
              >
                <Select placeholder="Chọn danh mục">
                  {tourCategories.map((item) => (
                    <Select.Option key={item._id} value={item._id}>
                      {item.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="destinationId"
                label="Điểm đến"
                rules={[{ required: true, message: "Vui lòng chọn điểm đến!" }]}
              >
                <Select placeholder="Chọn điểm đến">
                  {destinations.map((item) => (
                    <Option key={item._id} value={item._id}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
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
            <Col span={24}>
              <Form.Item
                name="dates"
                label="Ngày xuất phát - Ngày trở về"
                rules={[{ required: true, message: "Vui lòng chọn ngày!" }]}
              >
                <RangePicker
                  format={"DD/MM/YYYY"}
                  placeholder={["Ngày đặt", "Ngày trả"]}
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
              <Form.Item
                name="price"
                label="Giá cơ bản (VND)"
                rules={[{ required: true }]}
              >
                <InputNumber
                  min={0}
                  style={{ width: "100%" }}
                  onChange={handlePriceChange}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
              <Form.Item
                name="discountPercentage"
                label="Giảm giá"
                rules={[{ required: true }]}
              >
                <Input
                  name="discountPercentage"
                  type="number"
                  min={0}
                  max={100}
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                name="duration"
                label="Thời gian"
                rules={[{ required: true }]}
              >
                <Input name="duration" style={{ width: "100%" }} />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                name="status"
                label="Trạng thái"
                rules={[{ required: true }]}
              >
                <Select>
                  <Option value="active">Hoạt động</Option>
                  <Option value="inactive">Dừng hoạt động</Option>
                </Select>
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item name="services" label="Dịch vụ">
                <Select
                  mode="multiple"
                  placeholder="Chọn dịch vụ"
                  onChange={handleServiceChange}
                >
                  {services.map((item) => (
                    <Option key={item._id} value={item._id}>
                      {item.name} (+{item.price.toLocaleString()} VND)
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <div
            style={{
              fontSize: "16px",
              color: "red",
              fontWeight: "bold",
              marginTop: 10,
              marginBottom: 10,
            }}
          >
            Tổng giá: {totalPrice.toLocaleString()} VND
          </div>

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
              Cập nhật
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
export default ButtonEditTour;
