import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import {
  NotWalletOwnerException,
  WalletNotFoundException,
} from 'src/common/exceptions';
import { User } from 'src/users/users.decorator';
import { UserPayload } from 'src/users/users.dto';
import { WalletsService } from './wallets.service';

@Controller('wallets')
export class WalletsController {
  constructor(private readonly walletsService: WalletsService) {}

  @UseGuards(JwtAuthGuard)
  @Get(':wallet_id')
  async findWallet(
    @Param('transactionId') wallet_id: string,
    @User() { user_id }: UserPayload,
  ) {
    let wallet = await this.walletsService.findWallet('wallet_id', wallet_id);

    if (!wallet?.wallet_id) {
      throw WalletNotFoundException();
    }

    if (wallet.user_id != user_id) {
      throw NotWalletOwnerException();
    }
    return wallet;
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findWallets(
    @Param('transactionId') wallet_id: string,
    @User() { user_id }: UserPayload,
  ) {
    let wallet = await this.walletsService.findWallet('user_id', user_id);

    if (!wallet?.wallet_id) {
      throw WalletNotFoundException();
    }

    if (wallet.user_id != user_id) {
      throw NotWalletOwnerException();
    }
    return wallet;
  }
}
