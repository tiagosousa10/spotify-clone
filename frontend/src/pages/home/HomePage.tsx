import Topbar from "@/components/Topbar"
import { useMusicStore } from "@/stores/useMusicStore"
import { useEffect } from "react"

const HomePage = () => {
  const {
    fetchFeaturedSongs,
    fetchMadeForYouSongs, 
    fetchTrendingSongs,
    isLoading,
    madeForYouSongs,
    featuredSongs,
    trendingSongs
  } = useMusicStore()

  useEffect(() => {
    fetchFeaturedSongs();
    fetchFeaturedSongs();
    fetchMadeForYouSongs();

  }, [fetchFeaturedSongs, fetchMadeForYouSongs, fetchTrendingSongs])

  console.log("info: ", isLoading, madeForYouSongs, featuredSongs, trendingSongs)

  return (
    <div className="rounded-md overflow-hidden">
      <Topbar/>
    </div>
  )
}

export default HomePage
