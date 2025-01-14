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
         currentIndex: songIndex !== -1 ? songIndex : get().currentIndex
      })
   },


   togglePlay: () => {},
   playNext: () => {},
   playPrevious: () => {}

}))
