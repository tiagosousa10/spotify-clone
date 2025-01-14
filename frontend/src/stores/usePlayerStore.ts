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
   currentSong: null,
   isPlaying: false,
   queue: [],
   currentIndex: -1,

   initializeQueue: (songs: Song[]) => {},
   playAlbum:(songs: Song[], startIndex?: number) => {},
   setCurrentSong: (song: Song | null) => {},
   togglePlay: () => {},
   playNext: () => {},
   playPrevious: () => {}

}))
