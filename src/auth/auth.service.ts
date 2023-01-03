import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectKnex, Knex } from 'nestjs-knex';
import { KeyGen } from 'src/common/utils/key-gen';
import { text } from 'stream/consumers';
import { GetEmailTokenParams } from './auth.dto';
import { EmailVerifUsage } from './auth.enum';

@Injectable()
export class AuthService {
  constructor(@InjectKnex() private readonly knex: Knex) {}
  async getEmailToken({
    userId,
    email,
    usage,
  }: GetEmailTokenParams): Promise<any> {
    return (
      await this.knex
        .select('*')
        .from('email_verifs')
        .where({ userId: userId, email: email, usage: usage })
    )[0];
  }

  async verifyEmailToken(
    user_id: string,
    email: string,
  ) {
    await this.knex.transaction(async function (tx) {
      await tx
        .table('users')
        .update({ email_verified: true })
        .where({ user_id });

      await tx
        .table('email_verifs')
        .where({
          email,
          user_id,
          usage: EmailVerifUsage.VERIFICATION,
        })
        .delete();

      await tx
        .table('wallets')
        .insert({ user_id, wallet_id: `US${KeyGen.gen(13)}` });
    });

    return true;
  }
}
