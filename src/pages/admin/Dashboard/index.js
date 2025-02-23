import { useEffect } from "react";

function Dashboard() {
  useEffect(() => {
    document.title = "Trang tổng quan";
  }, []);

  return <>Dashboard</>;
}

export default Dashboard;
