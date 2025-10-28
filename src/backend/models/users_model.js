import db from "../config/config.js";

const User = {
  async getAll() {
    const [results] = await db.query("SELECT * FROM users");
    return results;
  },

  async getById(id) {
    const [results] = await db.query("SELECT * FROM users WHERE id = ?", [id]);
    return results[0];
  },

  async create(data) {
    const { username, email, password, role } = data;
    
    const [countRows] = await db.query("SELECT COUNT(*) AS count FROM users");
    if (countRows[0].count === 0) {
      await db.query("ALTER TABLE users AUTO_INCREMENT = 1");
    }

    const [result] = await db.query(
      "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)",
      [username, email, password, role]
    );

    return { id: result.insertId };
  },

  async findByLogin(identifier, password) {
    const [results] = await db.query(
      "SELECT * FROM users WHERE (username = ? OR email = ?) AND password = ?",
      [identifier, identifier, password]
    );
    return results[0];
  },

  async update(id, data) {
    const [result] = await db.query("UPDATE users SET ? WHERE id = ?", [data, id]);
    return result;
  },

  async delete(id) {
    const [result] = await db.query("DELETE FROM users WHERE id = ?", [id]);
    return result;
  },
};

export default User;