import { Router } from "express";
  import waitlistController from "../Controllers/waitlist.Controller.js";
  
const router = Router();
router.get(`/`,(req,res)=>{
    res.send("Hello World");
})
router.post(`waitlist`,waitlistController)


export default router;
