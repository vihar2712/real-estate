import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

mongoose
  .connect(process.env.MONGO_CONNECTION_STRING)
  .then(() => {
    console.log("database connection established");
  })
  .catch((err) => {
    console.log("error connecting to database", err);
  });

const app = express();

app.listen(3000, () => {
  console.log("server listening on port 3000!!");
});
