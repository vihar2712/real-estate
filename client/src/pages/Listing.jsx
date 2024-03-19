import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
  console.log(userListing);
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
                    className="h-[400px]"
                    style={{
                      background: `url(${url}) center no-repeat`,
                      backgroundSize: "cover",
                    }}
                  ></div>
                </SwiperSlide>
              ))}
            </Swiper>
            <div className="w-6/12 mx-auto flex flex-col gap-2 p-4">
              <h1 className="text-lg font-semibold my-3">
                {userListing.title}
                <span>
                  {" "}
                  - ${" "}
                  {userListing.discountPrice > 0
                    ? userListing.discountPrice.toLocaleString("en-US")
                    : userListing.regularPrice.toLocaleString("en-US")}
                  {userListing.type === "sell" ? "" : "/ month"}
                </span>
              </h1>
              <span className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-orange-700" />
                {userListing.address}
              </span>
              <div className="flex gap-6">
                <span className="bg-orange-900 text-white py-2 px-10 rounded-md">
                  For {userListing.type === "rent" ? "Rent" : "Sale"}
                </span>
                {+userListing.regularPrice - +userListing.discountPrice > 0 &&
                  userListing.discountPrice > 0 && (
                    <span className="bg-green-900 text-white py-2 px-10 rounded-md">
                      $
                      {(
                        +userListing.regularPrice - +userListing.discountPrice
                      ).toLocaleString("en-US")}{" "}
                      discount
                    </span>
                  )}
              </div>
              <p className="text-slate-700">
                <span className="font-semibold text-black">Description - </span>
                {userListing.description}
              </p>
              <ul className="flex gap-6 flex-wrap">
                <li className="flex gap-1 items-center">
                  <FaBed className="text-orange-700" />
                  {userListing.bedrooms}
                  {userListing.bedrooms > 1 ? " beds" : "bed"}
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
              {currentUser &&
                currentUser._id !== userListing.userRef &&
                !contact && (
                  <button
                    className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95"
                    onClick={() => setContact(true)}
                  >
                    Contact landlord
                  </button>
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
