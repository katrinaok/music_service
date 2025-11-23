import express from "express";

import {
  getAllAlbums,
  getAlbumById,
  createAlbum,
  updateAlbum,
  deleteAlbum,
} from "../controllers/AlbumController.js";

import { uploadAlbumImage } from "../middlewares/upload.js";

const router = express.Router();

router.get("/", getAllAlbums);
router.get("/:id", getAlbumById);
router.post("/", uploadAlbumImage.single("image"), createAlbum);
router.put("/:id", updateAlbum);
router.delete("/:id", deleteAlbum);

export default router;