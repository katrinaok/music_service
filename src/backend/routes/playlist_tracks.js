import express from "express";
import {
  getAllPlaylistTracks,
  getPlaylistTracks,
  addTrackToPlaylist,
  deleteTrackFromPlaylist
} from "../controllers/playlist_tracks_controller.js";

const router = express.Router();

router.get("/", getAllPlaylistTracks);
router.get("/:playlistId/tracks", getPlaylistTracks);
router.post("/:playlistId/tracks", addTrackToPlaylist);
router.delete("/:playlistId/tracks/:trackId", deleteTrackFromPlaylist);

export default router;