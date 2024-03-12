import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const LoggedIn = () => {
  const { currentUser } = useSelector((store) => store.user);
  return currentUser ? <Navigate to="/profile" /> : <Outlet />;
};

export default LoggedIn;
