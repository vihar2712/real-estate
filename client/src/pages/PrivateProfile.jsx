import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const PrivateProfile = () => {
  const { currentUser } = useSelector((store) => store.user);
  return currentUser ? <Outlet /> : <Navigate to="/sign-in" />;
};

export default PrivateProfile;
