import React from "react";
import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Header = () => {
  const { currentUser } = useSelector((store) => store.user);

  return (
    <header className="p-3 bg-slate-200 shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto">
        <Link to="/">
          <h1>
            <span className="text-slate-500 font-bold text-xl">Vihar</span>
            <span className="text-slate-700 font-bold text-xl">Estate</span>
          </h1>
        </Link>
        <form className="flex items-center p-3 bg-slate-100 rounded-md">
          <input
            type="text"
            className="bg-transparent focus:outline-none w-64"
            placeholder="Search..."
          />
          <FaSearch className="hover:cursor-pointer" />
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
