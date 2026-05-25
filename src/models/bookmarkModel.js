import pool from '../config/database.js';
import { isValidUUID } from '../utils/validateUuid.js';

const bookmarkModel = {
  create: async ({ userId, jobId }) => {
    if (!isValidUUID(userId) || !isValidUUID(jobId)) return null;
    const query = `
      INSERT INTO bookmarks (user_id, job_id)
      VALUES ($1, $2)
      ON CONFLICT DO NOTHING
      RETURNING *
    `;
    const { rows } = await pool.query(query, [userId, jobId]);
    return rows[0];
  },

  findByUser: async (userId) => {
    if (!isValidUUID(userId)) return [];
    const query = `
      SELECT b.*, j.title as job_title, j.company_id, c.name as company_name
      FROM bookmarks b
      LEFT JOIN jobs j ON b.job_id = j.id
      LEFT JOIN companies c ON j.company_id = c.id
      WHERE b.user_id = $1
      ORDER BY b.created_at DESC
    `;
    const { rows } = await pool.query(query, [userId]);
    return rows;
  },

  findById: async (id) => {
    if (!isValidUUID(id)) return null;
    const query = `SELECT * FROM bookmarks WHERE id = $1`;
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  },

  findByUserAndJob: async (userId, jobId) => {
    if (!isValidUUID(userId) || !isValidUUID(jobId)) return null;
    const query = `SELECT * FROM bookmarks WHERE user_id = $1 AND job_id = $2`;
    const { rows } = await pool.query(query, [userId, jobId]);
    return rows[0];
  },

  deleteByUserAndJob: async (userId, jobId) => {
    if (!isValidUUID(userId) || !isValidUUID(jobId)) return null;
    const query = `DELETE FROM bookmarks WHERE user_id = $1 AND job_id = $2 RETURNING id`;
    const { rows } = await pool.query(query, [userId, jobId]);
    return rows[0];
  },

  deleteById: async (id) => {
    if (!isValidUUID(id)) return null;
    const query = `DELETE FROM bookmarks WHERE id = $1 RETURNING id`;
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }
};

export default bookmarkModel;