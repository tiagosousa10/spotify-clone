import mongoose, { mongo } from "mongoose";

const messageSchema = new mongoose.Schema({
  senderId: { //clerk user id
    type: String,
    required:true
  },
  receiverId: { // clerk user id
    type:String,
    required:true
  },
  content: {
    type:String,
    required:true 
  }
},{timestamps:true}) // createdAt, updatedAt

export const Message = mongoose.model("Message", messageSchema)
