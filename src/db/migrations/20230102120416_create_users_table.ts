import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', (table) => {
    table.string('user_id').defaultTo('user_001').primary();
    table.string('email').notNullable();
    table.boolean('email_verified').defaultTo(false);
    table.string('password').notNullable();
    table.timestamps(true, true, false);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('users');
}
