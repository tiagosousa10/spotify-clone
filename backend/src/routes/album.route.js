import { Router } from "express";
import { getAlbumById, getAllAlbums } from "../controllers/album.controller.js";

const router = Router()

router.get("/", getAllAlbums); //get all albums
router.get("/:albumId", getAlbumById); //get album by id


export default router;
