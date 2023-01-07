import { Knex } from 'knex';
import { TransactionStatus, TransactionType } from '../../transactions/transactions.enum';
import { Iso4217 } from '../../common/enums';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', (table) => {
    table.string('user_id').primary();
    table.string('email').notNullable();
    table.smallint('email_verified').defaultTo(0);
    table.string('password').notNullable();
    table.timestamps(true, true, false);
  });

  await knex.schema.createTable('email_verifs', (table) => {
    table.string('user_id').primary().references('users.user_id');
    table.string('email').notNullable();
    table.string('token').notNullable()
    table.timestamps(true, true, false);
  });

  await knex.schema.createTable('wallets', (table) => {
    table.string('wallet_id').primary();
    table.string('user_id').notNullable().references('users.user_id');
    table.decimal('balance', 15, 2).unsigned().defaultTo(0);
    table.string('currency').defaultTo(Iso4217.NGN);
    table.timestamps(true, true, false);
  });

  await knex.schema.createTable('accounts', (table) => {
    table.string('account_id').primary();
    table.string('user_id').notNullable().references('users.user_id');
    table.string('bank_code').notNullable();
    table.string('account_number').notNullable();
    table.string('country').defaultTo('NG');
    table.timestamps(true, true, false);
  });

  await knex.schema.createTable('transactions', (table) => {
    table.string('transaction_id').primary();
    table.string('source').references('users.user_id').notNullable();
    table.string('ref').notNullable();
    table.string('beneficiary').references('users.user_id').defaultTo(null);
    table.decimal('amount', 15, 2).notNullable();
    table.enum('currency', Object.values(Iso4217)).defaultTo(Iso4217.NGN);
    table.enum('type', Object.values(TransactionType)).notNullable();
    table.enum('status', Object.values(TransactionStatus)).defaultTo(TransactionStatus.PENDING);
    table.timestamps(true, true, false);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('users');
  await knex.schema.dropTable('email_verifs');
  await knex.schema.dropTable('wallets');
  await knex.schema.dropTable('accounts');
  await knex.schema.dropTable('transactions');
}
