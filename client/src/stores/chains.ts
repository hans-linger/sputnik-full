import { defineStore } from "pinia";
import KeplrClient from "@/core/chains/KeplrClient";
import ChainClient from "@/core/chains/ChainClient";
import { type Ref, ref, shallowRef, ShallowRef } from "vue";
import type { AssetBalance, UsdRate } from "@/types/common";
import axios from "axios";
import { main } from "@/core/globals";

function chainToBalance(c: ChainClient): AssetBalance {
	if (c.balances.length > 0) {
		return c.balances[0];
	}
	return { denom: "—", amount: 0 };
}

export const useChainStore = defineStore("chains", () => {
	const balances: Ref<Map<string, AssetBalance>> = ref(new Map<string, AssetBalance>());
	const chains: Ref<Map<string, ChainClient>> = ref(new Map());
	const addresses: ShallowRef<Record<string, string>> = shallowRef({});
	const keplr: Ref<KeplrClient | null> = ref(null);
	const isInited: Ref<boolean> = ref(false);
	const isLoading: ShallowRef<boolean> = shallowRef(false);
	const usdRates: Ref<Map<string, UsdRate>> = ref(new Map<string, UsdRate>());
	function isWalletConnected(): boolean {
		return keplr.value?.isConnected === true;
	}

	async function init(): Promise<void> {
		if (keplr.value == null) {
			isLoading.value = true;
			if (keplr.value == null) {
				keplr.value = new KeplrClient();
			}
			await keplr.value.init();

			Object.entries(keplr.value.addresses).forEach(([id, address]) => {
				addresses.value[id] = address;
				balances.value.set(id, { denom: "—", amount: 0, loaded: false });
			});
			chains.value = keplr.value.clients;
			await axios.post(main().config.apiBaseUrl + "/users/save-addresses", {
				addresses: addresses.value,
			});
		}
		isLoading.value = false;
		isInited.value = true;
	}

	function isUserAddress(address: string): boolean {
		return Object.values(addresses.value).indexOf(address) !== -1;
	}

	async function loadAllBalances(
		withZero: boolean = false
	): Promise<Map<string, AssetBalance> | null> {
		if (keplr.value != null) {
			await init();
			const balancesData = await keplr.value.getAllBalances(withZero);
			for (const cc in addresses.value) {
				if (addresses.value[cc] in balancesData) {
					balances.value.set(cc, balancesData[addresses.value[cc]]);
				}
			}
			return balances.value;
		}
		return null;
	}

	async function loadExchangeRates(): Promise<void> {
		const res = await axios.get(`${import.meta.env.VITE_API_URL}/chains/exchange-rates`);
	}

	function getChainAddress(chainId: string): string | null {
		return addresses.value[chainId] ?? null;
	}

	return {
		// actions
		getChainAddress,
		loadAllBalances,
		loadExchangeRates,
		init,
		isUserAddress,

		// state
		addresses,
		balances,
		chains,
		isInited,
		isLoading,
		isWalletConnected,
		keplr,
		usdRates,
	};
});
