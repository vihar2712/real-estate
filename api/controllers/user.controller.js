import Listing from "../models/listing.model.js";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";

export const test = (req, res) => {
  res.send("inside user route through user controller");
};

export const updateUser = async (req, res, next) => {
  // checked if user is authorized to update for that, the access token needs to be verified

  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "You can update only your own account"));

  try {
    // user wants to change the password, we can not directly update the password, we need to hash it and then update
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }
    if (!req.body.username || !req.body.email)
      return next(errorHandler(401, "Something went wrong"));

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          //The set operator replaces the value of a field with the specified value.
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true } // return and save the updated user
    );
    const { password, ...restInfo } = updatedUser._doc;
    res.status(200).json(restInfo);
  } catch (error) {
    if (error.keyValue?.username)
      return next(
        errorHandler(
          400,
          req.body.username + " already exists. Please try again."
        )
      );
    else if (error.keyValue?.email)
      return next(
        errorHandler(400, req.body.email + " already exists. Please try again.")
      );
    else next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    if (req.user.id !== req.params.id)
      return next(errorHandler(401, "You can only delete your own account."));

    await User.findByIdAndDelete(req.params.id);

    res.clearCookie("access_token");
    res.status(200).json("User deleted successfully");
  } catch (error) {
    next(error);
  }
};

export const showListings = async (req, res, next) => {
  if (req.user.id === req.params.id) {
    try {
      const listings = await Listing.find({ userRef: req.params.id });
      res.status(200).json(listings);
    } catch (error) {
      next(error);
    }
  } else {
    next(errorHandler(401, "You can only get your own listings"));
  }
};

export const getUser = async (req, res, next) => {
  // user of id will be passed as parameter
  if (!req.params.id) return next(errorHandler(404, "User not found"));
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const deleteUserListings = async (req, res, next) => {
  // if user deletes account, associated listings should also be deleted
  try {
    await Listing.deleteMany({ userRef: req.user.id });

    next();
  } catch (error) {
    next(error);
  }
};
