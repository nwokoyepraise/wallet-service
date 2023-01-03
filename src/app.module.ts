import { Module } from '@nestjs/common';
import { KnexModule } from 'nestjs-knex';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TransactionsModule } from './transactions/transactions.module';
import { WalletsModule } from './wallets/wallets.module';

@Module({
  imports: [
    KnexModule.forRoot({
      config: {
        client: 'mysql2',
        connection: {
          host: process.env.DB_HOST,
          user: process.env.MYSQLDB_USER,
          password: process.env.MYSQLDB_ROOT_PASSWORD,
          database: process.env.MYSQLDB_DATABASE,
          port: Number(process.env.MYSQLDB_DOCKER_PORT)
        },
      },
    }),
    UsersModule,
    AuthModule,
    TransactionsModule,
    WalletsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
