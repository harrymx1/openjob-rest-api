import pool from '../config/database.js';
import { isValidUUID } from '../utils/validateUuid.js';

const companyModel = {
  create: async ({ name, location, description, createdBy }) => {
    const query = `
      INSERT INTO companies (name, location, description, created_by)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const values = [name, location, description, createdBy];
    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  findAll: async () => {
    const { rows } = await pool.query(`
      SELECT id, name, location, description, created_at, updated_at
      FROM companies
      ORDER BY created_at DESC
    `);
    return rows;
  },

  findById: async (id) => {
    if (!isValidUUID(id)) return null;
    const query = `
      SELECT id, name, location, description, created_at, updated_at
      FROM companies
      WHERE id = $1
    `;
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
      UPDATE companies SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${idx}
      RETURNING *
    `;
    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  delete: async (id) => {
    if (!isValidUUID(id)) return null;
    const query = `DELETE FROM companies WHERE id = $1 RETURNING id`;
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }
};

export default companyModel;