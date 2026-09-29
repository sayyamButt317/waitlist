import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import Routes from "./Routes/static.routes.js"
import morgan from "morgan";
import errorHandler from "./middleware/errorhandler.middleware.js";

const app = express();

// Middleware
app.use(morgan("dev"));
app.use(express.json({ limit: "16kb" }));
app.use(cors({
  origin: process.env.Frontend_URL,
  credentials: true,
}));
app.use(cookieParser());

// Routes Declaration
app.use("/api", Routes);

// Error Handler
app.use(errorHandler);

export { app };
