import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Loading from "../components/Loading";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css/autoplay";
import "swiper/css/bundle";
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkerAlt,
  FaParking,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import Contact from "../components/Contact";
import Error from "./Error";

const Listing = () => {
  const { currentUser } = useSelector((store) => store.user);
  const [userListing, setUserListing] = useState(null);
  // console.log(userListing);
  const [contact, setContact] = useState(false);
  SwiperCore.use(Navigation);
  SwiperCore.use(Autoplay);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/listing/get/" + params.listingId);
        const data = await res.json();
        if (data.success === false) {
          setUserListing("incorrect");
          return;
        }
        setUserListing(data);
      } catch (error) {
        setUserListing("incorrect");
      }
    };
    fetchData();
  }, []);
  const params = useParams();
  return (
    <div>
      {userListing ? (
        userListing !== "incorrect" ? (
          <div>
            <Swiper navigation autoplay>
              {userListing.imageUrls.map((url) => (
                <SwiperSlide key={url}>
                  <div
                    className="h-[450px]"
                    style={{
                      background: `url(${url}) center no-repeat`,
                      backgroundSize: "cover",
                    }}
                  ></div>
                </SwiperSlide>
              ))}
            </Swiper>
            <div className="sm:w-9/12 md:w-6/12 mx-auto flex flex-col gap-2 p-4 relative">
              {userListing.userRef === currentUser?._id && (
                <div className="absolute z-20 -top-14 right-2  md:-top-10 md:-left-32 h-20 w-20 sm:h-32 sm:w-32 font-semibold flex flex-col items-center justify-center bg-orange-700 rounded-full p-6">
                  <h1 className="text-center text-white text-xs sm:text-lg">
                    Posted by YOU
                  </h1>
                  <Link
                    to={"/update-listing/" + userListing._id}
                    className="text-gray-300 hover:underline text-xs sm:text-lg"
                  >
                    Update!
                  </Link>
                </div>
              )}
              <h1 className="sm:text-lg font-semibold mt-3">
                {userListing.title}
                <span>
                  {" "}
                  - ₹{" "}
                  {userListing.discountPrice > 0
                    ? userListing.discountPrice.toLocaleString("en-IN")
                    : userListing.regularPrice.toLocaleString("en-IN")}
                  {userListing.type === "sell" ? "" : "/ month"}
                </span>
                <br />
                {userListing.discountPrice > 0 && (
                  <span className="text-sm line-through text-orange-700 ">
                    (Original Price: ₹
                    {userListing.regularPrice.toLocaleString("en-IN")})
                  </span>
                )}
              </h1>
              <span className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-orange-700" />
                {userListing.address}
              </span>
              <div className="flex gap-6">
                <span className="bg-orange-900 text-white p-1 sm:p-3 md:py-2 md:px-10 rounded-md">
                  For {userListing.type === "rent" ? "Rent" : "Sale"}
                </span>
                {+userListing.regularPrice - +userListing.discountPrice > 0 &&
                  userListing.discountPrice > 0 && (
                    <span className="bg-green-900 text-white p-1 sm:p-3 md:py-2 md:px-10 rounded-md">
                      ₹
                      {(
                        +userListing.regularPrice - +userListing.discountPrice
                      ).toLocaleString("en-IN")}{" "}
                      discount
                    </span>
                  )}
              </div>
              <div>
                <span className="font-semibold text-black">Description - </span>
                <span className="text-slate-700 text-pretty">
                  {userListing.description}
                </span>
              </div>
              <ul className="flex gap-2 sm:gap-4 md:gap-6 flex-wrap">
                <li className="flex gap-1 items-center">
                  <FaBed className="text-orange-700" />
                  {userListing.bedrooms}
                  {userListing.bedrooms > 1 ? " beds" : " bed"}
                </li>
                <li className="flex gap-1 items-center">
                  <FaBath className="text-orange-700" />
                  {userListing.bathrooms}
                  {userListing.bathrooms > 1 ? " baths" : " bath"}
                </li>
                <li className="flex gap-1 items-center">
                  <FaParking className="text-orange-700" />
                  {userListing.parking ? "Parking Spot" : "No parking"}
                </li>
                <li className="flex gap-1 items-center">
                  <FaChair className="text-orange-700" />
                  {userListing.furnished ? "Furnished" : "Not Furnished"}
                </li>
              </ul>
              {currentUser ? (
                currentUser._id !== userListing.userRef &&
                !contact && (
                  <button
                    className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95"
                    onClick={() => setContact(true)}
                  >
                    Contact landlord
                  </button>
                )
              ) : (
                <Link
                  to={"/sign-in"}
                  className="text-lg bg-blue-800 text-white p-3 rounded-lg hover:opacity-90 w-fit"
                >
                  Sign in to contact landlord
                </Link>
              )}
              {currentUser && contact && (
                <Contact
                  listing={userListing}
                  visibleFn={() => setContact(false)}
                />
              )}
            </div>
          </div>
        ) : (
          <Error message="No such listing in our database exists" />
        )
      ) : (
        <Loading />
      )}
    </div>
  );
};

export default Listing;
