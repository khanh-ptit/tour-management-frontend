import { Button, Col, message, Row } from "antd";
import { useEffect, useState } from "react";
import {
  getOrderCount,
  getRecentDebt,
  getRecentProfit,
  getThisMonthProfit,
  getTourCount,
  getUserCount,
} from "../../../services/admin/dashboard.service";
import styles from "./Dashboard.module.scss";
import {
  PrinterOutlined,
  UserOutlined,
  DollarOutlined,
  ShoppingCartOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import StatCard from "../../../components/admin/StatCard";
import { Line, Pie } from "@ant-design/charts";

function Dashboard() {
  const [messageApi, contextHolder] = message.useMessage();
  const [userStatistic, setUserStatistic] = useState({});
  const [tourStatistic, setTourStatistic] = useState({});
  const [orderStatistic, setOrderStatistic] = useState({});
  const [thisMonthProfit, setThisMonthProfit] = useState({});
  const [recentProfit, setRecentProfit] = useState([]);
  const [recentDebt, setRecentDebt] = useState([]);
  const [orderStatus, setOrderStatus] = useState({});
  const [userStatus, setUserStatus] = useState({});

  useEffect(() => {
    document.title = "Trang tổng quan";
  }, []);

  useEffect(() => {
    const successMessage = localStorage.getItem("loginSuccessMessage");
    if (successMessage) {
      messageApi.open({
        type: "success",
        content: successMessage,
      });
      localStorage.removeItem("loginSuccessMessage"); // Xóa sau khi hiển thị
    }
  }, []);

  useEffect(() => {
    const fetchUserCount = async () => {
      const userStatisticResponse = await getUserCount();
      if (userStatisticResponse.code === 200) {
        setUserStatistic({
          totalUsers: userStatisticResponse.totalUsers,
          activeUsers: userStatisticResponse.activeUsers,
          inactiveUsers: userStatisticResponse.inactiveUsers,
          initialUsers: userStatisticResponse.initialUsers,
          forgotPasswordUsers: userStatisticResponse.forgotPasswordUsers,
        });
        setUserStatus({
          activeUserPercentage: userStatisticResponse.activeUserPercentage,
          inactiveUserPercentage: userStatisticResponse.inactiveUserPercentage,
          initialUserPercentage: userStatisticResponse.initialUserPercentage,
          forgotPasswordUserPercentage:
            userStatisticResponse.forgotPasswordUserPercentage,
        });
        console.log(userStatus);
      }
    };
    fetchUserCount();

    const fetchTourCount = async () => {
      const tourStatisticResponse = await getTourCount();
      if (tourStatisticResponse.code === 200) {
        setTourStatistic({
          totalTours: tourStatisticResponse.totalTours,
          activeTours: tourStatisticResponse.activeTours,
          inactiveTours: tourStatisticResponse.inactiveTours,
        });

        console.log("🚀 ~ Dashboard ~ userStatus:", userStatus);
      }
    };
    fetchTourCount();

    const fetchOrderCount = async () => {
      const orderStatisticResponse = await getOrderCount();
      if (orderStatisticResponse.code === 200) {
        setOrderStatistic({
          totalPaidOrder: orderStatisticResponse.totalPaidOrder,
          totalUnPaidOrder: orderStatisticResponse.totalUnPaidOrder,
        });
        setOrderStatus({
          totalUnPaidOrderPercentage:
            orderStatisticResponse.totalUnPaidOrderPercentage,
          totalPaidOrderPercentage:
            orderStatisticResponse.totalPaidOrderPercentage,
        });
      }
    };
    fetchOrderCount();

    const fetchThisMonthProfit = async () => {
      const profitStatisticResponse = await getThisMonthProfit();
      if (profitStatisticResponse.code === 200) {
        setThisMonthProfit(profitStatisticResponse.data);
      }
    };
    fetchThisMonthProfit();

    const fetchRecentProfit = async () => {
      const recentProfitStatisticResponse = await getRecentProfit();
      if (recentProfitStatisticResponse.code === 200) {
        setRecentProfit(recentProfitStatisticResponse.data);
      }
    };
    fetchRecentProfit();

    const fetchRecentDebt = async () => {
      const recentDebtStatisticResponse = await getRecentDebt();
      if (recentDebtStatisticResponse.code === 200) {
        setRecentDebt(recentDebtStatisticResponse.data);
      }
    };
    fetchRecentDebt();
  }, []);

  const profitConfig = {
    data: recentProfit,
    xField: "month",
    yField: "totalProfit",
    autoFit: true,
    smooth: true,
    yAxis: {
      title: {
        text: "Lợi nhuận (VNĐ)",
        style: { fontSize: 14, fontWeight: 600 },
      },
      grid: null,
      label: {
        formatter: (val) => Number(val).toLocaleString("vi-VN"), // format trục Y
      },
    },
    xAxis: {
      title: {
        text: "Tháng",
        style: { fontSize: 14, fontWeight: 600 },
      },
      tickFormatter: (value) => {
        const [month, year] = value.split("-");
        return `T${month}/${year}`;
      },
    },
    tooltip: {
      title: (title) => {
        const [month, year] = title.split("-");
        return `Tháng ${month} năm ${year}`;
      },
      formatter: (item) => {
        return {
          name: "Lợi nhuận",
          value: `${Number(item.totalProfit).toLocaleString("vi-VN")} VNĐ`,
        };
      },
    },
    slider: {
      start: 0,
      end: 1,
    },
  };

  const debtConfig = {
    data: recentDebt,
    xField: "month",
    yField: "totalDebt",
    autoFit: true,
    smooth: true,
    yAxis: {
      title: {
        text: "Dư nợ (VNĐ)",
        style: { fontSize: 14, fontWeight: 600 },
      },
      grid: null,
      label: {
        formatter: (val) => Number(val).toLocaleString("vi-VN"), // format trục Y
      },
    },
    xAxis: {
      title: {
        text: "Tháng",
        style: { fontSize: 14, fontWeight: 600 },
      },
      tickFormatter: (value) => {
        const [month, year] = value.split("-");
        return `T${month}/${year}`;
      },
    },
    tooltip: {
      title: (title) => {
        const [month, year] = title.split("-");
        return `Tháng ${month} năm ${year}`;
      },
      formatter: (item) => {
        return {
          name: "Dư nợ",
          value: `${Number(item.totalDebt).toLocaleString("vi-VN")} VNĐ`,
        };
      },
    },
    slider: {
      start: 0,
      end: 1,
    },
  };

  const orderStatusData = [
    {
      type: "Đã thanh toán",
      value: Number(orderStatus.totalPaidOrderPercentage),
    },
    {
      type: "Chưa thanh toán",
      value: Number(orderStatus.totalUnPaidOrderPercentage),
    },
  ];

  const orderStatusConfig = {
    data: orderStatusData,
    angleField: "value",
    colorField: "type",
    radius: 1,
    innerRadius: 0,
    radius: 0.8,
    label: {
      type: "inner",
      content: ({ value }) => `${value.toFixed(2)}%`,
    },
    tooltip: {
      formatter: (item) => {
        return { name: item.type, value: `${item.value.toFixed(2)}%` };
      },
    },
    color: ["#6395FA", "#63DAAB"],
    legend: {
      position: "bottom",
      layout: "horizontal",
      align: "center",
    },
  };

  const userStatusData = [
    {
      type: "Hoạt động",
      value: Number(userStatus.activeUserPercentage),
    },
    {
      type: "Dừng hoạt động",
      value: Number(userStatus.inactiveUserPercentage),
    },
    {
      type: "Chưa kích hoạt",
      value: Number(userStatus.initialUserPercentage),
    },
    {
      type: "Quên mật khẩu",
      value: Number(userStatus.forgotPasswordUserPercentage),
    },
  ];

  const userStatusConfig = {
    data: userStatusData,
    angleField: "value",
    colorField: "type",
    radius: 1,
    innerRadius: 0,
    radius: 0.8,
    label: {
      type: "inner",
      content: ({ value }) => `${value.toFixed(2)}%`,
    },
    tooltip: {
      formatter: (item) => {
        return { name: item.type, value: `${item.value.toFixed(2)}%` };
      },
    },
    color: ["#6395FA", "#63DAAB", "#F5BF22", "#7666FA"],
    legend: {
      position: "bottom",
      layout: "horizontal",
      align: "center",
    },
  };

  return (
    <>
      {contextHolder}
      <div className={`${styles["dashboard-admin"]}`}>
        <h4 className={`${styles["dashboard-admin__title"]}`}>
          Trang tổng quan
        </h4>
        <Button color="primary" variant="outlined" icon={<PrinterOutlined />}>
          In báo cáo
        </Button>
      </div>
      <Row gutter={[20, 20]} className="mb-4">
        <Col xs={24} sm={12} md={12} lg={6}>
          <StatCard
            title="Tổng người dùng"
            value={userStatistic.totalUsers || 0}
            icon={<UserOutlined />}
            color="#1890ff"
          />
        </Col>
        <Col xs={24} sm={12} md={12} lg={6}>
          <StatCard
            title="Doanh thu (tháng này)"
            value={`${thisMonthProfit.totalProfit} VNĐ`}
            icon={<DollarOutlined />}
            color="#52c41a"
          />
        </Col>
        <Col xs={24} sm={12} md={12} lg={6}>
          <StatCard
            title="Đơn hàng chưa thanh toán"
            value={orderStatistic?.totalUnPaidOrder || 0}
            icon={<ShoppingCartOutlined />}
            color="#faad14"
          />
        </Col>
        <Col xs={24} sm={12} md={12} lg={6}>
          <StatCard
            title="Tour đang khai thác"
            value={tourStatistic.activeTours || 0}
            icon={<InboxOutlined />}
            color="#722ed1"
          />
        </Col>
      </Row>
      <Row gutter={[20, 20]}>
        <Col xs={24} sm={16}>
          <div className={styles["chart-card"]}>
            <div className={`${styles["dashboard-admin__chart-title"]}`}>
              Doanh thu 6 tháng gần nhất
            </div>
            <Line {...profitConfig} />
          </div>
        </Col>
        <Col xs={24} sm={8}>
          <div className={styles["chart-card"]}>
            <div className={`${styles["dashboard-admin__chart-title"]}`}>
              Trạng thái đơn hàng
            </div>
            <Pie {...orderStatusConfig} />
          </div>
        </Col>
      </Row>

      <Row gutter={[20, 20]}>
        <Col xs={24} sm={8}>
          <div className={styles["chart-card"]}>
            <div className={`${styles["dashboard-admin__chart-title"]}`}>
              Trạng thái người dùng
            </div>
            <Pie {...userStatusConfig} />
          </div>
        </Col>
        <Col xs={24} sm={16}>
          <div className={styles["chart-card"]}>
            <div className={`${styles["dashboard-admin__chart-title"]}`}>
              Dư nợ 6 tháng gần nhất
            </div>
            <Line {...debtConfig} />
          </div>
        </Col>
      </Row>
    </>
  );
}

export default Dashboard;
