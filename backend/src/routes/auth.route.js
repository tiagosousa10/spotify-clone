import { Router } from "express";
import {User} from "../models/user.model.js";

const router = Router()

router.post("/callback", async (req,res) => {
  try {
    const {id,firstName,lastName, imageUrl} = req.body; //from clerk 

    //check if user already exists
    const user = await User.findOne({clerkId: id}) //find user by clerk id

    if(!user){
      //sign up | create user
      await User.create({
        clerkId:id,
        fullName: `${firstName} ${lastName}`,
        imageUrl
      })
    }

    res.status(200).json({success: true})

  } catch(error) {
    console.log("Error in auth callback", error)
    res.status(500).json({message: "Internal Server Error", error})
  }
})


export default router;
