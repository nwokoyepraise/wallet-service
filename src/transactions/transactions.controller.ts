import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import {
  InsufficientBalanceException,
  InvalidAccountException,
  NotWalletOwnerException,
  TransactionNotFoundException,
  UnableToCreatePaymentLinkException,
  WalletNotFoundException,
} from 'src/common/exceptions';
import { KeyGen } from 'src/common/utils/key-gen';
import { User } from 'src/users/users.decorator';
import { UserPayload } from 'src/users/users.dto';
import { WalletsService } from 'src/wallets/wallets.service';
import { FundWalletDto, TransferDto, WithdrawalDto } from './transactions.dto';
import { TransactionStatus, TransactionType } from './transactions.enum';
import { TransactionsService } from './transactions.service';

@Controller('transactions')
export class TransactionsController {
  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly httpService: HttpService,
    private readonly walletsService: WalletsService,
  ) {}

  async resolveAccount(bankCode: string, accountNumber: string) {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.FW_SECRET_KEY}`,
    };
    try {
      const { data } = await lastValueFrom(
        this.httpService.post(
          `https://api.flutterwave.com/v3/accounts/resolve`,
          { account_number: accountNumber, account_bank: bankCode },
          { headers },
        ),
      );
      return data;
    } catch (error: any) {
      console.error(error?.response?.data);
      throw new BadRequestException();
    }
  }

  async completeWithdrawal(
    transactionId: string,
    narration: string,
    accountNumber: string,
    bankCode: string,
    amount: number,
  ) {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.FW_SECRET_KEY}`,
    };
    const { data } = await lastValueFrom(
      this.httpService.post(
        `https://api.flutterwave.com/v3/transfers`,
        {
          account_name: '',
          account_number: accountNumber,
          account_bank: bankCode,
          amount,
          narration,
          currency: 'NGN',
        },
        { headers: headers },
      ),
    );

    if (data?.status == 'success') {
      return await this.transactionsService.completeWithdrawal(transactionId);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('fund-wallet')
  async fundWallet(
    @Body() fundWalletDto: FundWalletDto,
    @User() { user_id, email }: UserPayload,
  ) {
    let ref = KeyGen.gen(20, 'alphanumeric');

    let walletExists = await this.walletsService.walletExists(
      fundWalletDto.wallet_id,
    );

    if (!walletExists) {
      throw WalletNotFoundException();
    }

    let tx = await this.transactionsService.initiateWalletFunding(
      user_id,
      ref,
      fundWalletDto,
    );

    if (!tx?.transaction_id) {
      throw UnableToCreatePaymentLinkException();
    }

    let payload = {
      amount: fundWalletDto.amount,
      tx_ref: ref,
      currency: fundWalletDto.currency,
      meta: {
        user_id,
        type: TransactionType.FUNDING,
        transaction_id: tx.transaction_id,
        wallet_id: fundWalletDto.wallet_id,
      },
      redirect_url: `https://nwokoyepraise-lendsqr-be-test.onrender.com/transactions/${tx.transaction_id}/fund-wallet/payment-callback/`,
      customer: { email },
    };

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.FW_SECRET_KEY}`,
    };

    const response = await lastValueFrom(
      this.httpService.post(
        `https://api.flutterwave.com/v3/payments`,
        payload,
        {
          headers: headers,
        },
      ),
    );
    const { data } = response;

    if (data?.status !== 'success') {
      throw UnableToCreatePaymentLinkException();
    }

    return { link: data?.data.link, ...tx };
  }

  @Get(':transaction_id/fund-wallet/payment-callback')
  async paymentCallback(
    @Query() query: { status: string; tx_ref: string; transaction_id: string },
    @Param('transaction_id') transaction_id: string,
  ) {
    if (query?.status === 'successful') {
      let transaction = await this.transactionsService.findTransaction(
        'transaction_id',
        transaction_id,
      );

      if (!transaction?.transaction_id) {
        throw TransactionNotFoundException();
      }

      if (transaction.status == TransactionStatus.COMPLETED) {
        return;
      }

      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.FW_SECRET_KEY}`,
      };
      let { data } = await lastValueFrom(
        this.httpService.get(
          `https://api.flutterwave.com/v3/transactions/${query.transaction_id}}}/verify`,
          { headers: headers },
        ),
      );
      data = data.data;

      if (data.status !== 'success' && data.status !== 'successful') {
        throw 'error';
      }

      let successful = await this.transactionsService.completeWalletFunding(
        data.meta.wallet_id,
        transaction,
      );
      if (successful) {
        return { message: 'success' };
      }
      return;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('transfer')
  async transferFunds(
    @Body() transferDto: TransferDto,
    @User() { user_id, email }: UserPayload,
  ) {
    let ref = KeyGen.gen(20, 'alphanumeric');

    let successful = await this.transactionsService.transferFunds(
      user_id,
      ref,
      transferDto,
    );

    if (successful) {
      return { message: 'success' };
    }

    throw new InternalServerErrorException(
      'unable to transfer funds, please try again',
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('withdraw')
  async intiatiateWithdrawal(
    @Body() { account_number, amount, bank_code, source_wallet }: WithdrawalDto,
    @User() { user_id }: UserPayload,
  ) {
    let account = await this.resolveAccount(bank_code, account_number);

    if (account?.status != 'success') {
      throw InvalidAccountException();
    }

    let wallet = await this.walletsService.findWallet(
      'wallet_id',
      source_wallet,
    );

    if (!wallet?.wallet_id) {
      throw WalletNotFoundException();
    }

    if (wallet.user_id != user_id) {
      throw !NotWalletOwnerException();
    }

    if (wallet.balance < amount) {
      throw InsufficientBalanceException();
    }

    let ref = KeyGen.gen(20, 'alphanumeric');

    let tx = await this.transactionsService.initiateWithdrawal(
      user_id,
      wallet.currency,
      ref,
      amount
    );

    this.completeWithdrawal(tx.transaction_id, 'withrawal', account_number, bank_code, amount)
    return tx
  }
}
