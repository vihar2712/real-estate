import React from "react";
import { Link } from "react-router-dom";
import ListingCard from "./ListingCard";

const HomeListing = ({ listings, text }) => {
  return (
    <div className="px-48 flex flex-col gap-4 mt-10">
      <h1 className="text-slate-600 font-semibold text-2xl">Recent {text}</h1>
      <Link
        to={"/search?offer=true"}
        className="text-blue-800 text-sm hover:underline -mt-5"
      >
        Show more {text}
      </Link>
      <div className="flex flex-wrap gap-7">
        {listings?.map((listing) => (
          <Link key={listing._id} to={"/listing/" + listing._id}>
            <ListingCard listing={listing} />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default HomeListing;
