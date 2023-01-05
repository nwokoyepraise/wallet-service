import { Injectable } from '@nestjs/common';
import { InjectKnex, Knex } from 'nestjs-knex';
import { KeyGen } from '../common/utils/key-gen';
import { TokenHandler } from '../common/utils/token-handler';
import { AddUserDto, User } from './users.dto';

@Injectable()
export class UsersService {
  constructor(@InjectKnex() private readonly knex: Knex) {}

  async addUser(addUserDto: AddUserDto) {
    await this.knex.transaction(async function (tx) {
      const token = await KeyGen.gen(6, 'numeric');

      //hash token
      const tokenHash = await TokenHandler.hashKey(token);

      await tx.table('users').insert(addUserDto);

      await tx.table('email_verifs').insert({
        email: addUserDto.email,
        user_id: addUserDto.user_id,
        token: tokenHash
      });
    });
    addUserDto.password = undefined;
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
