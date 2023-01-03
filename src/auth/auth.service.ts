import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectKnex, Knex } from 'nestjs-knex';
import { KeyGen } from 'src/common/utils/key-gen';
import { text } from 'stream/consumers';
import { GetEmailTokenParams } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(@InjectKnex() private readonly knex: Knex) {}
  async getEmailToken({
    user_id,
    email,
  }: GetEmailTokenParams): Promise<any> {
    return (
      await this.knex
        .select('*')
        .from('email_verifs')
        .where({ user_id, email })
    )[0];
  }

  async verifyEmailToken(
    user_id: string,
    email: string,
  ) {
    await this.knex.transaction(async function (tx) {
      await tx
        .table('users')
        .update({ email_verified: 1 })
        .where({ user_id });

      await tx
        .table('email_verifs')
        .where({
          email,
          user_id,
        })
        .delete();

      await tx
        .table('wallets')
        .insert({ user_id, wallet_id: `WA${KeyGen.gen(13)}` });
    });

    return true;
  }
}
