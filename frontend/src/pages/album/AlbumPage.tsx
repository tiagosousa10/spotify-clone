import { ScrollArea } from '@/components/ui/scroll-area'
import { useMusicStore } from '@/stores/useMusicStore'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'


const AlbumPage = () => {
   const {albumId} = useParams() //get album id from url params
   const {fetchAlbumById, currentAlbum, isLoading} = useMusicStore()


   useEffect(() => {
      if(albumId) {
         fetchAlbumById(albumId) 
      } 
   }, [fetchAlbumById, albumId])

   if(isLoading) return null


  return (
    <div className='h-full '>
      <ScrollArea className='h-full'>
         {/*main content */}
         <div className=' relative min-h-full'>
            {/*bg gradient */}
            <div 
            className='absolute inset-0 bg-gradient-to-b from-[#5038a0]/80 via-zinc-900/80
             to-zinc-900 pointer-events-none' 
            area-hidden='true'
            />
            {/*content */}
            <div className='relative z-10 '>
               <div className='flex p-6 gap-6 pb-8'>
                  <img src={currentAlbum?.['imageUrl']}  alt={currentAlbum?.['title']}
                  className='w-[240px] h-[240px] shadow-xl rounded' 
                  />
                  <div className='flex flex-col justify-end'>
                     <p className='text-sm font-medium'>Album</p>
                     <h1 className='text-7xl font-bold my-4'>{currentAlbum?.['title']}  </h1>
                     <div className='flex items-center gap-2 text-sm text-zinc-100'>
                        <span className='font-medium text-white'>{currentAlbum?.['artist']} </span>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </ScrollArea>
    </div>
  )
}

export default AlbumPage
