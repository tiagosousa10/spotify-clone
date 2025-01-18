import {create } from 'zustand'
import {Song} from '@/types'
import { useChatStore } from './useChatStore';

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

      const socket = useChatStore.getState().socket //get socket from useChatStore

      if(socket.auth) { //if user is authenticated
         socket.emit("update_activity", {
            userId: socket.auth.userId,
            activity: `Playing ${song.title} by ${song.artist}`
         })
      }

      set({
         queue: songs, 
         currentSong: song,
         currentIndex: startIndex,
         isPlaying:true
      })

   },


   setCurrentSong: (song: Song | null) => {
      if(!song) return;

      const socket = useChatStore.getState().socket //get socket from useChatStore

      if(socket.auth) { //if user is authenticated
         socket.emit("update_activity", {
            userId: socket.auth.userId,
            activity: `Playing ${song.title} by ${song.artist}`
         })
      }


      const songIndex = get().queue.findIndex((s) => s._id === song._id) //find song in queue

      set({
         currentSong: song,
         isPlaying:true,
         currentIndex: songIndex !== -1 ? songIndex : get().currentIndex //if song is not in queue, use current index
      })
   },


   togglePlay: () => {
      const willStartPlaying = !get().isPlaying; //if player is not playing, start playing

      const currentSong = get().currentSong //get current song
      const socket = useChatStore.getState().socket //get socket from useChatStore

      if(socket.auth) { //if user is authenticated
         socket.emit("update_activity", {
            userId: socket.auth.userId,
            activity: willStartPlaying && currentSong ? `Playing ${currentSong.title} by ${currentSong.artist}` : "Idle"
         })
      }

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

         const socket = useChatStore.getState().socket //get socket from useChatStore

         if(socket.auth) { //if user is authenticated
            socket.emit("update_activity", {
               userId: socket.auth.userId,
               activity: `Playing ${nextSong.title} by ${nextSong.artist}`
            })
         }

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

         const socket = useChatStore.getState().socket //get socket from useChatStore

         if(socket.auth) { //if user is authenticated
            socket.emit("update_activity", {
               userId: socket.auth.userId,
               activity: `Idle`
            })
         }
      }
   },


   playPrevious: () => {
      const {currentIndex, queue} = get()
      const prevIndex = currentIndex - 1 //get previous index

      //there is a prev song
      if(prevIndex >= 0) {
         const prevSong = queue[prevIndex]
         
         const socket = useChatStore.getState().socket //get socket from useChatStore

         if(socket.auth) { //if user is authenticated
            socket.emit("update_activity", {
               userId: socket.auth.userId,
               activity: `Playing ${prevSong.title} by ${prevSong.artist}`
            })
         }

         set({
            currentSong:prevSong,
            currentIndex: prevIndex,
            isPlaying: true
         })
         
      } else {

         set({
            isPlaying: false
         })

         const socket = useChatStore.getState().socket //get socket from useChatStore

         if(socket.auth) { //if user is authenticated
            socket.emit("update_activity", {
               userId: socket.auth.userId,
               activity: `Idle`
            })
         }
      }
   }

}))
