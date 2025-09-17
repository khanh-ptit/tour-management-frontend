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
  DatePicker,
} from "antd";
import { UploadOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { uploadToCloudinary } from "../../../services/uploadToCloudinary.service";
import { useNavigate } from "react-router-dom";
import { getServiceList } from "../../../services/admin/service.service";
import { createTour } from "../../../services/admin/tour.service";
import { getTourCategoryList } from "../../../services/admin/tour-category.service";
import { getDestinationList } from "../../../services/admin/destination.service";
// import "./CreateRoom.scss";

const { RangePicker } = DatePicker;
const { Option } = Select;

function CreateTour() {
  const [services, setServices] = useState([]);
  const [tourCategories, setTourCategories] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [servicesPrice, setServicesPrice] = useState(0);

  useEffect(() => {
    document.title = "Thêm mới tour | Admin";
    const fetchServices = async () => {
      const result = await getServiceList();
      if (result) {
        // console.log(result);
        setServices(result.services);
      }
    };
    fetchServices();
    const fetchTourCategories = async () => {
      const result = await getTourCategoryList();
      if (result) {
        // console.log(result);
        setTourCategories(result.tourCategories);
      }
    };
    fetchTourCategories();
    const fetchDestinations = async () => {
      const result = await getDestinationList();
      // console.log(result);
      setDestinations(result.destinations);
    };
    fetchDestinations();
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

  const onFinish = async (values) => {
    // Tách ngày xuất phát và ngày trở về
    const [departureDate, returnDate] = values.dates || [];

    delete values.dates;

    // Tạo object chứa dữ liệu tour
    const tourData = {
      ...values,
      departureDate: departureDate ? departureDate.toISOString() : null,
      returnDate: returnDate ? returnDate.toISOString() : null,
      images: imageUrls,
      servicesPrice,
      totalPrice,
    };

    // Gửi request lưu dữ liệu vào database (nếu có API)
    const result = await createTour(tourData);
    if (result) {
      messageApi.open({
        type: "success",
        content: "Tạo tour thành công",
      });
      form.resetFields();
      setTimeout(() => {
        navigate("/admin/tours");
      }, 2000);
    }
  };

  return (
    <>
      {contextHolder}
      <h2 className="create__title">Thêm mới tour du lịch</h2>
      <Form form={form} layout="vertical" onFinish={onFinish} className="form">
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
              rules={[{ required: true }]}
            >
              <Select>
                {tourCategories.map((item) => (
                  <Option value={item._id}>{item.name}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="destinationId"
              label="Điểm đến"
              rules={[{ required: true }]}
            >
              <Select>
                {destinations.map((item) => (
                  <Option value={item._id}>{item.name}</Option>
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
                max={100}
                min={0}
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
            Tạo tour
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}

export default CreateTour;
