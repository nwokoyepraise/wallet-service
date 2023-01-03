import { IsISO31661Alpha2 } from 'class-validator';
import { Knex } from 'knex';
import { EmailVerifUsage } from 'src/auth/auth.enum';
import { Iso4217 } from 'src/common/enums';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTableIfNotExists('users', (table) => {
    table.string('user_id').primary();
    table.string('email').notNullable();
    table.smallint('email_verified').defaultTo(0);
    table.string('password').notNullable();
    table.timestamps(true, true, false);
  });

  await knex.schema.createTableIfNotExists('email_verifs', (table) => {
    table.string('user_id').primary().references('users.user_id');
    table.string('email').notNullable();
    table.string('token').defaultTo(false);
    table.enum('usage', Object.values(EmailVerifUsage)).defaultTo(false);
    table.timestamps(true, true, false);
  });

  await knex.schema.createTableIfNotExists('wallets', (table) => {
    table.string('wallet_id').primary();
    table.string('user_id').notNullable().references('users.user_id');
    table.integer('balance').unsigned().defaultTo(0);
    table.string('currency').defaultTo(Iso4217.NGN);
    table.timestamps(true, true, false);
  });

  await knex.schema.createTableIfNotExists('accounts', (table) => {
    table.string('account_id').primary();
    table.string('user_id').notNullable().references('users.user_id');
    table.string('bank_code').notNullable();
    table.string('account_number').notNullable();
    table.string('country').defaultTo('NG');
    table.timestamps(true, true, false);
  });

  await knex.schema.createTableIfNotExists('transactions', (table) => {
    table.string('transaction_id').primary();
    table.string('source').references('users.user_id');
    table.string('beneficiary').references('users.user_id');
    table.integer('amount').notNullable();
    table.enum('currency', Object.values(Iso4217)).defaultTo(Iso4217.NGN);
    table.enum('type', Object.values(Iso4217)).defaultTo(Iso4217.NGN);
    table.timestamps(true, true, false);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('users');
  await knex.schema.dropTableIfExists('email_verifs');
  await knex.schema.dropTableIfExists('wallets');
  await knex.schema.dropTableIfExists('accounts');
  await knex.schema.dropTableIfExists('transactions');
}
