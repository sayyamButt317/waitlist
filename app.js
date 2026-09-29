import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import Routes from "./Routes/static.routes.js";
import morgan from "morgan";
import errorHandler from "./middleware/errorhandler.middleware.js";
import connectionDB from "./db/connection.js";

const app = express();
let dbReady = null;

app.use(async (_req, _res, next) => {
  try {
    if (!dbReady) {
      dbReady = connectionDB();
    }
    await dbReady;
    next();
  } catch (err) {
    next(err);
  }
});

app.use(morgan("dev"));
app.use(express.json({ limit: "16kb" }));
app.use(
  cors({
    origin: process.env.Frontend_URL,
    credentials: true,
  })
);
app.use(cookieParser());

app.get("/", (_req, res) => {
  res.json({ ok: true, message: "Waitlist API is running" });
});

app.use("/api", Routes);
app.use(errorHandler);
export default app;
