import pool from '../config/database.js';
import { isValidUUID } from '../utils/validateUuid.js';

const refreshTokenModel = {
  create: async ({ userId, token, expiresAt }) => {
    if (!isValidUUID(userId)) return null;
    const query = `
      INSERT INTO refresh_tokens (user_id, token, expires_at)
      VALUES ($1, $2, $3)
      RETURNING id, user_id, token, expires_at, created_at
    `;
    const values = [userId, token, expiresAt];
    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  findByToken: async (token) => {
    const query = `SELECT * FROM refresh_tokens WHERE token = $1`;
    const { rows } = await pool.query(query, [token]);
    return rows[0];
  },

  deleteByToken: async (token) => {
    const query = `DELETE FROM refresh_tokens WHERE token = $1 RETURNING id`;
    const { rows } = await pool.query(query, [token]);
    return rows[0];
  },

  deleteByUserId: async (userId) => {
    if (!isValidUUID(userId)) return;
    await pool.query(`DELETE FROM refresh_tokens WHERE user_id = $1`, [userId]);
  }
};

export default refreshTokenModel;