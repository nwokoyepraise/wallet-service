import { Injectable } from '@nestjs/common';
import { InjectKnex, Knex } from 'nestjs-knex';
import { KeyGen } from 'src/common/utils/key-gen';
import { FundWalletDto } from './transactions.dto';
import { TransactionStatus, TransactionType } from './transactions.enum';

@Injectable()
export class TransactionsService {
  constructor(@InjectKnex() private readonly knex: Knex) {}

  async initiateWalletFunding(
    user_id: string,
    ref: string,
    { amount, currency }: FundWalletDto,
  ) {
    let tx = {
      trasaction_id: `tr${ref}`,
      ref,
      source: user_id,
      amount,
      currency,
      status: TransactionStatus.PENDING,
      type: TransactionType.FUNDING,
    };
    await this.knex.table('transactions').insert(tx);
    return tx;
  }
}
