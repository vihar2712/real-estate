import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";

export const createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);

    return res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};

export const deleteListing = async (req, res, next) => {
  try {
    try {
      const listing = await Listing.findById(req.params.id);
    } catch (error) {
      next(errorHandler(404, "No such listing found"));
    }
    const listing = await Listing.findById(req.params.id);
    if (req.user.id !== listing.userRef)
      return next(errorHandler(401, "You can delete only your own listings"));

    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json("listing has been deleted successfully");
  } catch (error) {
    next(error);
  }
};

export const updateListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return next(errorHandler(404, "No such listing found"));

    if (req.user.id !== listing.userRef)
      return next(errorHandler(401, "You can edit only your own listing"));

    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedListing);
  } catch (error) {
    next(error);
  }
};

export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return next(errorHandler(404, "No such listing found"));

    res.status(200).json(listing);
  } catch (error) {}
};
