import ChainClient from "./ChainClient";
import Stargaze from "../Stargaze";
import { chains as testChains } from "chain-registry/testnet";
import { chains as mainChains } from "chain-registry/mainnet";
import { Chain } from "@chain-registry/types";
import { ChainConfig } from "../../../types";
import GenericClient from "./GenericClient";

type ChainConfigList = Record<string, typeof ChainClient.getInstance>;

const testMap: ChainConfigList = {
	"elgafar-1": Stargaze.getInstance,
};

const mainMap: ChainConfigList = {};

export function chainToConfig(chain: Chain): ChainConfig | null {
	if (
		chain.apis == null ||
		chain.apis.rest == null ||
		chain.apis.rpc == null ||
		chain.apis.rest.length < 1 ||
		chain.apis.rpc.length < 1
	) {
		return null;
	}
	return {
		id: chain.chain_id,
		name: chain.chain_name,
		rpc: chain.apis.rpc[0].address,
		rest: chain.apis.rest[0].address,
	};
}

export default class ChainClientFactory {
	static getChain(chainId: string): Chain | null {
		let chain: Chain | null =
			testChains.find(x => x.chain_id === chainId) ?? null;
		if (chain == null) {
			chain = mainChains.find(x => x.chain_id === chainId) ?? null;
		}
		// TODO refactor
		if (chain == null) {
			return null;
		}
		return chain;
	}

	static getChainConfig(chainId: string): ChainConfig | null {
		const chain = ChainClientFactory.getChain(chainId);
		if (chain != null) {
			return chainToConfig(chain);
		}
		return null;
	}

	static getClient(chainId: string): ChainClient | null {
		const chain = ChainClientFactory.getChain(chainId);
		if (chain == null) {
			return null;
		}
		const config = chainToConfig(chain);
		if (config == null) {
			return null;
		}
		if (testMap.hasOwnProperty(chain.chain_id)) {
			return testMap[chainId](config) ?? GenericClient.getInstance(config);
		}
		throw new Error("TODO");
	}

	static getList(testnet: boolean = true): ChainConfig[] {
		return (testnet ? testChains : mainChains)
			.map(x => chainToConfig(x))
			.filter(x => x != null);
	}
}
