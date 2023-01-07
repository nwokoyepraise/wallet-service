import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  NotWalletOwnerException,
  WalletNotFoundException,
} from '../common/exceptions';
import { User } from '../users/users.decorator';
import { UserPayload } from '../users/users.dto';
import { AddWalletDto } from './wallets.dto';
import { WalletsService } from './wallets.service';

@Controller('wallets')
@UseGuards(JwtAuthGuard)
export class WalletsController {
  constructor(private readonly walletsService: WalletsService) {}

  @Get('me')
  async findWallet(
    @User() { user_id }: UserPayload,
  ) {
    let wallet = await this.walletsService.findWallet('user_id', user_id);

    if (!wallet?.wallet_id) {
      throw WalletNotFoundException();
    }
    
    return wallet;
  }
}
