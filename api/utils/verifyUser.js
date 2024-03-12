import jwt from "jsonwebtoken";
import { errorHandler } from "./error.js";

export const verifyToken = (req, res, next) => {
  // check the access token from cookie, for that we need to install cookie-parser package.

  const token = req.cookies.access_token;

  if (!token) return next(errorHandler(401, "Unauthorized"));

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) return next(errorHandler(403, "Forbidden"));

    // console.log(user);
    req.user = user;
    next();
  });
};
