import { Router } from "express";
  import waitlistController from "../Controllers/waitlist.Controller.js";
  
const router = Router();
router.post(`waitlist`,waitlistController)


export default router;
