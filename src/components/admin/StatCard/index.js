// components/admin/StatCard.js
import { Card } from "antd";
import {
  UserOutlined,
  DollarOutlined,
  ShoppingCartOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import styles from "./StatCard.module.scss";

function StatCard({ title, value, icon, color }) {
  return (
    <Card className={styles["stat-card"]}>
      <div className={styles["stat-card__content"]}>
        <div>
          <h3 className={styles["stat-card__value"]}>{value}</h3>
          <p className={styles["stat-card__title"]}>{title}</p>
        </div>
        <div className={styles["stat-card__icon"]} style={{ color }}>
          {icon}
        </div>
      </div>
    </Card>
  );
}

export default StatCard;
