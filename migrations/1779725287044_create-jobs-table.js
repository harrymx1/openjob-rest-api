/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  pgm.createTable('jobs', {
    id: { type: 'uuid', default: pgm.func('gen_random_uuid()'), primaryKey: true },
    company_id: { type: 'uuid', references: 'companies(id)', onDelete: 'CASCADE', notNull: true },
    category_id: { type: 'uuid', references: 'categories(id)', onDelete: 'SET NULL' },
    title: { type: 'varchar(255)', notNull: true },
    description: { type: 'text' },
    job_type: { type: 'varchar(50)' },
    experience_level: { type: 'varchar(50)' },
    location_type: { type: 'varchar(50)' },
    location_city: { type: 'varchar(100)' },
    salary_min: { type: 'bigint' },
    salary_max: { type: 'bigint' },
    is_salary_visible: { type: 'boolean', default: false },
    status: { type: 'varchar(20)', default: 'open' },
    created_by: { type: 'uuid', references: 'users(id)', onDelete: 'SET NULL' },
    created_at: { type: 'timestamp', default: pgm.func('current_timestamp') },
    updated_at: { type: 'timestamp', default: pgm.func('current_timestamp') }
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable('jobs');
};
