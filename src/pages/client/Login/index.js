import { Button, Form, Input } from "antd";
import "./Login.scss";

function Login() {
  return (
    <>
      <div className="container form-login-client">
        <div className="row">
          <div className="col-xl-6 col-lg-6 col-md-6 form-login-client__image">
            <img
              src="https://damoclesjournal.com/wp-content/uploads/2022/02/0x0.jpg?w=1024"
              alt="Travel image"
            />
          </div>
          <div className="col-xl-6 col-lg-6 col-md-6 col-12 form-login-client__content">
            <h2 className="form-login-client__title text-center">Đăng nhập </h2>
            <Form layout="vertical">
              <Form.Item
                label="Email"
                name="email"
                rules={[{ required: true, message: "Vui lòng nhập email!" }]}
              >
                <Input placeholder="Nhập email" />
              </Form.Item>
              <Form.Item
                label="Mật khẩu"
                name="password"
                rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
              >
                <Input.Password placeholder="Nhập mật khẩu" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" className="w-full">
                  Đăng nhập
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
