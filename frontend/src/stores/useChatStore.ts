import { axiosInstance } from '@/lib/axios'
import { Message, User } from '@/types'
import {create} from 'zustand'
import {io} from 'socket.io-client'


interface ChatStore { 
   users:User[],
   isLoading:boolean,
   error: string | null,
   socket: any,
   isConnected: boolean,
   onlineUsers: Set<string>, //set of online users
   userActivities: Map<string, string>, // {userId: activity}
   messages:Message[],
   selectedUser: User | null

   fetchUsers: () => Promise<void>,
   initSocket:(userId:string) => void, //initialize socket
   disconnectSocket:() => void, //disconnect socket
   sendMessage:(receiverId:string, senderId:string, content:string) => void; //send message
   fetchMessages:(userId:string) => Promise<void>;
   setSelectedUser:(user: User | null) => void;

}


const baseURL = import.meta.env.MODE === "development" ? "http://localhost:5000" : "/" //backend url

const socket = io(baseURL, {
   autoConnect: false, // only connect if user is authenticated
   withCredentials:true, //send cookies

})

export const useChatStore = create<ChatStore>((set,get) => ({
   //initial state
   users: [],
   isLoading: false,
   error: null,
   socket:socket,
   isConnected: false,
   onlineUsers: new Set(), //set of online users
   userActivities: new Map(), // {userId: activity}
   messages:[], //list of messages
   selectedUser: null,

   
   setSelectedUser: (user) => set({selectedUser: user}),


   fetchUsers: async () => {
      set({isLoading:true, error:null})

      try {
         const response = await axiosInstance.get("/users") //get all users
         set({users: response.data}) //set users

      } catch(error: any) {
         set({error: error.response.data.message})
         
      } finally {
         set({isLoading:false})
      }
   },


   //initialize socket and listen all socket events
   initSocket: (userId) => {
     if(!get().isConnected) { //if socket is not connected
      socket.auth = {userId} 
      socket.connect() //connect socket

      socket.emit("user_connected", userId) //emit user_connected event to backend

      socket.on("users_online", (users: string[]) => { //listen to user_online event with array of online users
         set({onlineUsers: new Set(users)}) //set onlineUsers with new online users
      })

      socket.on("activities", (activities: [string,string][]) => { //listen to activities event with array of [userId, activity]
         set({userActivities: new Map(activities)})//set userActivities with new activities
      })

      socket.on("user_connected", (userId:string) => {
         set((state) => ({
            onlineUsers: new Set([...state.onlineUsers, userId]) //add new user to onlineUsers
         }))
      })

      socket.on("user_disconnected", (userId:string) => {
         set((state) => {
            const newOnlineUsers = new Set(state.onlineUsers)
            newOnlineUsers.delete(userId) //delete user from onlineUsers
            return {onlineUsers : newOnlineUsers} //return new onlineUsers
         })
      })

      socket.on("receive_message", (message:Message) => {
         set((state) => ({
           messages: [...state.messages, message] //add new message to messages
         }))
      })

      socket.on("message_sent", (message:Message) => {
         set((state) => ({
            messages: [...state.messages, message] //add new message to messages
         }))
      })

      socket.on("activity_updated", ({userId, activity}) => { //listen to activity_updated event
         set((state) => {
            const newActivities = new Map(state.userActivities) //create new Map of userActivities
            newActivities.set(userId, activity) //update user activity
            return {userActivities: newActivities}
         })
      })

      set({isConnected: true})

     }
   },


   disconnectSocket: () => {
      if(get().isConnected) {
         socket.disconnect()
         set({isConnected: false})
      }
   },


   sendMessage: (receiverId, senderId, content ) => {
      const socket = get().socket //get socket
      if(!socket) return;

      socket.emit("send_message", {receiverId, senderId, content})
   },


   fetchMessages: async(userId:string) => {
      set({isLoading: true, error: null})

      try {
         const response = await axiosInstance.get(`/users/messages/${userId}`) //get messages
         set({messages: response.data}) //set messages

      } catch(error:any) {
         set({error: error.response.data.message})

      } finally {
         set({isLoading:false})

      }
   },


})) 
