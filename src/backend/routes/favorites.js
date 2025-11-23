import express from "express";

import {
  getAllFavorites,
  getFavoriteById,
  getFavoritesByUser,
  createFavorite,
  updateFavorite,
  deleteFavorite
} from "../controllers/FavoriteController.js";

const router = express.Router();

router.get("/", getAllFavorites);
router.get("/:id", getFavoriteById);
router.get("/user/:userId", getFavoritesByUser);
router.post("/", createFavorite);
router.put("/:id", updateFavorite);
router.delete("/:id", deleteFavorite);

export default router;