import { Injectable } from '@nestjs/common';
import { InjectKnex, Knex } from 'nestjs-knex';
import { Iso4217 } from '../common/enums';
import {
  CurrencyMismatchException,
  InsufficientBalanceException,
  NotWalletOwnerException,
  WalletNotFoundException,
} from '../common/exceptions';
import { Wallet } from '../wallets/wallets.dto';
import {
  FundWalletDto,
  Transaction,
  TransferDto,
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

  async findTransactions(user_id: string): Promise<Transaction[]> {
    return await this.knex
      .select('*')
      .from('transactions')
      .where({ source: user_id })
      .union(function () {
        this.select('*')
          .from('transactions')
          .where({ beneficiary: user_id })
          .orderBy('created_at', 'desc')
          .limit(100);
      });
  }

  async transferFunds(
    user_id: string,
    ref: string,
    { amount, beneficiary_wallet}: TransferDto,
  ) {
    await this.knex.transaction(async function (tx) {
      let sourceWallet: Wallet = (
        await tx.select('*').from('wallets').where({ user_id })
      )[0];

      if (!sourceWallet?.wallet_id) {
        throw WalletNotFoundException();
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

      if (sourceWallet.balance < amount) {
        throw InsufficientBalanceException();
      }

      if (sourceWallet.currency != beneficiaryWallet.currency) {
        throw CurrencyMismatchException();
      }

      await tx.table('wallets').increment('balance', -amount).where({
        user_id
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
      type: TransactionType.WITHDRAWAL,
    };
    await this.knex.table('transactions').insert(tx);
    return tx;
  }

  async completeWithdrawal(transaction_id: string, wallet_id: string) {
    await this.knex.transaction(async function (tx) {
      let transaction: Transaction = (
        await tx.select('*').from('transactions').where({ transaction_id })
      )[0];

      await tx
        .table('wallets')
        .increment('balance', -transaction.amount)
        .where({
          wallet_id,
        });

      await tx
        .table('transactions')
        .update({ status: TransactionStatus.COMPLETED })
        .where({ transaction_id });
    });

    return true;
  }
}
