import React from "react";
import { Link } from "react-router-dom";
import ListingCard from "./ListingCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import SwiperCore from "swiper";
import "swiper/css/bundle";
import "swiper/css/autoplay";
import { useMediaQuery } from "react-responsive";

const HomeListing = ({ listings, text, searchQuery }) => {
  SwiperCore.use([Navigation, Autoplay]);
  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-width: 1224px)",
  });
  const isTablet = useMediaQuery({
    query: "(min-width: 768px)",
  });
  // console.log("Before: ", listings);
  const chunkSize = isDesktopOrLaptop ? 4 : isTablet ? 2 : 1;
  console.log(chunkSize);
  const newChunk = [];
  for (let i = 0; i < listings.length; i += chunkSize) {
    const chunk = listings.slice(i, i + chunkSize);
    newChunk.push(chunk);
  }
  return (
    <div className="m-2 mx-auto flex flex-col gap-4 mt-10">
      <h1 className="text-slate-600 font-semibold text-2xl px-16">
        Recent {text}
      </h1>
      <Link
        to={"/search?" + searchQuery}
        className="text-blue-800 text-sm hover:underline -mt-5 px-16"
      >
        Show more {text}
      </Link>
      {/* <Chunk array={listings} size={4} /> */}
      <Swiper navigation className="w-full">
        {newChunk?.map((listings, index) => (
          <SwiperSlide key={index} className="flex gap-6 px-4 sm:px-16">
            {listings.map((listing) => (
              <Link to={"/listing/" + listing._id} key={listing._id}>
                <ListingCard listing={listing} />
              </Link>
            ))}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HomeListing;
