// Import neccessary libraries
import express from "express"; // import express from express
import dotenv from "dotenv"; // import dotenv from dotenv
import mongoose from "mongoose"; // import moongoose from moongoose
import authRoutes from "./routes/authRoutes.js"; // import authRoutes
import postRoutes from "./routes/postRoutes.js"; // import postRoutes
import userRoutes from "./routes/userRoutes.js";
import { errorHandler, notFound } from "./middlewares/errorHandler.js"; // import neccessary function from error handler middleware
import cors from "cors"; // import cors from cors
import cookieParser from "cookie-parser"; // import cookieParser from cookie-parser
import cloudinary from "./lib/cloudinary.js";

dotenv.config(); // import .env vars
const app = express(); // define app

app.use(cors({ origin: "http://localhost:5173", credentials: true })); // connect secure connect with frontend
app.use(cookieParser()); // middleware to use cookie
app.use(express.json()); // middleware to use JSON

// Connect routes middleware
app.use("/api/auth", authRoutes); // connect authRoutes
app.use("/api/post", postRoutes); // connect postRoutes
app.use("/api/users", userRoutes); // connect userRoutes

// Connect 404 error
app.use(notFound);

// Connect centralized error handler
app.use(errorHandler);

// Connect DB and start server
mongoose.connect(process.env.URI).then(() =>
  app.listen(process.env.PORT, () => {
    console.log(`App listening on port ${process.env.PORT}`);
  })
);
