import { useEffect } from "react";
import Header from "../../components/client/Header";
import favicon from "../../images/client/favTopTenTravel.png";
import Footer from "../../components/client/Footer";
import "./LayoutClient.scss";
import { Outlet } from "react-router-dom";

function LayoutClient() {
  useEffect(() => {
    document.title = "Top Ten Travel - Vòng quanh thế giới";

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

  return (
    <>
      <div className="layout-client">
        <Header />
        <main className="layout-main">
          <Outlet />
        </main>
        <Footer />
      </div>
    </>
  );
}

export default LayoutClient;
