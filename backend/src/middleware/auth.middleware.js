import { clerkClient } from "@clerk/express";

export const protectRoute = async (req,res,next) => {
  if(!req.auth.userId){
    return res.status(401).json({message: "Unauthorized - You must be logged in to access this route"})
  }

  next()
}


export const requireAdmin = async (req,res,next) => {
  try {
    const currentUser = await clerkClient.users.getUser(req.auth.userId) //get current user
    const isAdmin = process.env.ADMIN_EMAIL === currentUser.primaryEmailAddress?.emailAddress; //check if current user is admin

    if(!isAdmin){
      return res.status(403).json({message: "Unauthorized - You must be an admin to access this route"})
    }

    next(); //if current user is admin
  }   catch(error) {
    next(error)
  }
}
