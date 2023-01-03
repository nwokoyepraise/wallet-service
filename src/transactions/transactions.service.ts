import { Injectable } from '@nestjs/common';
import { InjectKnex, Knex } from 'nestjs-knex';
import { KeyGen } from 'src/common/utils/key-gen';
import { FundWalletDto, Transaction } from './transactions.dto';
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
      transaction_id: `tr${ref}`,
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

  async completeWalletFunding({ transaction_id, source, amount }: Transaction) {
    await this.knex.transaction(async function (tx) {
      await tx.table('wallets').increment('balance', amount).where({
        user_id: source,
      });

      await tx
        .table('transactions')
        .update({ status: TransactionStatus.COMPLETED })
        .where({ transaction_id });
    });

    return true;
  }

  async findTransaction(field: string, key: string): Promise<Transaction> {
    return (
      await this.knex
        .select('*')
        .from('transactions')
        .where({ [field]: key })
    )[0];
  }
}
