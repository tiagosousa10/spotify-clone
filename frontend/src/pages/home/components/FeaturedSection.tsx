import { useMusicStore } from '@/stores/useMusicStore'
import React from 'react'

const FeaturedSection = () => {
   const {isLoading, featuredSongs, error} = useMusicStore()
   if(isLoading) return <FeaturedGridSkeleton/>

  return (
    <div>FeaturedSection</div>
  )
}

export default FeaturedSection
