import { HttpService } from '@nestjs/axios';
import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UnableToCreatePaymentLinkException } from 'src/common/exceptions';
import { KeyGen } from 'src/common/utils/key-gen';
import { User } from 'src/users/users.decorator';
import { UserPayload } from 'src/users/users.dto';
import { FundWalletDto } from './transactions.dto';
import { TransactionType } from './transactions.enum';
import { TransactionsService } from './transactions.service';

@Controller('transactions')
@UseGuards(JwtAuthGuard)
export class TransactionsController {
  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly httpService: HttpService,
  ) {}

  @Post('fund-wallet')
  async fundWallet(
    @Body() fundWalletDto: FundWalletDto,
    @User() { user_id, email }: UserPayload,
  ) {
    let ref = KeyGen.gen(20, 'alphanumeric');

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
      },
      redirect_url: `https://nwokoyepraise-lendsqr-be-test.onrender.com/transactions/payment-callback/`,
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

  @Get('payment-callback')
  async paymentCallback(
    @Query() query: { status: string; tx_ref: string; transaction_id: string },
  ) {
    if (query?.status === 'successful') {
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
      console.log(data)

      if (data.status !== 'success' && data.status !== 'successful') {
        throw 'error';
      }
      
    }
  }
}
