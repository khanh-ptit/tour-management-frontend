import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import bookingLogo from "../../../images/client/Booking.com-Logo.wine.png";
import vjAirLogo from "../../../images/client/logo-viet-jet.jpeg";
import travelLokaLogo from "../../../images/client/logo-travel-loka.webp";
import trivagoLogo from "../../../images/client/logo-trivago.png";
import vnAirlineLogo from "../../../images/client/Vietnam_Airlines_logo.svg.png";
import dhlLogo from "../../../images/client/DHL_Logo.svg.png";
import vnpayLogo from "../../../images/client/vnpay-logo.png";
import "./Sponsor.scss";

const sponsors = [
  { id: 1, img: bookingLogo, alt: "Booking.com" },
  { id: 2, img: vjAirLogo, alt: "VietJet Air" },
  { id: 3, img: travelLokaLogo, alt: "Travel Loka" },
  { id: 4, img: trivagoLogo, alt: "Trivago" },
  { id: 5, img: vnAirlineLogo, alt: "Vietnam Airline" },
  { id: 6, img: dhlLogo, alt: "DHL" },
  { id: 7, img: vnpayLogo, alt: "VN pay" },
];

function Sponsor() {
  return (
    <>
      <Swiper
        className="sponsor-swiper"
        modules={[Autoplay, Pagination]}
        loop={true}
        speed={600}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        breakpoints={{
          320: { slidesPerView: 2, spaceBetween: 40 },
          480: { slidesPerView: 3, spaceBetween: 60 },
          640: { slidesPerView: 4, spaceBetween: 80 },
          992: { slidesPerView: 6, spaceBetween: 120 },
        }}
      >
        {sponsors.map((sponsor) => (
          <SwiperSlide key={sponsor.id} className="sponsor-item">
            <img src={sponsor.img} alt={sponsor.alt} className="sponsor-img" />
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
}

export default Sponsor;
