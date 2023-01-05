import { IsISO4217CurrencyCode, IsNotEmpty, IsString } from "class-validator";
import { Iso4217 } from "src/common/enums";

export type Wallet = Readonly<{
    wallet_id: string;
    user_id: string;
    balance: number;
    currency: Iso4217;
}>

export class AddWalletDto {
    @IsNotEmpty()
    @IsISO4217CurrencyCode()
    currency: Iso4217;
}