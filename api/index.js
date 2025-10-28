import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoute from "./routes/user.route.js";
import authRoute from "./routes/auth.route.js";
import listingRoute from "./routes/listing.route.js";
import cookieParser from "cookie-parser";
import path from "path";
import cors from "cors";

dotenv.config();

mongoose
  .connect(process.env.MONGO_CONNECTION_STRING)
  .then(() => {
    console.log("database connection established");
  })
  .catch((err) => {
    console.log("error connecting to database", err);
  });

const __dirname = path.resolve();

const app = express();
app.use(express.json()); // by default we are not allowed to send any JSON data to the server. this line helps with that

app.use(cookieParser()); // used to get the access token from the cookie which is stored once user signs-in.

app.use(cors({
  origin: [process.env.APP_BACKEND_URL],
  credentials: true,
}));

app.listen(3010, (req, res) => {
  console.log("server listening on port 3010!!");
});

app.use("/api/user", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/listing", listingRoute);

// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, "client/dist")));
//   app.get("*", (req, res) => {
//     res.sendFile(
//       path.resolve(__dirname, "client", "dist", "index.html"),
//       function (err) {
//         if (err) {
//           res.status(500).send(err);
//         }
//       }
//     );
//   });
// }

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
