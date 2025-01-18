import express from "express";
import dotenv from "dotenv";
import {clerkMiddleware} from '@clerk/express'
import fileUpload from "express-fileupload"
import path from "path"
import cors from "cors"
import fs from "fs" //file system
import { createServer } from "http";
import cron from "node-cron";

import {initializeSocket} from "./lib/socket.js" //socket.io

import { connectDB } from "./lib/db.js";

import userRoutes from './routes/user.route.js'
import adminRoutes from './routes/admin.route.js'
import authRoutes from './routes/auth.route.js'
import songRoutes from './routes/song.route.js'
import albumRoutes from './routes/album.route.js'
import statRoutes from './routes/stat.route.js'

dotenv.config();

const app = express();
const __dirname = path.resolve(); //get current directory
const PORT = process.env.PORT || 5000;

const httpServer = createServer(app)
initializeSocket(httpServer) //initialize socket

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


const tempDir = path.join(process.cwd(), "tmp")
//cron jobs
//delete those files in every 1 hour
cron.schedule("0 * * * *", ()  => {
  if(fs.existsSync(tempDir)){
    fs.readdir(tempDir, (err,files) => {
      if(err) return console.log(err)
        for(const file of files) {
      fs.unlink(path.join(tempDir, file), (err) => {})
  }
    })
  }
}) //every 1 hour


app.use("/api/users", userRoutes) //users using userRoutes
app.use("/api/admin", adminRoutes) //admin using adminRoutes
app.use("/api/auth", authRoutes) //auth using authRoutes
app.use("/api/songs", songRoutes) //songs using songRoutes
app.use("/api/albums", albumRoutes) //albums using albumRoutes
app.use("/api/stats", statRoutes) //stats using statsRoutes

if(process.env.NODE_ENV === "production"){
  app.use(express.static(path.join(__dirname, "../frontend/dist"))) //join frontend dist folder to current directory
  app.get("*", (req,res) => {
    res.sendFile(path.resolve(__dirname, "../frontend/dist/index.html")) //resolve path and send index.html to client
  })
}

// error handler middleware
app.use((err,req,res,next) => {
  res.status(500).json({message: process.env.NODE_ENV === "production" ? "Internal Server Error" : err.message})
})

httpServer.listen(PORT, () => {
  console.log("nodemon. Server is running on port " + PORT)
  connectDB() //connect to database
})


//todo: socket.io 
