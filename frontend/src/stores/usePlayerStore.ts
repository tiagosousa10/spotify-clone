import {create } from 'zustand'
import {Song} from '@/types'

interface PlayerStore {
   currentSong: Song | null;
   isPlaying: boolean;
   queue: Song[]; //list of songs
   currentIndex: number;

   initializeQueue : (songs: Song[]) => void;
   playAlbum: (songs: Song[], startIndex?: number) => void;
   setCurrentSong: (song: Song | null) => void;
   togglePlay: () => void;
   playNext:() => void;
   playPrevious: () => void;

}

export const usePlayerStore = create<PlayerStore>((set,get) => ({
//initial state
   currentSong: null,
   isPlaying: false,
   queue: [],
   currentIndex: -1,

   initializeQueue: (songs: Song[]) => {
      set({
         queue:songs, 
         currentSong: get().currentSong || songs[0],
         currentIndex: get().currentIndex === -1 ? 0 : get().currentIndex
      })
   },


   playAlbum:(songs: Song[], startIndex=0) => {
      if(songs.length === 0) return //if no songs, return

      const song = songs[startIndex] //get current song on position 0 from the list of songs

      set({
         queue: songs, 
         currentSong: song,
         currentIndex: startIndex,
         isPlaying:true
      })

   },


   setCurrentSong: (song: Song | null) => {
      if(!song) return;

      const songIndex = get().queue.findIndex((s) => s._id === song._id) //find song in queue

      set({
         currentSong: song,
         isPlaying:true,
         currentIndex: songIndex !== -1 ? songIndex : get().currentIndex //if song is not in queue, use current index
      })
   },


   togglePlay: () => {
      const willStartPlaying = !get().isPlaying; //if player is not playing, start playing

      //negate the isPlaying value
      set({ 
         isPlaying: willStartPlaying
      })
   },


   playNext: () => {
      const {currentIndex, queue} = get()
      const nextIndex = currentIndex + 1 //get next index

      //if there is a next song, set it as current song, lets play it
      if(nextIndex < queue.length) {
         const nextSong = queue[nextIndex]

         set({
            currentSong: nextSong,
            currentIndex: nextIndex,
            isPlaying:true
         })
      } else {
         // no next song on the list
         set({
            isPlaying:false
         })
      }
   },


   playPrevious: () => {
      const {currentIndex, queue} = get()
      const prevIndex = currentIndex - 1 //get previous index

      //there is a prev song
      if(prevIndex >= 0) {
         const prevSong = queue[prevIndex]
         
         set({
            currentSong:prevSong,
            currentIndex: prevIndex,
            isPlaying: true
         })
         
      } else {

         set({
            isPlaying: false
         })
      }
   }

}))
