import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css/bundle";
import "swiper/css/autoplay";
import HomeListing from "./HomeListing";
import { useSelector } from "react-redux";

const Home = () => {
  const { currentUser } = useSelector((store) => store.user);
  SwiperCore.use([Navigation, Autoplay]);
  const [offerListings, setOfferListings] = useState(null);
  const [rentListings, setRentListings] = useState(null);
  const [saleListings, setSaleListings] = useState(null);

  let allListings = null;
  if (offerListings && rentListings && saleListings) {
    allListings = [
      {
        type: offerListings,
        text: "offers",
        searchQuery: "offer=true",
      },
      {
        type: rentListings,
        text: "places for rent",
        searchQuery: "type=rent",
      },
      {
        type: saleListings,
        text: "places for sale",
        searchQuery: "type=sell",
      },
    ];
  }
  useEffect(() => {
    const fetchOfferListings = async () => {
      const res = await fetch(
        "/api/listing/get?offer=true&limit=4&currentUserId=" + currentUser?._id
      );
      const data = await res.json();
      setOfferListings(data);
    };
    fetchOfferListings();

    const fetchRentListings = async () => {
      const res = await fetch(
        "/api/listing/get?type=rent&limit=4&currentUserId=" + currentUser?._id
      );
      const data = await res.json();
      setRentListings(data);
    };
    const fetchSaleListings = async () => {
      const res = await fetch(
        "/api/listing/get?type=sell&limit=4&currentUserId=" + currentUser?._id
      );
      const data = await res.json();
      setSaleListings(data);
    };

    fetchRentListings();
    fetchSaleListings();
  }, []);
  return (
    <div>
      <div className=" py-16 w-full sm:w-6/12 md:w-9/12 flex flex-col gap-5 mx-auto text-center sm:text-left">
        <h1 className="text-3xl md:text-5xl lg:text-6xl text-slate-700 font-bold">
          Find your next <span className="text-slate-500">perfect</span>
          <br /> place with ease
        </h1>
        <p className="text-gray-400 text-sm">
          Vihar Estate will help you find your home fast, easy and comfortable.
          <br />
          Our expert support is always available.
        </p>
        <Link
          to={"/search"}
          className="text-blue-800 hover:underline font-bold"
        >
          Let's Start now...
        </Link>
      </div>
      <Swiper navigation autoplay className="mt-5">
        {offerListings?.map((listing) => (
          <SwiperSlide key={listing._id}>
            <div
              className="h-[500px]"
              style={{
                background: `url(${listing.imageUrls[0]}) center no-repeat`,
                backgroundSize: "cover",
              }}
            ></div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="py-10">
        {allListings?.map((listing) => (
          <HomeListing
            key={listing.text}
            listings={listing.type}
            text={listing.text}
            searchQuery={listing.searchQuery}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
