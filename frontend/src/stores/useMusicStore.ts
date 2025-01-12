import { axiosInstance } from '@/lib/axios';
import {create} from 'zustand';
import {Song, Album} from '@/types'

interface MusicStore {
   songs: Song[], //imported from types
   albums: Album[], //imported from types
   isLoading:boolean,
   error: string | null,
   fetchAlbums: () => Promise<void>
}

export const useMusicStore = create<MusicStore>((set) =>({
   songs: [],
   albums: [],
   isLoading : false,
   error:null,

   fetchAlbums: async () => {
      set({isLoading: true, error:null})

      try {
         const response = await axiosInstance("/albums")
         set({albums: response.data}) //set albums


      } catch(error:any) {
         set({error: error.response.data.message})

      } finally {
         set({isLoading: false})
      }
   }
}))
