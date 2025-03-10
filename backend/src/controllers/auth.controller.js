import { User } from "../models/user.model.js";

export const authCallback = async (req,res, next) => { 
  try {
    const {id,firstName,lastName, imageUrl} = req.body; //from clerk 

    //check if user already exists
    const user = await User.findOne({clerkId: id}) //find user by clerk id

    if(!user){
      //sign up | create user
      await User.create({
        clerkId:id,
        fullName: `${firstName || ""} ${lastName || ""}`.trim(),
        imageUrl
      })
    }

    res.status(200).json({success: true})

  } catch(error) {
    console.log("Error in auth callback", error)
    next(error)
  }
}
