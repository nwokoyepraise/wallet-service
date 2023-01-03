import { Injectable } from '@nestjs/common';
import { InjectKnex, Knex } from 'nestjs-knex';
import { KeyGen } from 'src/common/utils/key-gen';
import { AddUserDto } from './users.interface';

@Injectable()
export class UsersService {
  constructor(@InjectKnex() private readonly knex: Knex) {}

  async addUser(addUserDto: AddUserDto) {
    return await this.knex.table('users').insert({ user_id: `US${KeyGen.gen(15)}`, ...addUserDto });
  }
}
