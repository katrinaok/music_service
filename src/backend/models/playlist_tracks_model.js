import db from "../config/config.js";

const PlaylistTrack = {
  getAll: async () => {
    const [rows] = await db.query("SELECT * FROM playlist_tracks");
    return rows;
  },

  getByPlaylistId: async (playlist_id) => {
    const [rows] = await db.query(
      `SELECT t.* 
      FROM tracks t
      JOIN playlist_tracks pt ON t.id = pt.track_id
      WHERE pt.playlist_id = ?`,
      [playlist_id]
    );
    return rows;
  },

  create: async (playlist_id, track_id) => {
    try {
      return await db.query(
        "INSERT INTO playlist_tracks (playlist_id, track_id) VALUES (?, ?)",
        [playlist_id, track_id]
      );
    } catch(err) {
      console.error("DB insert error:", err);
      throw err;
    }
  },

  delete: async (playlist_id, track_id) => {
    return await db.query(
      "DELETE FROM playlist_tracks WHERE playlist_id = ? AND track_id = ?",
      [playlist_id, track_id]
    );
  },
}

export default PlaylistTrack;