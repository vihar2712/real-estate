import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loading from "../components/Loading";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";

const Listing = () => {
  SwiperCore.use(Navigation);
  const [userListing, setUserListing] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/listing/get/" + params.listingId);
      const data = await res.json();
      if (data.success === false) {
        return;
      }
      setUserListing(data);
    };
    fetchData();
  }, []);
  const params = useParams();
  return (
    <div>
      {userListing ? (
        <Swiper navigation>
          {userListing.imageUrls.map((url) => (
            <SwiperSlide key={url}>
              <div
                className="h-[500px]"
                style={{
                  background: `url(${url}) center no-repeat`,
                  backgroundSize: "cover",
                }}
              ></div>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <Loading />
      )}
    </div>
  );
};

export default Listing;
