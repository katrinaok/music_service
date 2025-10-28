import db from "../config/config.js";

const Genre = {
  getAll: async () => {
    const [rows] = await db.query("SELECT * FROM genres");
    return rows;
  },

  getById: async (id) => {
    const [rows] = await db.query("SELECT * FROM genres WHERE id = ?", [id]);
    return rows[0];
  },

  create: async (genre) => {
    const { name, description } = genre;
    
    const [countRows] = await db.query("SELECT COUNT(*) AS count FROM genres");
    if (countRows[0].count === 0) {
      await db.query("ALTER TABLE genres AUTO_INCREMENT = 1");
    }

    const [result] = await db.query(
      "INSERT INTO genres (name, description) VALUES (?, ?)",
      [name, description]
    );

    return { id: result.insertId, name, description };
  },

  update: async (id, genre) => {
    const { name, description } = genre;
    await db.query(
      "UPDATE genres SET name = ?, description = ? WHERE id = ?",
      [name, description, id]
    );
  },

  delete: async (id) => {
    await db.query("DELETE FROM genres WHERE id = ?", [id]);
  },
};

export default Genre;