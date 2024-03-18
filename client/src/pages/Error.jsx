import React from "react";
import { Link } from "react-router-dom";

const Error = ({ message }) => {
  return (
    <div className=" text-2xl text-red-700 h-full w-full flex flex-col gap-4 justify-center items-center absolute z-0 top-0 left-0 bg-gray-100">
      <h1>Oops!! {message}...</h1>
      <Link
        to="/home"
        className="bg-green-700 text-white p-3 rounded-lg text-xl hover:opacity-95"
      >
        Go to Homepage
      </Link>
    </div>
  );
};

export default Error;
