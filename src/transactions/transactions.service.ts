import { Injectable } from '@nestjs/common';
import { InjectKnex, Knex } from 'nestjs-knex';
import { Iso4217 } from 'src/common/enums';
import {
  NotWalletOwnerException,
  WalletNotFoundException,
} from 'src/common/exceptions';
import { KeyGen } from 'src/common/utils/key-gen';
import { Wallet } from 'src/wallets/wallets.dto';
import {
  FundWalletDto,
  Transaction,
  TransferDto,
  WithdrawalDto,
} from './transactions.dto';
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

  async completeWalletFunding(
    wallet_id: string,
    { transaction_id, source, amount }: Transaction,
  ) {
    await this.knex.transaction(async function (tx) {
      await tx.table('wallets').increment('balance', amount).where({
        wallet_id,
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

  async transferFunds(
    user_id: string,
    ref: string,
    { amount, beneficiary_wallet, source_wallet }: TransferDto,
  ) {
    await this.knex.transaction(async function (tx) {
      let sourceWallet: Wallet = (
        await tx.select('*').from('wallets').where({ wallet_id: source_wallet })
      )[0];

      if (!sourceWallet?.wallet_id) {
        throw WalletNotFoundException();
      }

      if (sourceWallet.user_id !== user_id) {
        throw NotWalletOwnerException();
      }

      let beneficiaryWallet: Wallet = (
        await tx
          .select('*')
          .from('wallets')
          .where({ wallet_id: beneficiary_wallet })
      )[0];

      if (!beneficiaryWallet?.wallet_id) {
        throw WalletNotFoundException();
      }

      await tx.table('wallets').increment('balance', -amount).where({
        wallet_id: source_wallet,
      });

      await tx.table('wallets').increment('balance', +amount).where({
        wallet_id: beneficiary_wallet,
      });

      let data = {
        transaction_id: `tr${ref}`,
        ref,
        source: user_id,
        beneficiary: beneficiaryWallet.user_id,
        amount,
        currency: sourceWallet.currency,
        status: TransactionStatus.COMPLETED,
        type: TransactionType.TRANSFER,
      };
      await tx.table('transactions').insert(data);
    });

    return true;
  }

  async initiateWithdrawal(
    user_id: string,
    currency: Iso4217,
    ref: string,
    amount: number,
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

  async completeWithdrawal(transaction_id: string) {
    await this.knex.transaction(async function (tx) {
      let transaction: Transaction = (
        await tx
          .select('*')
          .from('transactions')
          .where({transaction_id})
      )[0];
      console.log(transaction);
      await tx
        .table('wallets')
        .increment('balance', -transaction.amount)
        .where({
          wallet_id: transaction.source,
        });

      await tx
        .table('transactions')
        .update({ status: TransactionStatus.COMPLETED })
        .where({ transaction_id });
    });

    return true;
  }
}
