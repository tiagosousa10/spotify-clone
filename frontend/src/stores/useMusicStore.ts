import { axiosInstance } from '@/lib/axios';
import {create} from 'zustand';
import {Song, Album} from '@/types' // @ means src

interface MusicStore {
   songs: Song[], //imported from types
   albums: Album[], //imported from types
   isLoading: boolean,
   error: string | null,
   currentAlbum: null

   fetchAlbums: () => Promise<void>,
   fetchAlbumById: (id:string) => Promise<void>,
}


export const useMusicStore = create<MusicStore>((set) =>({
   songs: [],
   albums: [],
   isLoading : false,
   error:null,
   currentAlbum: null ,


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
   },


   fetchAlbumById: async (id:string) => {
     set({isLoading:true, error:null})
      try {
         const response = await axiosInstance.get(`/albums/${id}`) //get album by id
         set({currentAlbum: response.data})

      } catch(error: any) {
         set({error: error.response.data.message})
      } finally {
         set({isLoading:false})
      }
   }
}))
