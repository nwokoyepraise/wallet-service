import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { WalletsModule } from 'src/wallets/wallets.module';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';

@Module({
  imports: [HttpModule, WalletsModule],
  controllers: [TransactionsController],
  providers: [TransactionsService],
})
export class TransactionsModule {}
