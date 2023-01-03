import { HttpService } from '@nestjs/axios';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UnableToCreatePaymentLinkException } from 'src/common/exceptions';
import { KeyGen } from 'src/common/utils/key-gen';
import { User } from 'src/users/users.decorator';
import { UserPayload } from 'src/users/users.dto';
import { FundWalletDto } from './transactions.dto';
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
    let payload = {
      amount: fundWalletDto.amount,
      tx_ref: ref,
      currency: fundWalletDto.currency,
      meta: { user_id },
      redirect_url: `https://nwokoyepraise-lendsqr-be-test.onrender.com/transactions/fund-wallet/`,
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

    let tx = await this.transactionsService.initiateWalletFunding(
      user_id,
      ref,
      fundWalletDto,
    );

    if (!tx?.transaction_id) {
        throw UnableToCreatePaymentLinkException();
    }

    return { link: data?.data.link, ...tx };
  }
}
