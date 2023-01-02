import { Module } from '@nestjs/common';
import { KnexModule } from 'nestjs-knex';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    KnexModule.forRoot({
      config: {
        client: 'mysql2',
        connection: {
          host: 'localhost',
          user: process.env.MYSQLDB_USER,
          password: process.env.MYSQLDB_ROOT_PASSWORD,
          database: process.env.MYSQLDB_DATABASE,
          port: Number(process.env.MYSQLDB_DOCKER_PORT)
        },
      },
    }),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
