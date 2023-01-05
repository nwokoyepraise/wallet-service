import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import {
  NotWalletOwnerException,
  WalletNotFoundException,
} from 'src/common/exceptions';
import { User } from 'src/users/users.decorator';
import { UserPayload } from 'src/users/users.dto';
import { AddWalletDto } from './wallets.dto';
import { WalletsService } from './wallets.service';

@Controller('wallets')
@UseGuards(JwtAuthGuard)
export class WalletsController {
  constructor(private readonly walletsService: WalletsService) {}

  @Get(':wallet_id')
  async findWallet(
    @Param('wallet_id') wallet_id: string,
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

  @Get()
  async findWallets(@User() { user_id }: UserPayload) {
    let wallets = await this.walletsService.findWallets('user_id', user_id);

    return wallets;
  }

  @Get(':wallet_id')
  async addWallet(
    @Body() addWalletDto: AddWalletDto,
    @User() { user_id }: UserPayload,
  ) {
    return await this.walletsService.addWallet(user_id, addWalletDto);
  }
}
