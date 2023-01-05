import * as dotenv from "dotenv";
dotenv.config();
module.exports = {
  development: {
    client: 'mysql2',
    connection: {
      host: process.env.MYSQLDB_HOST,
      user: process.env.MYSQLDB_USER,
      password: process.env.MYSQLDB_ROOT_PASSWORD,
      database: process.env.MYSQLDB_DATABASE,
      port: Number(process.env.MYSQLDB_PORT),
    },
    migrations: {
      extension: 'ts',
      directory: './src/db/migrations',
    },
  },
  production: {
    client: 'mysql2',
    connection: {
      host: process.env.MYSQLDB_HOST,
      user: process.env.MYSQLDB_USER,
      password: process.env.MYSQLDB_ROOT_PASSWORD,
      database: process.env.MYSQLDB_DATABASE,
      port: Number(process.env.MYSQLDB_PORT),
    },
    migrations: {
      extension: 'ts',
      directory: './src/db/migrations',
    },
  },
};
