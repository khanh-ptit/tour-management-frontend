import { useEffect, useState } from "react";
import Header from "../../components/client/Header";
import favicon from "../../images/client/favTopTenTravel.png";
import Footer from "../../components/client/Footer";
import { useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";
import "./LayoutClient.scss";
import { getDestination } from "../../services/client/home.service";
import {
  setDestinationsDispatch,
  setForeginDestinationsDispatch,
} from "../../actions/destination";
import ChatPopup from "../../components/client/ChatPopup";
import { MessageOutlined } from "@ant-design/icons";
import { FloatButton, Popover } from "antd";

function LayoutClient() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    if (document.title !== "Giỏ hàng") {
      document.title = "Top Ten Travel - Vòng quanh thế giới";
    }

    const link = document.querySelector("link[rel~='icon']");
    if (link) {
      link.href = favicon;
    } else {
      const newLink = document.createElement("link");
      newLink.rel = "icon";
      newLink.href = favicon;
      document.head.appendChild(newLink);
    }
  }, []);

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchDestinations = async () => {
      const result = await getDestination("tour-nuoc-ngoai");
      const result1 = await getDestination("tour-trong-nuoc");
      dispatch(setDestinationsDispatch(result1.totalDestinations));
      dispatch(setForeginDestinationsDispatch(result.totalDestinations));
    };
    fetchDestinations();
  }, []);

  return (
    <>
      <div className="layout-client">
        <Header />
        <main className="layout-main">
          <Outlet context={{ setIsChatOpen }} />
        </main>
        <Footer />
        {/* Nút mở chat */}
        {/* Popover chứa nội dung chat */}
        <Popover
          content={<ChatPopup />}
          title="Chat Hỗ Trợ"
          trigger="click"
          open={isChatOpen}
          onOpenChange={(open) => setIsChatOpen(open)}
          placement="top"
        >
          {/* FloatButton mở Popover */}
          <FloatButton
            icon={<MessageOutlined />}
            type="primary"
            style={{ right: 24, bottom: 24, height: "50px", width: "50px" }}
          />
        </Popover>
      </div>
    </>
  );
}

export default LayoutClient;
