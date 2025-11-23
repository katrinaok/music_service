import db from "../config/config.js";

const Playlist = {
  async getAll() {
    const [rows] = await db.query("SELECT * FROM playlists");
    return rows;
  },
  
  async getById(id) {
    const [rows] = await db.query("SELECT * FROM playlists WHERE id = ?", [id]);
    return rows[0];
  },
  
  async getByUserId(userId) {
    const [rows] = await db.query( "SELECT id, name, description, cover_url, user_id FROM playlists WHERE user_id = ? ORDER BY id ASC", [userId]
    );
    return rows;
  },
  
  async create(playlist) {
    const {
      name, user_id, description, cover_url
    } = playlist;
    
    const [countRows] = await db.query("SELECT COUNT(*) AS count FROM playlists");
    if (countRows[0].count === 0) {
      await db.query("ALTER TABLE playlists AUTO_INCREMENT = 1");
    }
    
    const [result] = await db.query( "INSERT INTO playlists (name, user_id, description, cover_url) VALUES (?, ?, ?, ?)",
      [name, user_id, description, cover_url]
    );
    return {
      id: result.insertId, name, user_id, description, cover_url
    };
  },
  
  async update(id, playlist) {
    const {
      name, user_id, description, cover_url
    } = playlist;
    
    await db.query( "UPDATE playlists SET name = ?, user_id = ?, description = ?, cover_url = ? WHERE id = ?",
      [name, user_id, description, cover_url, id]
    );
  },
  
  async delete(id) {
    const [result] = await db.query("DELETE FROM playlists WHERE id = ?", [id]);
    return result;
  },
  
  async getTracksByPlaylistId(playlistId) {
    const [rows] = await db.query(` SELECT t.id, t.title, t.file_path, a.title AS album_title, ar.name AS artist_name
      FROM playlist_tracks pt
      LEFT JOIN tracks t ON pt.track_id = t.id
      LEFT JOIN albums a ON t.album_id = a.id
      LEFT JOIN artists ar ON a.artist_id = ar.id
      WHERE pt.playlist_id = ? `,
      [playlistId]
    );
    return rows;
  }
};

export default Playlist;