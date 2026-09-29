import { app } from "../App.js";
import connectionDB from "../db/connection.js";

let dbReady = null;

async function ensureDb() {
  if (!dbReady) {
    dbReady = connectionDB();
  }
  await dbReady;
}

export default async function handler(req, res) {
  await ensureDb();
  return app(req, res);
}
