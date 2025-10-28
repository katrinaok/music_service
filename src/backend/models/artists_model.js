import db from "../config/config.js";

const Artist = {
  getAll: async () => {
    const [rows] = await db.query("SELECT * FROM artists");
    return rows;
  },

  getById: async (id) => {
    const [rows] = await db.query("SELECT * FROM artists WHERE id = ?", [id]);
    return rows[0];
  },

  create: async (artist) => {
    const { name, bio, image_url } = artist;
    
    const [countRows] = await db.query("SELECT COUNT(*) AS count FROM artists");
    if (countRows[0].count === 0) {
      await db.query("ALTER TABLE artists AUTO_INCREMENT = 1");
    }

    const [result] = await db.query(
      "INSERT INTO artists (name, bio, image_url) VALUES (?, ?, ?)",
      [name, bio, image_url]
    );

    return { id: result.insertId };
  },

  update: async (id, artist) => {
    const { name, bio, image_url } = artist;
    await db.query(
      "UPDATE artists SET name = ?, bio = ?, image_url = ? WHERE id = ?",
      [name, bio, image_url, id]
    );
  },

  delete: async (id) => {
    await db.query("DELETE FROM artists WHERE id = ?", [id]);
  },
};

export default Artist;