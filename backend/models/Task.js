const pool = require("../config/db");

const Task = {
  async create(userId, title, description) {
    const [result] = await pool.execute(
      "INSERT INTO tasks (user_id, title, description) VALUES (?, ?, ?)",
      [userId, title, description]
    );
    return result.insertId;
  },

  async findAllByUserId(userId) {
    const [rows] = await pool.execute("SELECT * FROM tasks WHERE user_id = ?", [
      userId,
    ]);
    return rows;
  },

  async findById(id, userId) {
    const [rows] = await pool.execute(
      "SELECT * FROM tasks WHERE id = ? AND user_id = ?",
      [id, userId]
    );
    return rows[0];
  },

  async update(id, title, description, status) {
    await pool.execute(
      "UPDATE tasks SET title = ?, description = ?, status = ? WHERE id = ?",
      [title, description, status, id]
    );
  },

  async delete(id) {
    await pool.execute("DELETE FROM tasks WHERE id = ?", [id]);
  },
};

module.exports = Task;
