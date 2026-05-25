import pool from '../config/database.js';
import { isValidUUID } from '../utils/validateUuid.js';

const jobModel = {
  create: async (data) => {
    const fields = [
      'company_id', 'category_id', 'title', 'description', 'job_type',
      'experience_level', 'location_type', 'location_city', 'salary_min',
      'salary_max', 'is_salary_visible', 'status', 'created_by'
    ];
    const values = fields.map(f => data[f]);
    const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');
    const query = `
      INSERT INTO jobs (${fields.join(', ')})
      VALUES (${placeholders})
      RETURNING *
    `;
    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  findAll: async (filters = {}) => {
    let query = `
      SELECT j.*, 
             c.name as company_name, c.location as company_location,
             cat.name as category_name
      FROM jobs j
      LEFT JOIN companies c ON j.company_id = c.id
      LEFT JOIN categories cat ON j.category_id = cat.id
      WHERE 1=1
    `;
    const values = [];
    let idx = 1;

    if (filters.title) {
      query += ` AND j.title ILIKE $${idx}`;
      values.push(`%${filters.title}%`);
      idx++;
    }

    if (filters['company-name']) {
      query += ` AND c.name ILIKE $${idx}`;
      values.push(`%${filters['company-name']}%`);
      idx++;
    }

    query += ` ORDER BY j.created_at DESC`;
    const { rows } = await pool.query(query, values);
    return rows;
  },

  findById: async (id) => {
    if (!isValidUUID(id)) return null;
    const query = `
      SELECT j.*, 
             c.name as company_name, c.location as company_location,
             cat.name as category_name
      FROM jobs j
      LEFT JOIN companies c ON j.company_id = c.id
      LEFT JOIN categories cat ON j.category_id = cat.id
      WHERE j.id = $1
    `;
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  },

  findByCompanyId: async (companyId) => {
    if (!isValidUUID(companyId)) return [];
    try {
      const query = `
        SELECT j.*, c.name as company_name, cat.name as category_name
        FROM jobs j
        LEFT JOIN companies c ON j.company_id = c.id
        LEFT JOIN categories cat ON j.category_id = cat.id
        WHERE j.company_id = $1
        ORDER BY j.created_at DESC
      `;
      const { rows } = await pool.query(query, [companyId]);
      return rows;
    } catch (error) {
      return [];
    }
  },

  findByCategoryId: async (categoryId) => {
    if (!isValidUUID(categoryId)) return [];
    try {
      const query = `
        SELECT j.*, c.name as company_name, cat.name as category_name
        FROM jobs j
        LEFT JOIN companies c ON j.company_id = c.id
        LEFT JOIN categories cat ON j.category_id = cat.id
        WHERE j.category_id = $1
        ORDER BY j.created_at DESC
      `;
      const { rows } = await pool.query(query, [categoryId]);
      return rows;
    } catch (error) {
      return [];
    }
  },

  update: async (id, data) => {
    if (!isValidUUID(id)) return null;
    const allowedFields = [
      'company_id', 'category_id', 'title', 'description', 'job_type',
      'experience_level', 'location_type', 'location_city', 'salary_min',
      'salary_max', 'is_salary_visible', 'status'
    ];
    const updates = [];
    const values = [];
    let idx = 1;
    for (const field of allowedFields) {
      if (data[field] !== undefined) {
        updates.push(`${field} = $${idx}`);
        values.push(data[field]);
        idx++;
      }
    }
    if (updates.length === 0) return null;
    values.push(id);
    const query = `
      UPDATE jobs SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${idx}
      RETURNING *
    `;
    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  delete: async (id) => {
    if (!isValidUUID(id)) return null;
    const query = `DELETE FROM jobs WHERE id = $1 RETURNING id`;
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }
};

export default jobModel;