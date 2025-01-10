import { Song } from "../models/song.model";
import { Album } from "../models/album.model";
export const createSong = async (req,res, next) => {
  try {
    if(!req.files || !req.files.audioFile || !req.files.imageFile) {
      return res.status(400).json({message: "Please upload all files"})
    }

    const {title,artist,albumId,duration} = req.body; //get song details
    const audioFile = req.files.audioFile //get audio file
    const imageFile = req.files.imageFile //get image file

    const song = new Song({ //create new song
      title,
      artist,
      imageUrl,
      audioUrl,
      duration,
      albumId: albumId || null
    })

    await song.save() //save song to db

    //if song belongs to an album , update the album's songs array
    if(albumId){
      await Album.findByIdAndUpdate(albumId, {
        $push: {
          songs: song._id
        }
      })
    }

    res.status(201).json(song) 

  } catch(error) {
    next(error); 
  }
}
