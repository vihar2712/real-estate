import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  const hashPassword = bcryptjs.hashSync(password);
  const newUser = new User({ username, email, password: hashPassword });
  const { password: pass, ...restInfo } = newUser._doc;

  try {
    await newUser.save();
    // res.status(201).json("user created successfully");
    res.status(201).json(restInfo);
  } catch (err) {
    if (err.code === 11000) {
      return next(errorHandler(404, "User already exists"));
    }
    next(err);
    // next(errorHandler(555,'custom error using error handler function'));
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  const validUser = await User.findOne({ email });
  if (!validUser) return next(errorHandler(401, "user not found"));
  const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET_KEY);
  const validPassword = bcryptjs.compareSync(password, validUser.password);
  if (!validPassword) return next(errorHandler(401, "Wrong credentials"));
  const { password: pass, ...restInfo } = validUser._doc;

  res
    .cookie("access_token", token, { httpOnly: true }) //maxAge is a convenience option that sets expires relative to the current time in milliseconds.
    .status(200)
    .json(restInfo);
};
