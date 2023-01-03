import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { Iso4217 } from "src/common/enums";
import { TransactionStatus, TransactionType } from "./transactions.enum";

export class FundWalletDto {
    @IsNotEmpty()
    @IsNumber()
    amount: number;

    @IsOptional()
    @IsEnum(Iso4217, {message: 'currency must be a valid Iso 4217 value'})
    currency?: Iso4217 =  Iso4217.NGN

    @IsNotEmpty()
    @IsNumber()
    wallet_id: string;
}

export class TransferDto {
    @IsNotEmpty()
    @IsNumber()
    amount: number;

    @IsNotEmpty()
    @IsString()
    source_wallet: string;

    @IsNotEmpty()
    @IsString()
    beneficiary_wallet: string;
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
}>