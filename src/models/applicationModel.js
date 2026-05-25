import pool from '../config/database.js';
import { isValidUUID } from '../utils/validateUuid.js';

const applicationModel = {
  create: async ({ userId, jobId, status = 'pending' }) => {
    const query = `
      INSERT INTO applications (user_id, job_id, status)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const { rows } = await pool.query(query, [userId, jobId, status]);
    return rows[0];
  },

  findAll: async () => {
    const query = `
      SELECT a.*, u.name as user_name, j.title as job_title
      FROM applications a
      LEFT JOIN users u ON a.user_id = u.id
      LEFT JOIN jobs j ON a.job_id = j.id
      ORDER BY a.applied_at DESC
    `;
    const { rows } = await pool.query(query);
    return rows;
  },

  findById: async (id) => {
    if (!isValidUUID(id)) return null;
    const query = `
      SELECT a.*, u.name as user_name, j.title as job_title
      FROM applications a
      LEFT JOIN users u ON a.user_id = u.id
      LEFT JOIN jobs j ON a.job_id = j.id
      WHERE a.id = $1
    `;
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  },

  findByUserId: async (userId) => {
    if (!isValidUUID(userId)) return [];
    try {
      const query = `
        SELECT a.*, j.title as job_title, j.company_id, c.name as company_name
        FROM applications a
        LEFT JOIN jobs j ON a.job_id = j.id
        LEFT JOIN companies c ON j.company_id = c.id
        WHERE a.user_id = $1
        ORDER BY a.applied_at DESC
      `;
      const { rows } = await pool.query(query, [userId]);
      return rows;
    } catch (error) {
      return [];
    }
  },

  findByJobId: async (jobId) => {
    if (!isValidUUID(jobId)) return [];
    try {
      const query = `
        SELECT a.*, u.name as user_name
        FROM applications a
        LEFT JOIN users u ON a.user_id = u.id
        WHERE a.job_id = $1
        ORDER BY a.applied_at DESC
      `;
      const { rows } = await pool.query(query, [jobId]);
      return rows;
    } catch (error) {
      return [];
    }
  },

  updateStatus: async (id, status) => {
    if (!isValidUUID(id)) return null;
    const query = `
      UPDATE applications SET status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `;
    const { rows } = await pool.query(query, [status, id]);
    return rows[0];
  },

  delete: async (id) => {
    if (!isValidUUID(id)) return null;
    const query = `DELETE FROM applications WHERE id = $1 RETURNING id`;
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }
};

export default applicationModel;