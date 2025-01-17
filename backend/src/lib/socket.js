import { Server } from "socket.io"; //import socket.io Server
import {Message} from '../models/message.model.js' //import message model

export const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin:"http://localhost:3000",
      credentials: true
    }
  })

  const userSockets = new Map() // {userId: socketId}
  const userActivities = new Map() // {userId: activity}

  io.on("connection", (socket) => {
    //listen to user_connected event
    socket.on("user_connected", (userId) => {
      userSockets.set(userId, socket.id) //update userSockets with new user
      userActivities.set(userId, "Idle") 

      io.emit("user_connected", userId) //broadcast to all users that a new user has joined

      socket.emit("users_online", Array.from(userSockets.keys())) //send list of online users to new user

      io.emit("activities", Array.from(userActivities.entries()))

    })  


    socket.on("update_activity", ({userId, activity}) => { //listen to update_activity event
      console.log("update_activity", userId, activity)
      userActivities.set(userId, activity) //update user activity
      io.emit("activity_updated", {userId, activity}) //broadcast to all users that user activity has changed
    })


    socket.on("send_message",async(data) => { //listen to send_message event
      try {
        const {senderId, receiverId, content} = data

        const message = await Message.create({ //create message in database
          senderId,
          receiverId,
          content
        })

        //send to receiver in realtime, if the user is online
        const receiverSocketId = userSockets.get(receiverId); //get receiver socket id
        if(receiverSocketId){ //if receiver is online
          io.to(receiverSocketId).emit("receive_message", message)
        }

        //send to sender in realtime
        socket.emit("message_sent", message) //send message to sender

      } catch(error){
        console.log("Message error", error)
        socket.emit("message_error", error.message) //send error message to sender
      }
    })


    socket.on("disconnect", () => {
      let disconnectedUserId;
      for(const [userId, socketId] of userSockets.entries()){
        // find disconnected user
        if(socketId === socket.id){
          disconnectedUserId = userId; //get disconnected user id
          userSockets.delete(userId) //remove user from userSockets
          userActivities.delete(userId) //remove user from userActivities
          break;
        }
      }
      if(disconnectedUserId) {
        io.emit("user_disconnected", disconnectedUserId) //broadcast to all users that a user has disconnected
      }
    })
  }
)
}


