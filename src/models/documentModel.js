import pool from '../config/database.js';
import { isValidUUID } from '../utils/validateUuid.js';

const documentModel = {
  create: async ({ userId, fileName, fileUrl, fileType }) => {
    if (!isValidUUID(userId)) return null;
    const query = `
      INSERT INTO documents (user_id, file_name, file_url, file_type)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const { rows } = await pool.query(query, [userId, fileName, fileUrl, fileType]);
    return rows[0];
  },

  findAll: async () => {
    const query = `
      SELECT d.*, u.name as user_name
      FROM documents d
      LEFT JOIN users u ON d.user_id = u.id
      ORDER BY d.uploaded_at DESC
    `;
    const { rows } = await pool.query(query);
    return rows;
  },

  findById: async (id) => {
    if (!isValidUUID(id)) return null;
    const query = `
      SELECT d.*, u.name as user_name
      FROM documents d
      LEFT JOIN users u ON d.user_id = u.id
      WHERE d.id = $1
    `;
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  },

  delete: async (id) => {
    if (!isValidUUID(id)) return null;
    const query = `DELETE FROM documents WHERE id = $1 RETURNING id, file_url`;
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }
};

export default documentModel;