import type { ChainInfo } from "@keplr-wallet/types";

const chainList: Record<string, ChainInfo> = {};

const chainFilelist: Record<string, { default: ChainInfo }> = import.meta.glob(
	["../../chains/**/*.json"],
	{
		eager: true,
	}
);

Object.values(chainFilelist).map((c) => (chainList[c.default.chainId] = c.default));

export default class NetworkHelper {
	static getChainInfo(chainId: string): ChainInfo | null {
		return chainId in chainList ? chainList[chainId] : null;
	}
}
