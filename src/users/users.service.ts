import { Injectable } from '@nestjs/common';
import { InjectKnex, Knex } from 'nestjs-knex';
import { AddUserDto, User } from './users.interface';

@Injectable()
export class UsersService {
  constructor(@InjectKnex() private readonly knex: Knex) {}

  async addUser(addUserDto: AddUserDto) {
    await this.knex.transaction(async function (tx) {
      await tx.table('users').insert(addUserDto);

      await tx
        .table('email_verifs')
        .insert({
          email: addUserDto.email,
          user_id: addUserDto.user_id,
        });
    });
    return addUserDto;
  }

  async findUser(field: string, key: string): Promise<any> {
    return (
      await this.knex
        .select('*')
        .from('users')
        .where({ [field]: key })
    )[0];
  }


  async getCredential(field: string, key: string): Promise<any> {
    return (
      await this.knex
        .select('*')
        .from('users')
        .where({ [field]: key, email_verified: 1 })
    )[0];
  }
}
