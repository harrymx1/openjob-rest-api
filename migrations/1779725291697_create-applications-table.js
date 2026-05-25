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
  pgm.createTable('applications', {
    id: { type: 'uuid', default: pgm.func('gen_random_uuid()'), primaryKey: true },
    user_id: { type: 'uuid', references: 'users(id)', onDelete: 'CASCADE', notNull: true },
    job_id: { type: 'uuid', references: 'jobs(id)', onDelete: 'CASCADE', notNull: true },
    status: { type: 'varchar(20)', default: 'pending' },
    applied_at: { type: 'timestamp', default: pgm.func('current_timestamp') },
    updated_at: { type: 'timestamp', default: pgm.func('current_timestamp') }
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable('applications');
};