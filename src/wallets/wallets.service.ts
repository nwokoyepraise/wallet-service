import { Injectable } from '@nestjs/common';
import { InjectKnex, Knex } from 'nestjs-knex';

@Injectable()
export class WalletsService {
  constructor(@InjectKnex() private readonly knex: Knex) {}

  async walletExists(wallet_id: string) {
    let wallet = (
      await this.knex.select('wallet_id').from('wallets').where({ wallet_id })
    )[0];
    return wallet?.wallet_id ? true : false;
  }
}
