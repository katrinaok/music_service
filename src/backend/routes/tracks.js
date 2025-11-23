import express from "express";

import {
  getAllTracks,
  getTrackById,
  createTrack,
  updateTrack,
  deleteTrack,
} from "../controllers/TrackController.js";

import { uploadTrackFile } from "../middlewares/upload.js";

const router = express.Router();

router.get("/", getAllTracks);
router.get("/:id", getTrackById);
router.post("/", uploadTrackFile.single("track"), createTrack);
router.put("/:id", updateTrack);
router.delete("/:id", deleteTrack);

export default router;