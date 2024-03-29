import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

const createToken = (validUser, res) => {
  const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET_KEY); // creates a new token from (the _id of user + secret key)
  res.cookie("access_token", token, { httpOnly: true }); //maxAge is a convenience option that sets expires relative to the current time in milliseconds.
};

export const signUp = async (req, res, next) => {
  const { username, email, password, photo } = req.body; // photo will be default if not signed up using google auth
  const hashPassword = bcryptjs.hashSync(password);
  const newUser = new User({
    username,
    email,
    password: hashPassword,
    avatar: photo,
  });
  createToken(newUser, res);
  const { password: pass, ...restInfo } = newUser._doc;

  try {
    await newUser.save();
    // console.log("user created successfully");
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

export const signIn = async (req, res, next) => {
  const { email, password } = req.body;
  const validUser = await User.findOne({ email });
  if (!validUser) return next(errorHandler(401, "user not found"));
  const validPassword = bcryptjs.compareSync(password, validUser.password);
  if (!validPassword) return next(errorHandler(401, "Wrong credentials"));

  createToken(validUser, res);
  const { password: pass, ...restInfo } = validUser._doc;
  res.status(200).json(restInfo);
};

export const google = async (req, res, next) => {
  // in case of authentication with google auth, there is no password involved and so we have to modify the logic accordingly
  // check if user exists
  const user = await User.findOne({ email: req.body.email });
  if (user) {
    // user exists
    // sign in logic without password so just creating a fresh token for the user
    createToken(user, res);
    const { password: pass, ...restInfo } = user._doc;
    res.status(200).json(restInfo);
  } else {
    // user does not exist
    // create a new user
    req.body.username =
      req.body.username.split(" ").join("").toLowerCase() +
      Math.random().toString(36).slice(-4);
    const dummyPassword =
      Math.random().toString(36).slice(-8) +
      Math.random().toString(36).slice(-8);
    req.body.password = dummyPassword;
    await signUp(req, res, next);
  }
};

export const signOut = async (req, res, next) => {
  try {
    res.clearCookie("access_token");
    res.status(200).json("user has been signed out");
  } catch (error) {
    next(error);
  }
};
