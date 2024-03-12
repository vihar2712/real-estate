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
    next(error);
  }
};
