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

  findAll: async () => {
    const query = `
      SELECT b.id, b.user_id, b.job_id, b.created_at, b.created_at as updated_at,
             j.company_id, j.category_id, j.title, j.description, j.job_type, j.experience_level, j.location_type, j.location_city, j.salary_min, j.salary_max, j.is_salary_visible, j.status,
             c.name as company_name
      FROM bookmarks b
      JOIN jobs j ON b.job_id = j.id
      JOIN companies c ON j.company_id = c.id
      ORDER BY b.created_at DESC
    `;
    const { rows } = await pool.query(query);
    return rows;
  },

  findByUser: async (userId) => {
    if (!isValidUUID(userId)) return [];
    try {
      const query = `
        SELECT b.id, b.user_id, b.job_id, b.created_at, b.created_at as updated_at,
               j.company_id, j.category_id, j.title, j.description, j.job_type, j.experience_level, j.location_type, j.location_city, j.salary_min, j.salary_max, j.is_salary_visible, j.status,
               c.name as company_name
        FROM bookmarks b
        JOIN jobs j ON b.job_id = j.id
        JOIN companies c ON j.company_id = c.id
        WHERE b.user_id = $1
        ORDER BY b.created_at DESC
      `;
      const { rows } = await pool.query(query, [userId]);
      return rows;
    } catch (error) {
      return [];
    }
  },

  findById: async (id) => {
    if (!isValidUUID(id)) return null;
    const query = `
      SELECT b.id, b.user_id, b.job_id, b.created_at, b.created_at as updated_at,
             j.company_id, j.category_id, j.title, j.description, j.job_type, j.experience_level, j.location_type, j.location_city, j.salary_min, j.salary_max, j.is_salary_visible, j.status,
             c.name as company_name
      FROM bookmarks b
      JOIN jobs j ON b.job_id = j.id
      JOIN companies c ON j.company_id = c.id
      WHERE b.id = $1
    `;
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