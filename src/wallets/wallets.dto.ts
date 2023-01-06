import { IsISO4217CurrencyCode, IsNotEmpty, IsString } from 'class-validator';
import { Iso4217 } from '../common/enums';

export type Wallet = Readonly<{
  wallet_id: string;
  user_id: string;
  balance: number;
  currency: Iso4217;
//   created_at: Date;
//   updated_at: Date;
}>;

export class AddWalletDto {
  @IsNotEmpty()
  @IsISO4217CurrencyCode()
  currency: Iso4217;
}
