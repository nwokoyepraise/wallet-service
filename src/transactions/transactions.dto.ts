import { Transform } from 'class-transformer';
import {
  IsDecimal,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { BankCode, Iso4217 } from '../common/enums';
import { TransactionStatus, TransactionType } from './transactions.enum';

export class FundWalletDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(1.00)
  amount: number;

  @IsOptional()
  @IsEnum(Iso4217, { message: 'currency must be a valid Iso 4217 value' })
  currency?: Iso4217 = Iso4217.NGN;

  @IsNotEmpty()
  @IsString()
  wallet_id: string;
}

export class TransferDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(1.00)
  amount: number;

  @IsNotEmpty()
  @IsString()
  beneficiary_wallet: string;
}

export class WithdrawalDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(1.00)
  amount: number;

  @IsNotEmpty()
  @IsString()
  account_number: string;

  @IsNotEmpty()
  @IsEnum(BankCode)
  bank_code: BankCode;
}

export type Transaction = Readonly<{
  transaction_id: string;
  amount: number;
  source: string;
  beneficiary: string;
  status: TransactionStatus;
  type: TransactionType;
  currency: Iso4217;
  ref: string;
}>;
