import express from "express";
import dotenv from "dotenv";

import { connectDB } from "./lib/db.js";

import userRoutes from './routes/user.route.js'
import adminRoutes from './routes/admin.route.js'
import authRoutes from './routes/auth.route.js'
import songRoutes from './routes/song.route.js'
import albumRoutes from './routes/album.route.js'
import statRoutes from './routes/stats.route.js'

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use("/api/users", userRoutes) //users using userRoutes
app.use("/api/admin", adminRoutes) //admin using adminRoutes
app.use("/api/auth", authRoutes) //auth using authRoutes
app.use("/api/songs", songRoutes) //songs using songRoutes
app.use("/api/albums", albumRoutes) //albums using albumRoutes
app.use("/api/stats", statRoutes) //stats using statsRoutes

app.listen(PORT, () => {
  console.log("nodemon. Server is running on port " + PORT)
  connectDB() //connect to database
})
