import { IsEnum, IsNotEmpty, IsNumber, IsOptional } from "class-validator";
import { Iso4217 } from "src/common/enums";

export class FundWalletDto {
    @IsNotEmpty()
    @IsNumber()
    amount: number;

    @IsOptional()
    @IsEnum(Iso4217, {message: 'currency must be a valid Iso 4217 value'})
    currency?: Iso4217 =  Iso4217.NGN
}