import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css/bundle";
import "swiper/css/autoplay";
import ListingCard from "./ListingCard";

const Home = () => {
  SwiperCore.use([Navigation, Autoplay]);
  const [offerListings, setOfferListings] = useState(null);
  const [rentListings, setRentListings] = useState(null);
  const [saleListings, setSaleListings] = useState(null);
  useEffect(() => {
    const fetchOfferListings = async () => {
      const res = await fetch("/api/listing/get?offer=true&limit=4");
      const data = await res.json();
      setOfferListings(data);
    };
    fetchOfferListings();

    const fetchRentListings = async () => {
      const res = await fetch("/api/listing/get?type=rent&limit=4");
      const data = await res.json();
      setRentListings(data);
    };
    const fetchSaleListings = async () => {
      const res = await fetch("/api/listing/get?type=sell&limit=4");
      const data = await res.json();
      setSaleListings(data);
    };

    fetchRentListings();
    fetchSaleListings();
  }, []);
  return (
    <div>
      <div className="px-48 py-24 flex flex-col gap-5">
        <h1 className="text-6xl text-slate-700 font-bold">
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
        <div className="px-48 flex flex-col gap-4 mt-10">
          <h1 className="text-slate-600 font-semibold text-2xl">
            Recent offers
          </h1>
          <Link
            to={"/search?offer=true"}
            className="text-blue-800 text-sm hover:underline -mt-5"
          >
            Show more offers
          </Link>
          <div className="flex flex-wrap gap-7">
            {offerListings?.map((listing) => (
              <Link key={listing._id} to={"/listing/" + listing._id}>
                <ListingCard listing={listing} />
              </Link>
            ))}
          </div>
        </div>
        <div className="px-48 flex flex-col gap-4 mt-10">
          <h1 className="text-slate-600 font-semibold text-2xl">
            Recent places for rent
          </h1>
          <Link
            to={"/search?type=rent"}
            className="text-blue-800 text-sm hover:underline -mt-5"
          >
            Show more places for rent
          </Link>
          <div className="flex flex-wrap gap-7">
            {rentListings?.map((listing) => (
              <Link key={listing._id} to={"/listing/" + listing._id}>
                <ListingCard listing={listing} />
              </Link>
            ))}
          </div>
        </div>
        <div className="px-48 flex flex-col gap-4 mt-10">
          <h1 className="text-slate-600 font-semibold text-2xl">
            Recent places for sale
          </h1>
          <Link
            to={"/search?type=sell"}
            className="text-blue-800 text-sm hover:underline -mt-5"
          >
            Show more places for sale
          </Link>
          <div className="flex flex-wrap gap-7">
            {saleListings?.map((listing) => (
              <Link key={listing._id} to={"/listing/" + listing._id}>
                <ListingCard listing={listing} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
