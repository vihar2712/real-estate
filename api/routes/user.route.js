import express from "express";
import {
  deleteUser,
  deleteUserListings,
  getUser,
  showListings,
  test,
  updateUser,
} from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.get("/test", test);
router.post("/update/:id", verifyToken, updateUser);
router.delete("/delete/:id", verifyToken, deleteUserListings, deleteUser);
router.get("/listings/:id", verifyToken, showListings);
router.get("/:id", verifyToken, getUser);

export default router;
