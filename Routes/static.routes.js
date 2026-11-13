import { Router } from "express";
  import waitlistController from "../Controllers/waitlist.Controller.js";
import { getWishImage, listWishes, saveWish } from "../Controllers/wishes.Controller.js";
  
const router = Router();
router.get(`/test`,(req,res)=>{
    res.send("Hello World");
})
router.post(`/waitlist`, waitlistController)

router.get(`/wishes`, listWishes);
router.put(`/wishes/:slot`, saveWish);
router.get(`/wishes/:slot/image`, getWishImage);


export default router;
