import express from "express";
import {
  getAllArtists,
  getArtistById,
  createArtist,
  updateArtist,
  deleteArtist
} from "../controllers/artists_controller.js";
import { uploadArtistImage } from "../middlewares/upload.js";

const router = express.Router();

router.get("/", getAllArtists);
router.get("/:id", getArtistById);
router.post("/", uploadArtistImage.single("image"), createArtist);
router.put("/:id", updateArtist);
router.delete("/:id", deleteArtist);

export default router;