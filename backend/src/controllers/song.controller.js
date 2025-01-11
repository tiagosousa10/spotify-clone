import { Song } from "../models/song.model.js";


export const getAllSongs = async (req,res,next) => {
  try {
    const songs = await Song.find().sort({createdAt:-1}) //sort by createdAt in descending order

    res.json(songs) //return songs
    
  } catch(error) {
    next(error)
  }
}

export const getFeaturedSongs = async (req,res,next) => {
  try {
    //fetch 6 random songs using mongodb's agrregation pipeline
    const songs = await Song.aggregate([
      {
        $sample: {size: 6} //sample 6 random songs
      },
      {
        $project:{ //project only title, artist, imageUrl, audioUrl
          _id:1,
          title:1,
          artist:1,
          imageUrl:1,
          audioUrl:1,
        }
      }
    ])

    res.json(songs)

  } catch(error) {
    next(error)
  }
}

export const getMadeForYouSongs = async (req,res,next) => {
  try {
    //fetch 4 random songs using mongodb's agrregation pipeline
    const songs = await Song.aggregate([
      {
        $sample: {size: 4} //sample 6 random songs
      },
      {
        $project:{ //project only title, artist, imageUrl, audioUrl
          _id:1,
          title:1,
          artist:1,
          imageUrl:1,
          audioUrl:1,
        }
      }
    ])

    res.json(songs)

  } catch(error) {
    next(error)
  }
  
}

export const getTrendingSongs = async (req,res,next) => {
  try {
    //fetch 4 random songs using mongodb's agrregation pipeline
    const songs = await Song.aggregate([
      {
        $sample: {size: 4} //sample 6 random songs
      },
      {
        $project:{ //project only title, artist, imageUrl, audioUrl
          _id:1,
          title:1,
          artist:1,
          imageUrl:1,
          audioUrl:1,
        }
      }
    ])

    res.json(songs)

  } catch(error) {
    next(error)
  }
}
