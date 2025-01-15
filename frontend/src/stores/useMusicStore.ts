import { axiosInstance } from '@/lib/axios';
import {create} from 'zustand';
import {Song, Album, Stats} from '@/types' // @ means src

interface MusicStore {
   songs: Song[], //imported from types
   albums: Album[], //imported from types
   isLoading: boolean,
   error: string | null,
   currentAlbum: null,
   featuredSongs: Song[],
   madeForYouSongs: Song[],
   trendingSongs: Song[],
   stats: Stats;

   fetchAlbums: () => Promise<void>,
   fetchAlbumById: (id:string) => Promise<void>,
   fetchFeaturedSongs: () => Promise<void>,
   fetchMadeForYouSongs: () => Promise<void>,
   fetchTrendingSongs: () => Promise<void>,
   fetchStats: () => Promise<void> //for admin dashboard
   fetchSongs: () => Promise<void> //for admin dashboard

}


export const useMusicStore = create<MusicStore>((set) =>({
   //initial state
   songs: [],
   albums: [],
   isLoading : false,
   error:null,
   currentAlbum: null ,
   madeForYouSongs: [],
   featuredSongs: [],
   trendingSongs: [],
   stats: {
      totalSongs: 0,
      totalAlbums: 0,
      totalUsers: 0,
      totalArtists:0,
   },



   fetchSongs: async () => {
      set({isLoading: true, error: null})
      try {
         const res = await axiosInstance.get("/songs")
         set({songs: res.data})
         
      } catch(error:any) {
         set({error: error.response.data.message})
      } finally {
         set({isLoading: false})
      }
   },

   
   fetchStats: async () => {
      set({isLoading: true, error: null})

      try {
         const res = await axiosInstance.get("/stats")
         set({stats: res.data})


      } catch(error: any) {
         set({error: error.response.data.message})

      } finally {
         set({isLoading: false})
      }
   },


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
   },


   fetchFeaturedSongs: async () => {
      set({isLoading:true, error:null})
      try {
         const response = await axiosInstance.get("/songs/featured")
         set({featuredSongs: response.data})
      } catch(error:any) {
         set({error: error.response.data.message})
      } finally {
         set({isLoading:false})
      }
   },


   fetchMadeForYouSongs: async () => {
      set({isLoading:true, error:null})
      try {
         const response = await axiosInstance.get("/songs/made-for-you")
         set({madeForYouSongs: response.data})

      } catch(error:any) {
         set({error: error.response.data.message})

      } finally {
         set({isLoading:false})
      }
   },


   fetchTrendingSongs: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get("/songs/trending");
			set({ trendingSongs: response.data });

		} catch (error: any) {
			set({ error: error.response.data.message });
         
		} finally {
			set({ isLoading: false });
		}
	},
}))
