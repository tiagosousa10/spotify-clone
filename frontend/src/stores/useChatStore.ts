import { axiosInstance } from '@/lib/axios'
import { Message } from '@/types'
import {create} from 'zustand'
import {io} from 'socket.io-client'


interface ChatStore { 
   users:any[],
   isLoading:boolean,
   error: string | null,
   socket: any,
   isConnected: boolean,
   onlineUsers: Set<string>, //set of online users
   userActivities: Map<string, string>, // {userId: activity}
   messages:Message[],

   fetchUsers: () => Promise<void>,
   initSocket:(userId:string) => void, //initialize socket
   disconnectSocket:() => void, //disconnect socket
   sendMessage:(receiverId:string, senderId:string, content:string) => void; //send message

}


const baseURL = "http://localhost:5000" //backend url

const socket = io(baseURL, {
   autoConnect: false, // only connect if user is authenticated
   withCredentials:true, //send cookies

})

export const useChatStore = create<ChatStore>((set,get) => ({
   //initial state
   users: [],
   isLoading: false,
   error: null,
   socket:null,
   isConnected: false,
   onlineUsers: new Set(), //set of online users
   userActivities: new Map(), // {userId: activity}
   messages:[], //list of messages

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


   initSocket: (userId:string) => {
     if(!get().isConnected) {
      socket.connect()
     }
   },


   disconnectSocket: () => {

   },

   sendMessage: ( ) => {

   }
})) 
