import { User } from "../models/user.model.js";
import { Message } from "../models/message.model.js";

export const getAllUsers = async (req,res , next) => {
  try {
    const currentUserId = req.auth.userId //get current user from clerk
    const users = await User.find({clerkId: {$ne: currentUserId}}) //find all users except current user

    res.status(200).json(users)

  } catch(error) {
    next(error)
  }
}


export const getMessages = async (req,res, next) => {
  try {
    const myId = req.auth.userId; // get current user
    const {userId} = req.params; //get user id from params

    const messages = await Message.find({ //find all messages
      $or:[
        {
          senderId: userId, receiverId:myId //find messages sent TO current user 
        },
        {
          senderId: myId, receiverId:userId //find messages sent BY current user
        }

      ]
    }).sort({createdAt:-1}) //sort by createdAt in descending order

    res.status(200).json(messages)
  } catch(error) {
    next(error)
    console.log("Error in getting messages", error)
  }
}
