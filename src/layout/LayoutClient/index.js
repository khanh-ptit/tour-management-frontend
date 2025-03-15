import { useEffect } from "react";
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
          <Outlet />
        </main>
        <Footer />
      </div>
    </>
  );
}

export default LayoutClient;
