import type { Coin } from "@keplr-wallet/types";
import { EmptyBalance } from "@/core/constants";

declare type Mutable<T> = {
	-readonly [k in keyof T]: T[k];
};

declare type AssetBalance = { loaded: boolean } & (Coin | EmptyBalance);

declare type UsdRate = { assetId: string; rate: number };
