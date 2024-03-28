import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const LoggedIn = () => {
  const { currentUser } = useSelector((store) => store.user);
  return currentUser ? <Navigate to="/" /> : <Outlet />;
};

export default LoggedIn;
