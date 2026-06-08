import pool from '../config/database.js';
import { isValidUUID } from '../utils/validateUuid.js';

const userModel = {
  create: async ({ name, email, password, role = 'user' }) => {
    const query = `
      INSERT INTO users (name, email, password, role)
      VALUES ($1, $2, $3, $4)
      RETURNING id, name, email, role, created_at, updated_at
    `;
    const values = [name, email, password, role];
    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  findByEmail: async (email) => {
    const query = `SELECT * FROM users WHERE email = $1`;
    const { rows } = await pool.query(query, [email]);
    return rows[0];
  },

  findById: async (id) => {
    if (!isValidUUID(id)) return null;
    const query = `SELECT id, name, email, role, created_at, updated_at FROM users WHERE id = $1`;
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  },

  update: async (id, updates) => {
    if (!isValidUUID(id)) return null;
    const fields = [];
    const values = [];
    let idx = 1;
    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined) {
        fields.push(`${key} = $${idx}`);
        values.push(value);
        idx++;
      }
    }
    if (fields.length === 0) return null;
    values.push(id);
    const query = `
      UPDATE users SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${idx}
      RETURNING id, name, email, role, created_at, updated_at
    `;
    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  delete: async (id) => {
    if (!isValidUUID(id)) return null;
    const query = `DELETE FROM users WHERE id = $1 RETURNING id`;
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }
};

export default userModel;