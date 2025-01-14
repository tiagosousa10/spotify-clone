import { usePlayerStore } from "@/stores/usePlayerStore"
import { useEffect, useRef, useState } from "react"

export const PlaybackControls = () => {
   const {currentSong, isPlaying, togglePlay, playNext, playPrevious} = usePlayerStore()
   
   const [volume,setVolume] = useState(75)
   const [currentTime, setCurrentTime] = useState(0)
   const [duration,setDuration] = useState(0)
   const audioRef = useRef<HTMLAudioElement | null>(null)

   useEffect(() => {
      audioRef.current = document.querySelector("audio") 

      const audio = audioRef.current;
      if(!audio) return;

      const updateTime = () => setCurrentTime(audio.currentTime) //update current time
      const updateDuration = () => setDuration(audio.duration) //update duration

      audio.addEventListener("timeupdate", updateTime) // add event listener to update current time
      audio.addEventListener("loadedmetadata", updateDuration) // add event listener to update duration

      const handleEnded = () => {
         usePlayerStore.setState({isPlaying: false})
      }

      audio.addEventListener("ended", handleEnded)


      return () => { // remove event listeners
         audio.removeEventListener("timeupdate", updateTime)
         audio.removeEventListener("loadedmetadata", updateDuration)
         audio.removeEventListener("ended", handleEnded)
      }

   }, [currentSong])

   const handleSeek = (value: number[]) => {
      if(audioRef.current) {
         audioRef.current.currentTime = value[0]
      }
   }

   return <footer className="h-20 sm:h-24 bg-zinc-900 border-t border-zinc-800 px-4">
      <div className="flex justify-between items-center h-full max-w-[1800px] mx-auto">
         {/* currently playing song  */}
         <div className='hidden sm:flex items-center gap-4 min-w-[180px] w-[30%]'>
					{currentSong && (
						<>
							<img
								src={currentSong.imageUrl}
								alt={currentSong.title}
								className='w-14 h-14 object-cover rounded-md'
							/>
							<div className='flex-1 min-w-0'>
								<div className='font-medium truncate hover:underline cursor-pointer'>
									{currentSong.title}
								</div>
								<div className='text-sm text-zinc-400 truncate hover:underline cursor-pointer'>
									{currentSong.artist}
								</div>
							</div>
						</>
					)}
				</div>
      
      </div>
   </footer>
}
