import { Router } from "express";

const router = Router()

router.get("/", (req,res) => {
  req.auth.userId
  res.send("hello from backend user route")
})

export default router;
