import { Injectable } from '@nestjs/common';
import { InjectKnex, Knex } from 'nestjs-knex';
import { EmailVerifUsage } from 'src/auth/auth.enum';
import { KeyGen } from 'src/common/utils/key-gen';
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
          usage: EmailVerifUsage.VERIFICATION,
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
}
