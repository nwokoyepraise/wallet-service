import * as dotenv from "dotenv";
import {resolve} from "path";
dotenv.config();
console.log(process.env)
module.exports = {
  development: {
    client: 'mysql2',
    connection: {
      host: process.env.DB_HOST,
      user: process.env.MYSQLDB_USER,
      password: 'diu8YHdkoio92Jdi',
      database: 'wsdb',
      port: Number(process.env.MYSQLDB_DOCKER_PORT),
    },
    migrations: {
      extension: 'ts',
      directory: './src/db/migrations',
    },
  },
};
