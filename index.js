import dotenv from "dotenv";
import chalk from "chalk";
import app from "./app.js";
import connectionDB from "./db/connection.js";

dotenv.config({
  path: "./.env",
});

// Local only — Vercel uses the Express export from app.js
if (!process.env.VERCEL) {
  connectionDB()
    .then(() => {
      const port = process.env.PORT || 8000;
      app.listen(port, () => {
        console.log(chalk.bgBlue(`Server running on http://localhost:${port}`));
      });
    })
    .catch((err) => console.log(`MongoDB connection failed`, err));
}

export default app;
