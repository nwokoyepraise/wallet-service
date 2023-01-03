import { Iso4217 } from "src/common/enums";

export type Wallet = Readonly<{
    wallet_id: string;
    user_id: string;
    balance: number;
    currency: Iso4217;
}>