import { Album } from "../models/album.model.js"
import { Song } from "../models/song.model.js"
import { User } from "../models/user.model.js"

export const getStats = async (req,res,next) => {
  try {
    const [totalSongs, totalAlbums, totalUsers, uniqueArtists] = await Promise.all([ //get total number of songs, albums and users
      Song.countDocuments(),
      Album.countDocuments(),
      User.countDocuments(),

      Song.aggregate([
        {
          $unionWith: { //union with songs collection
            coll: "albums", //collection to union
            pipeline: []
          }
        },
        {
          $group: { 
            _id: "$artist", //group by artist
          }
        },
        {
          $count : "count" //count number of artists
        }
      ])
    ])

    res.status(200).json({
      totalAlbums,
      totalSongs,
      totalUsers,
      totalArtists : uniqueArtists[0]?.count || 0    //
    })
  
  } catch(error) {
    next(error)
  }
}
