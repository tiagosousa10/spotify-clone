import { Router } from "express";

const router = Router()

router.get("/", (req,res) => {
  res.send("hello from backend admin route")
})


export default router;
