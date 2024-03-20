import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Loading from "../components/Loading";
import { FaCaretDown } from "react-icons/fa";
import ListingCard from "./ListingCard";
import { useSelector } from "react-redux";

const Search = () => {
  const { currentUser } = useSelector((store) => store.user);
  const navigate = useNavigate();
  const [listingResults, setListingResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [formData, setFormData] = useState({
    searchTerm: "",
    type: "all",
    offer: false,
    parking: false,
    furnished: false,
    sort: "createdAt",
    order: "desc",
  });

  const handleChange = (e) => {
    if (e.target.id === "searchTerm") {
      setFormData({ ...formData, searchTerm: e.target.value });
    }

    if (
      e.target.id === "all" ||
      e.target.id === "rent" ||
      e.target.id === "sell"
    ) {
      setFormData({ ...formData, type: e.target.id });
    }

    if (
      e.target.id === "offer" ||
      e.target.id === "parking" ||
      e.target.id === "furnished"
    ) {
      setFormData({
        ...formData,
        [e.target.id]:
          e.target.checked || e.target.checked === "true" ? true : false,
      });
    }
    if (e.target.id === "sort_order") {
      const sort = e.target.value.split("_")[0] || "createdAt";
      const order = e.target.value.split("_")[1] || "desc";
      setFormData({ ...formData, sort, order });
    }
  };

  const onshowMoreClick = async () => {
    const numberOfListings = listingResults.length;
    const startIndex = numberOfListings;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(
      "/api/listing/get?" + searchQuery + "&currentUserId=" + currentUser?._id
    );
    const data = await res.json();
    if (data.length < 9) {
      setShowMore(false);
    }
    setListingResults([...listingResults, ...data]);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const typeFromUrl = urlParams.get("type");
    const offerFromUrl = urlParams.get("offer");
    const parkingFromUrl = urlParams.get("parking");
    const furnishedFromUrl = urlParams.get("furnished");
    const sortFromUrl = urlParams.get("sort");
    const orderFromUrl = urlParams.get("order");
    if (
      searchTermFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      offerFromUrl ||
      furnishedFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setFormData({
        searchTerm: searchTermFromUrl || "",
        type: typeFromUrl || "all",
        offer: offerFromUrl === "true" ? true : false,
        parking: parkingFromUrl === "true" ? true : false,
        furnished: furnishedFromUrl === "true" ? true : false,
        sort: sortFromUrl || "createdAt",
        order: orderFromUrl || "desc",
      });
    }
    const fetchData = async () => {
      const searchQuery = urlParams.toString();
      setLoading(true);
      const res = await fetch(
        "/api/listing/get?" + searchQuery + "&currentUserId=" + currentUser?._id
      );
      const data = await res.json();
      setLoading(false);
      if (data.length > 8) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
      setListingResults(data);
    };
    fetchData();
  }, [location.search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", formData.searchTerm);
    urlParams.set("type", formData.type);
    urlParams.set("offer", formData.offer);
    urlParams.set("parking", formData.parking);
    urlParams.set("furnished", formData.furnished);
    urlParams.set("sort", formData.sort);
    urlParams.set("order", formData.order);
    const searchQuery = urlParams.toString();
    navigate("/search?" + searchQuery);
  };
  return (
    <div className="p-4 flex flex-col md:flex-row gap-4">
      <form
        className="flex flex-col gap-7 text-md sm:border-r-2 md:min-h-screen p-3"
        onSubmit={handleSubmit}
      >
        <div className="flex gap-2 items-center">
          <label>Search Term:</label>
          <input
            type="text"
            placeholder="Search..."
            id="searchTerm"
            className="p-3 rounded-lg w-2/3"
            onChange={handleChange}
            value={formData.searchTerm}
          />
        </div>
        <div className="flex gap-3 flex-wrap">
          <h1>Type:</h1>
          <div className="flex gap-1 items-center">
            <input
              type="checkbox"
              className="w-5 h-5"
              id="all"
              onChange={handleChange}
              checked={formData.type === "all"}
            />
            <label>Rent & Sale</label>
          </div>
          <div className="flex gap-1 items-center">
            <input
              type="checkbox"
              className="w-5 h-5"
              id="rent"
              onChange={handleChange}
              checked={formData.type === "rent"}
            />
            <label>Rent</label>
          </div>
          <div className="flex gap-1 items-center">
            <input
              type="checkbox"
              className="w-5 h-5"
              id="sell"
              onChange={handleChange}
              checked={formData.type === "sell"}
            />
            <label>Sale</label>
          </div>
          <div className="flex gap-1 items-center">
            <input
              type="checkbox"
              className="w-5 h-5"
              id="offer"
              onChange={handleChange}
              checked={formData.offer}
            />
            <label>Offer</label>
          </div>
        </div>
        <div className="flex gap-3 flex-wrap">
          <h1 className="font-semibold">Amenities:</h1>
          <div className="flex gap-1 items-center">
            <input
              type="checkbox"
              className="w-5 h-5"
              id="parking"
              onChange={handleChange}
              checked={formData.parking}
            />
            <label>Parking</label>
          </div>
          <div className="flex gap-1 items-center">
            <input
              type="checkbox"
              className="w-5 h-5"
              id="furnished"
              onChange={handleChange}
              checked={formData.furnished}
            />
            <label>Furnished</label>
          </div>
        </div>
        <div className="flex gap-3 items-center">
          <label>Sort:</label>
          <select
            className="p-2 rounded-lg"
            id="sort_order"
            defaultValue="createdAt_desc"
            onChange={handleChange}
          >
            <option value="regularPrice_desc">Price high to low</option>
            <option value="regularPrice_asc">Price low to high</option>
            <option value="createdAt_desc">Latest</option>
            <option value="createdAt_asc">Oldest</option>
          </select>
        </div>
        <button className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95">
          Search
        </button>
      </form>
      <div className="sm:w-10/12 mx-auto">
        <h1 className="text-3xl text-slate-700 border-b-2 p-2 mt-2 text-center md:text-left ">
          Listing Results:
        </h1>
        <div className="flex flex-wrap gap-7 mt-10 rounded-lg justify-center md:justify-normal">
          {loading && <Loading />}
          {listingResults.length > 0 ? (
            listingResults.map((listing) => (
              <Link key={listing._id} to={"/listing/" + listing._id}>
                <ListingCard listing={listing} />
              </Link>
            ))
          ) : (
            <h1>No results found!!</h1>
          )}
        </div>
        {showMore && (
          <div className="flex gap-1 items-center text-orange-700 hover:underline my-4 text-lg">
            <button onClick={() => onshowMoreClick()}>Show more</button>
            <FaCaretDown />
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
