import { User } from "../models/user.model.js";

export const getAllUsers = async (req,res , next) => {
  try {
    const currentUserId = req.auth.userId //get current user from clerk
    const users = await User.find({clerkId: {$ne: currentUserId}}) //find all users except current user

    res.status(200).json(users)

  } catch(error) {
    next(error)
  }
}
