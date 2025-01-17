import express from "express";
import dotenv from "dotenv";
import {clerkMiddleware} from '@clerk/express'
import fileUpload from "express-fileupload"
import path from "path"
import cors from "cors"

import { connectDB } from "./lib/db.js";

import userRoutes from './routes/user.route.js'
import adminRoutes from './routes/admin.route.js'
import authRoutes from './routes/auth.route.js'
import songRoutes from './routes/song.route.js'
import albumRoutes from './routes/album.route.js'
import statRoutes from './routes/stat.route.js'
import { createServer } from "http";

dotenv.config();

const app = express();
const __dirname = path.resolve(); //get current directory
const PORT = process.env.PORT || 5000;

const httpServer = createServer(app)
initializeSocket(httpServer)

app.use(cors( {
  origin: "http://localhost:3000",
  credentials:true,
}))

app.use(express.json()) // to parse req.body
app.use(clerkMiddleware()) // this will add auth to req obj => req.auth.userId
app.use(fileUpload({
  useTempFiles:true,
  tempFileDir: path.join(__dirname, "tmp"), //store files in temp folder
  createParentPath:true,
  limits:{
    fileSize: 10*1024*1024 //10mb max file size
  }
}))

app.use("/api/users", userRoutes) //users using userRoutes
app.use("/api/admin", adminRoutes) //admin using adminRoutes
app.use("/api/auth", authRoutes) //auth using authRoutes
app.use("/api/songs", songRoutes) //songs using songRoutes
app.use("/api/albums", albumRoutes) //albums using albumRoutes
app.use("/api/stats", statRoutes) //stats using statsRoutes

// error handler middleware
app.use((err,req,res,next) => {
  res.status(500).json({message: process.env.NODE_ENV === "production" ? "Internal Server Error" : err.message})
})

httpServer.listen(PORT, () => {
  console.log("nodemon. Server is running on port " + PORT)
  connectDB() //connect to database
})


//todo: socket.io 
