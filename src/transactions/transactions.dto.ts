import { Iso4217 } from "src/common/enums";

export class FundWalletDto {
    amount: number;
    currency?: Iso4217 =  Iso4217.NGN
}