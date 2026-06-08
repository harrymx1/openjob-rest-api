import db from './src/config/database.js';

async function test() {
  try {
    const query = `
      SELECT b.id, b.user_id, b.job_id, b.created_at, b.updated_at,
             j.company_id, j.category_id, j.title, j.description, j.job_type, j.experience_level, j.location_type, j.location_city, j.salary_min, j.salary_max, j.is_salary_visible, j.status,
             c.name as company_name
      FROM bookmarks b
      JOIN jobs j ON b.job_id = j.id
      JOIN companies c ON j.company_id = c.id
      WHERE b.id = $1
    `;
    const { rows } = await db.query(query, ['e24d2389-37b0-4e23-a1fb-f1419226b1d0']);
    console.log('success', rows);
    process.exit(0);
  } catch(e) {
    console.error('SQL ERROR:', e.message);
    process.exit(1);
  }
}

test();
