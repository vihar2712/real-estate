import React from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="mx-auto w-9/12 sm:w-6/12 mt-24 flex flex-col gap-2 text-slate-500">
      <h1 className="text-2xl sm:text-4xl font-bold text-black">
        About Vihar Estate
      </h1>
      <p>
        Vihar Estate is a leading real estate agency that specializes in helping
        clients buy, sell, and rent properties in the most desirable
        neighborhoods. Our team of experienced agents is dedicated to providing
        exceptional service and making the buying and selling process as smooth
        as possible.
      </p>
      <p>
        Our mission is to help our clients achieve their real estate goals by
        providing expert advice, personalized service, and a deep understanding
        of the local market. Whether you are looking to buy, sell, or rent a
        property, we are here to help you every step of the way.
      </p>
      <p>
        Our team of agents has a wealth of experience and knowledge in the real
        estate industry, and we are committed to providing the highest level of
        service to our clients. We believe that buying or selling a property
        should be an exciting and rewarding experience, and we are dedicated to
        making that a reality for each and every one of our clients.
      </p>
      <p> This is a MERN stack project made by me :) - Vihar Shah</p>
      <p className="text-black font-bold">
        Technologies I have used in this project:
      </p>
      <ul className="list-disc px-6 text-slate-700 font-semibold">
        <li>React, Redux for frontend</li>
        <li>Node, Express for backend</li>
        <li>MongoDB for database</li>
        <li>Google OAuth implemented</li>
        <li>Google firebase for storing user and property images</li>
      </ul>
      <ul className="flex gap-4 items-center mb-3">
        My social links:
        <Link to="https://www.linkedin.com/in/vihar-shah-4b63971a9/">
          <FaLinkedin />
        </Link>
        <Link to="https://github.com/vihar2712/real-estate">
          <FaGithub />
        </Link>
      </ul>
    </div>
  );
};

export default About;
