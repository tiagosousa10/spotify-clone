import { Button } from "@/components/ui/button"
import { usePlayerStore } from "@/stores/usePlayerStore"
import { Pause, Play, Repeat, Shuffle, SkipBack, SkipForward } from "lucide-react"
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
      
         		{/* player controls*/}
				<div className='flex flex-col items-center gap-2 flex-1 max-w-full sm:max-w-[45%]'>
					<div className='flex items-center gap-4 sm:gap-6'>
						<Button
							size='icon'
							variant='ghost'
							className='hidden sm:inline-flex hover:text-white text-zinc-400'
						>
							<Shuffle className='h-4 w-4' />
						</Button>

						<Button
							size='icon'
							variant='ghost'
							className='hover:text-white text-zinc-400'
							onClick={playPrevious}
							disabled={!currentSong}
						>
							<SkipBack className='h-4 w-4' />
						</Button>

						<Button
							size='icon'
							className='bg-white hover:bg-white/80 text-black rounded-full h-8 w-8'
							onClick={togglePlay}
							disabled={!currentSong}
						>
							{isPlaying ? <Pause className='h-5 w-5' /> : <Play className='h-5 w-5' />}
						</Button>
						<Button
							size='icon'
							variant='ghost'
							className='hover:text-white text-zinc-400'
							onClick={playNext}
							disabled={!currentSong}
						>
							<SkipForward className='h-4 w-4' />
						</Button>
						<Button
							size='icon'
							variant='ghost'
							className='hidden sm:inline-flex hover:text-white text-zinc-400'
						>
							<Repeat className='h-4 w-4' />
						</Button>
					</div>
      </div>
      </div>
   </footer>
}
