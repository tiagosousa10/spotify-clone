import SectionGridSkeleton from '@/components/skeletons/SectionGridSkeleton'
import { Song } from '@/types'


type SectionGridProps = {
   title: string,
   songs: Song[],
   isLoading: boolean
}

const SectionGrid = ({title, songs, isLoading} : SectionGridProps) => {
   if(isLoading) return <SectionGridSkeleton />
   
   return (
    <div>SectionGrid</div>
  )
}

export default SectionGrid
