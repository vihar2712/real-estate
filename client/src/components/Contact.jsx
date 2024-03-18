import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Contact = ({ listing, visibleFn }) => {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState("");
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/user/" + listing.userRef);
        const data = await res.json();
        setLandlord(data);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchUser();
  }, []);
  return (
    <div>
      {landlord && (
        <div className="flex flex-col gap-4">
          <p>
            Contact <span className="font-semibold">{landlord.username}</span>{" "}
            for <span className="font-semibold">{listing.title} </span>
          </p>
          <textarea
            rows="3"
            cols="90"
            onChange={(e) => setMessage(e.target.value)}
          >
            {message}
          </textarea>
          <div className="grid grid-cols-2 gap-2">
            <Link
              to={`mailto:${landlord.email}?subject=Enquiry for ${listing.title}&body=${message}`}
              className="text-center p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 col-span-1"
              target="_blank"
              aria-required
            >
              Send message
            </Link>
            <button
              className="bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95 col-span-1"
              onClick={() => visibleFn()}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contact;
