import db from "../config/config.js";

const Favorite = {
  getAll: async () => {
    const [rows] = await db.query("SELECT * FROM favorites");
    return rows;
  },
  
  getById: async (id) => {
    const [rows] = await db.query("SELECT * FROM favorites WHERE id = ?", [id]);
    return rows[0];
  },
  
  getByUserId: async (userId) => {
    const [rows] = await db.query( `SELECT f.id, f.user_id, f.track_id, t.title, t.file_path, a.name AS artist_name
      FROM favorites f
      JOIN tracks t ON f.track_id = t.id
      LEFT JOIN artists a ON t.artist_id = a.id
      WHERE f.user_id = ?`,
      [userId]
    );
    return rows;
  },
  
  getTracksWithFavorites: async (userId, trackIds) => {
    if (!trackIds || trackIds.length === 0) return [];
    
    const placeholders = trackIds.map(() => '?').join(',');
    const [rows] = await db.query( `SELECT t.*,
      CASE WHEN f.id IS NOT NULL THEN 1 ELSE 0 END AS is_favorite
      FROM tracks t
      LEFT JOIN favorites f ON f.track_id = t.id AND f.user_id = ?
      WHERE t.id IN (${placeholders})`,
      [userId, ...trackIds]
    );
    return rows;
  },
  
  create: async (fav) => {
    const {
      user_id, track_id
    } = fav;
    
    const [existing] = await db.query( "SELECT * FROM favorites WHERE user_id = ? AND track_id = ?",
      [user_id, track_id]
    );
    
    if (existing.length > 0) {
      throw new Error("Цей трек вже улюблений");
    }
    
    const [result] = await db.query( "INSERT INTO favorites (user_id, track_id) VALUES (?, ?)",
      [user_id, track_id]
    );
    return {
      id: result.insertId
    };
  },
  
  update: async (id, fav) => {
    const {
      user_id, track_id
    } = fav;
    await db.query( "UPDATE favorites SET user_id = ?, track_id = ? WHERE id = ?",
      [user_id, track_id, id]
    );
  },
  
  delete: async (id) => {
    await db.query("DELETE FROM favorites WHERE id = ?", [id]);
  },
  
  deleteByUserAndTrack: async (user_id, track_id) => {
    await db.query( "DELETE FROM favorites WHERE user_id = ? AND track_id = ?",
      [user_id, track_id]
    );
  }
};

export default Favorite;