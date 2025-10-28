import express from "express";
import {
  getAllPlaylists,
  getPlaylistById,
  getPlaylistsByUser,
  createPlaylist,
  updatePlaylist,
  deletePlaylist,
} from "../controllers/playlists_controller.js";
import { uploadPlaylistImage } from "../middlewares/upload.js";

const router = express.Router();

router.get("/", getAllPlaylists);
router.get("/user/:userId", getPlaylistsByUser);
router.get("/:id", getPlaylistById);
router.post("/", uploadPlaylistImage.single("image"), createPlaylist);
router.put("/:id", uploadPlaylistImage.single("image"), updatePlaylist);
router.delete("/:id", deletePlaylist);

export default router;