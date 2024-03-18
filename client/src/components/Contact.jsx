import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Contact = ({ listing }) => {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState("");
  console.log(landlord);
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
          <Link
            to={`mailto:${landlord.email}?subject=Enquiry for ${listing.title}&body=${message}`}
            className="text-center p-3 bg-slate-700 text-white w-full rounded-lg"
            target="_blank"
          >
            Send message
          </Link>
        </div>
      )}
    </div>
  );
};

export default Contact;
