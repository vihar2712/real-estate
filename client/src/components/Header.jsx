import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Header = () => {
  const navigate = useNavigate();
  const { currentUser } = useSelector((store) => store.user);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    console.log(searchQuery);
    navigate("/search?" + searchQuery);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  return (
    <header className="p-3 bg-slate-200 shadow-md relative z-50">
      <div className="flex justify-between items-center max-w-6xl mx-auto">
        <Link to="/">
          <h1>
            <span className="text-slate-500 font-bold text-xl">Vihar</span>
            <span className="text-slate-700 font-bold text-xl">Estate</span>
          </h1>
        </Link>
        <form
          className="flex items-center p-3 bg-slate-100 rounded-md"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            className="bg-transparent focus:outline-none w-64"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button>
            <FaSearch />
          </button>
        </form>
        <ul className="flex items-center gap-4">
          <Link to="/">
            <li className="hover:underline ">Home</li>
          </Link>
          <Link to="/about">
            {" "}
            <li className="hover:underline ">About</li>
          </Link>
          <Link to="/profile">
            {currentUser ? (
              <li>
                <img
                  src={currentUser.avatar}
                  alt="profile"
                  className="rounded-full h-8 w-8"
                />
              </li>
            ) : (
              <li className="hover:underline ">Sign In</li>
            )}
          </Link>
        </ul>
      </div>
    </header>
  );
};

export default Header;
