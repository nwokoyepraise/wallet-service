import { Injectable } from '@nestjs/common';
import { InjectKnex, Knex } from 'nestjs-knex';
import { KeyGen } from '../common/utils/key-gen';
import { AddWalletDto, Wallet } from './wallets.dto';

@Injectable()
export class WalletsService {
  constructor(@InjectKnex() private readonly knex: Knex) {}

  async walletExists(wallet_id: string) {
    let wallet = (
      await this.knex.select('wallet_id').from('wallets').where({ wallet_id })
    )[0];
    return wallet?.wallet_id ? true : false;
  }

  async findWallet(field: string, key: string): Promise<Wallet> {
    return (
      await this.knex
        .select('*')
        .from('wallets')
        .where({ [field]: key })
    )[0];
  }
}
