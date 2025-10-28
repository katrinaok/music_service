import db from "../config/config.js";

const Album = {
  getAll: async () => {
    const [rows] = await db.query("SELECT * FROM albums");
    return rows;
  },

  getById: async (id) => {
    const [rows] = await db.query("SELECT * FROM albums WHERE id = ?", [id]);
    return rows[0];
  },

  create: async (album) => {
    const { title, artist_id, release_year, cover_url } = album;

    const [countRows] = await db.query("SELECT COUNT(*) AS count FROM albums");
    if (countRows[0].count === 0) {
      await db.query("ALTER TABLE albums AUTO_INCREMENT = 1");
    }

    const [result] = await db.query(
      "INSERT INTO albums (title, artist_id, release_year, cover_url) VALUES (?, ?, ?, ?)",
      [title, artist_id, release_year, cover_url]
    );

    return { id: result.insertId };
  },

  update: async (id, album) => {
    const { title, artist_id, release_year, cover_url } = album;
    await db.query(
      "UPDATE albums SET title=?, artist_id=?, release_year=?, cover_url=? WHERE id=?",
      [title, artist_id, release_year, cover_url, id]
    );
  },

  delete: async (id) => {
    await db.query("DELETE FROM albums WHERE id = ?", [id]);
  },
};

export default Album;