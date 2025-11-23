import db from "../config/config.js";

const Track = {
  getAll: async () => {
    const [rows] = await db.query("SELECT * FROM tracks");
    return rows;
  },
  
  getById: async (id) => {
    const [rows] = await db.query("SELECT * FROM tracks WHERE id = ?", [id]);
    return rows[0];
  },
  
  create: async (track) => {
    const {
      title, artist_id, album_id, genre_id, file_path
    } = track;
    
    const [countRows] = await db.query("SELECT COUNT(*) AS count FROM tracks");
    if (countRows[0].count === 0) {
      await db.query("ALTER TABLE tracks AUTO_INCREMENT = 1");
    }
    
    const [result] = await db.query( "INSERT INTO tracks (title, artist_id, album_id, genre_id, file_path) VALUES (?, ?, ?, ?, ?)",
      [title, artist_id, album_id, genre_id, file_path]
    );
    return {
      id: result.insertId
    };
  },
  
  update: async (id, track) => {
    const {
      title, artist_id, album_id, genre_id, duration
    } = track;
    
    await db.query( "UPDATE tracks SET title = ?, artist_id = ?, album_id = ?, genre_id = ?, duration = ? WHERE id = ?",
      [title, artist_id, album_id, genre_id, duration, id]
    );
  },
  
  delete: async (id) => {
    await db.query("DELETE FROM tracks WHERE id = ?", [id]);
  },
};

export default Track;
