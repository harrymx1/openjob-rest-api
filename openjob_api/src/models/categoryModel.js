import pool from '../config/database.js';
import { isValidUUID } from '../utils/validateUuid.js';

const categoryModel = {
  create: async ({ name }) => {
    const query = `INSERT INTO categories (name) VALUES ($1) RETURNING *`;
    const { rows } = await pool.query(query, [name]);
    return rows[0];
  },

  findAll: async () => {
    const { rows } = await pool.query(`SELECT * FROM categories ORDER BY name`);
    return rows;
  },

  findById: async (id) => {
    if (!isValidUUID(id)) return null;
    const query = `SELECT * FROM categories WHERE id = $1`;
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  },

  update: async (id, name) => {
    if (!isValidUUID(id)) return null;
    const query = `UPDATE categories SET name = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *`;
    const { rows } = await pool.query(query, [name, id]);
    return rows[0];
  },

  delete: async (id) => {
    if (!isValidUUID(id)) return null;
    const query = `DELETE FROM categories WHERE id = $1 RETURNING id`;
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }
};

export default categoryModel;