import { axiosInstance } from '@/lib/axios';
import { create} from 'zustand'

interface AuthStore {
   isAdmin: boolean,
   error:string | null,
   isLoading: boolean,

   checkAdminStatus : () => Promise<void>
   reset: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
   //initial state
   isAdmin:false,
   isLoading:false,
   error:null,

   checkAdminStatus: async () => {
      set({isLoading:true, error:null})
      try {
         const response = await axiosInstance.get("/admin/check") //check if user is admin
         set({isAdmin: response.data.admin})

      } catch(error:any) {
         set({isAdmin:false, error: error.response.data.message}) //set error

      } finally {
         set({isLoading:false}); //set loading false after check
      }
   }, 

   reset: () => {
      set({isAdmin:false, isLoading:false, error:null})
   } 
}))
