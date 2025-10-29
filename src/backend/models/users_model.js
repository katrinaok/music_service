import db from "../config/config.js";
import bcrypt from "bcrypt";

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

    const hashedPassword = await bcrypt.hash(password, 10);

    const [countRows] = await db.query("SELECT COUNT(*) AS count FROM users");
    if (countRows[0].count === 0) {
      await db.query("ALTER TABLE users AUTO_INCREMENT = 1");
    }

    const [result] = await db.query(
      "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)",
      [username, email, hashedPassword, role || "user"]
    );

    return { id: result.insertId };
  },

  async findByLogin(identifier) {
    const [results] = await db.query(
      "SELECT * FROM users WHERE username = ? OR email = ?",
      [identifier, identifier]
    );
    return results[0];
  },

  async update(id, data) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    const [result] = await db.query("UPDATE users SET ? WHERE id = ?", [data, id]);
    return result;
  },

  async delete(id) {
    const [result] = await db.query("DELETE FROM users WHERE id = ?", [id]);
    return result;
  },
};

export default User;