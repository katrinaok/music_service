import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mysql from "mysql2/promise";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import app from "./app.js";

import albumsRoutes from "./routes/albums.js";
import artistsRoutes from "./routes/artists.js";
import favoritesRoutes from "./routes/favorites.js";
import genresRoutes from "./routes/genres.js";
import playlistTracksRoutes from "./routes/playlist_tracks.js";
import playlistsRoutes from "./routes/playlists.js";
import tracksRoutes from "./routes/tracks.js";
import usersRoutes from "./routes/users.js";
export const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

(async () => {
  try {
    const connection = await db.getConnection();
    console.log("✅ Підключено до MySQL!");
    connection.release();
  } catch (err) {
    console.error("Помилка підключення до бази:", err);
  }
})();

app.use("/albums", albumsRoutes);
app.use("/artists", artistsRoutes);
app.use("/favorites", favoritesRoutes);
app.use("/genres", genresRoutes);
app.use("/playlist_tracks", playlistTracksRoutes);
app.use("/playlists", playlistsRoutes);
app.use("/tracks", tracksRoutes);
app.use("/users", usersRoutes);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.static(join(__dirname, "../public")));
app.use("/uploads", express.static(join(__dirname, "uploads")));
app.get("/", (_, res) => {
  res.sendFile(join(__dirname, "../public/index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущено на http://localhost:${PORT}`);
});