import { axiosInstance } from '@/lib/axios'
import {create} from 'zustand'

interface ChatStore { 
   users:any[],
   fetchUsers: () => Promise<void>
   isLoading:boolean,
   error: string | null
}


export const useChatStore = create<ChatStore>((set) => ({
   //initial state
   users: [],
   isLoading: false,
   error: null,

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
   }
})) 
