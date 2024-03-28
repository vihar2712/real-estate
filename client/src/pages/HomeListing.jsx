import React from "react";
import { Link } from "react-router-dom";
import ListingCard from "./ListingCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import SwiperCore from "swiper";
import "swiper/css/bundle";
import "swiper/css/autoplay";
import { useMediaQuery } from "react-responsive";

const HomeListing = ({ listings, title, searchQuery, errorMsg }) => {
  SwiperCore.use([Navigation, Autoplay]);
  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-width: 1428px)",
  });
  const isBigScreen = useMediaQuery({
    query: "(min-width: 1224px)",
  });
  const isTablet = useMediaQuery({
    query: "(min-width: 768px)",
  });
  // console.log("Before: ", listings);
  const chunkSize = isDesktopOrLaptop ? 4 : isBigScreen ? 3 : isTablet ? 2 : 1;
  const newChunk = [];
  if (listings) {
    for (let i = 0; i < listings.length; i += chunkSize) {
      const chunk = listings.slice(i, i + chunkSize);
      newChunk.push(chunk);
    }
  }
  return (
    <div className="m-2 mx-auto flex flex-col gap-4 mt-10">
      <h1 className="text-slate-600 font-semibold text-2xl px-5 sm:px-16">
        {title}
      </h1>
      {searchQuery && (
        <Link
          to={"/search?" + searchQuery}
          className="text-blue-800 text-sm hover:underline -mt-5 px-5 sm:px-16 w-fit"
        >
          Show more....
        </Link>
      )}
      {/* <Chunk array={listings} size={4} /> */}
      {listings && listings.length > 0 ? (
        <Swiper navigation className="w-full">
          {newChunk?.map((listings, index) => (
            <SwiperSlide
              key={index}
              className={
                "flex gap-6 sm:px-16 " +
                (listings.length === chunkSize
                  ? "justify-center"
                  : "justify-normal")
              }
            >
              {listings.map((listing) => (
                <Link to={"/listing/" + listing._id} key={listing._id}>
                  <ListingCard listing={listing} />
                </Link>
              ))}
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <div className="pl-5 sm:px-16 flex flex-col gap-3">
          {errorMsg.msg2 && (
            <p className="sm:text-lg text-orange-700 font-semibold">
              {errorMsg.msg2}
            </p>
          )}
          <Link
            to={"/" + errorMsg.link}
            className="sm:text-lg bg-slate-700 text-white p-2 font-semibold hover:opacity-90 w-fit rounded-lg"
          >
            {errorMsg.msg1}
          </Link>
        </div>
      )}
    </div>
  );
};

export default HomeListing;
