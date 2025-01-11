import { Song } from "../models/song.model.js";
import { Album } from "../models/album.model.js";
import cloudinary from "../lib/cloudinary.js";


// helper function to upload file to cloudinary
const uploadToCloudinary =  async (file) => { //file is the audioFile or imageFile
try {
  const result = await cloudinary.uploader.upload(file.tempFilePath, {
    resource_type: "auto"
  }) 

  return result.secure_url //return secure url
} catch(error) {
  console.log("Error in uploading file to cloudinary", error)
  throw new Error("Error in uploading file to cloudinary")
}
}


export const createSong = async (req,res, next) => {
  try {
    if(!req.files || !req.files.audioFile || !req.files.imageFile) {
      return res.status(400).json({message: "Please upload all files"})
    }

    const {title,artist,albumId,duration} = req.body; //get song details
    const audioFile = req.files.audioFile //get audio file
    const imageFile = req.files.imageFile //get image file

    const audioUrl = await uploadToCloudinary(audioFile) //upload audio file to cloudinary
    const imageUrl = await uploadToCloudinary(imageFile) //upload image file to cloudinary

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


export const deleteSong = async( req, res, next) => {
  try {
    const {id} = req.params;

    const song = await Song.findById(id) //find song by id

    //if song belongs to an album , update the album's songs array
    if(song.albumId){
      await Album.findByIdAndUpdate(song.albumId, { //update album
        $pull: { //remove song from album's songs array
          songs: song._id
        }
      })
    }

    await Song.findByIdAndDelete(id) //delete song from db

    res.status(200).json({message: "Song deleted successfully"})
  } catch(error) {
    console.log("Error in deleting song", error)
    next(error)
  }
}


export const createAlbum = async (req,res,next) => {
  try {
    const {title,artist,releaseYear} = req.body;
    const {audioFile} = req.files.audioFile;//get audio file
    const {imageFile} = req.files.imageFile; //get image file
    
    const audioUrl = await uploadToCloudinary(audioFile) //upload audio file to cloudinary
    const imageUrl = await uploadToCloudinary(imageFile) //upload image file to cloudinary
  
    const album = new Album ({ //create new album
      title,
      artist,
      imageUrl,
      audioUrl,
      releaseYear,
    })

    await album.save() //save album to db
    
    res.status(200).json(album)

  } catch(error) {
    console.log("Error in creating album", error)
    next(error)
  }
}


export const deleteAlbum = async (req,res,next) => { 
  try {
    const {id} = req.params;
    await Song.deleteMany({albumId: id}) //delete all songs in album
    await Album.findByIdAndDelete(id) //delete album from db

    res.status(200).json({message: "Album deleted successfully"})

  } catch(error) {
    console.log("Error in deleting album", error)
    next(error)
  }
}
