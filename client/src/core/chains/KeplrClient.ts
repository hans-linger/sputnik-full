import type { Keplr } from "@keplr-wallet/types";
import ChainClient from "@/core/chains/ChainClient";
import axios from "axios";
import { main } from "@/core/globals";
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { coin } from "@cosmjs/stargate";
import { Nft } from "@/stores/nft";

export type ChainConfig = {
	id: string;
	rest: string;
	rpc?: string;
	name: string;
};

export type ChainBalance = {
	denom: string;
	amount: number;
};

export type NFTXPayload = {
	collectionAddr: string;
	tokenId: string;
	address: string;
};

export default class KeplrClient {
	isAvailable: boolean = "keplr" in window;
	isConnected: boolean = false;
	addresses: Record<string, string> = {};
	chains: Map<string, ChainConfig> = new Map();
	_provider?: Keplr;
	_clients: Map<string, ChainClient> = new Map<string, ChainClient>();

	get clients(): Map<string, ChainClient> {
		return this._clients;
	}

	async exchangeNFTs(chainId: string, sender: NFTXPayload, recipient: NFTXPayload): Promise<void> {
		const info = this.chains.get(chainId);
		if (this._provider == null || info?.rpc == null) {
			return;
		}
		try {
			await this._provider.enable(info.id);
			const offlineSigner = this._provider.getOfflineSigner(info.id);
			const client = await SigningCosmWasmClient.connectWithSigner(info.rpc, offlineSigner);

			const swapMsgs = [
				{
					typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
					value: {
						sender: sender.address,
						contract: sender.collectionAddr,
						msg: new TextEncoder().encode(
							JSON.stringify({
								transfer_nft: { recipient: recipient.address, token_id: sender.tokenId },
							})
						),
						funds: [],
					},
				},
				{
					typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
					value: {
						sender: sender.address,
						contract: recipient.collectionAddr,
						msg: new TextEncoder().encode(
							JSON.stringify({
								transfer_nft: { recipient: sender.address, token_id: recipient.tokenId },
							})
						),
						funds: [],
					},
				},
			];

			const estimatedGas = await client.simulate(
				sender.address,
				swapMsgs,
				"NFT Exchange Simulation"
			);
			const gasLimit = Math.ceil(estimatedGas * 1.2);
			const fee = {
				amount: [coin(Math.ceil(gasLimit * 0.025), "ustars")],
				gas: gasLimit.toString(),
			};

			client.signAndBroadcast(sender.address, swapMsgs, fee, "NFT Swap");
		} catch (e) {
			console.error(e);
		}
	}

	async sendNFT(address: string, nft: Nft): Promise<void> {
		const info = this.chains.get(nft.chainId);
		if (this._provider == null || info?.rpc == null) {
			return;
		}

		try {
			await this._provider.enable(info.id);
			const offlineSigner = this._provider.getOfflineSigner(info.id);
			const client = await SigningCosmWasmClient.connectWithSigner(info.rpc, offlineSigner);
			const msg = {
				transfer_nft: {
					recipient: address,
					token_id: nft.tokenId,
				},
			};
			const executeMsg = {
				typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
				value: {
					sender: nft.ownerAddress,
					contract: nft.collectionAddr,
					msg: new TextEncoder().encode(JSON.stringify(msg)),
					funds: [],
				},
			};

			const estimatedGas = await client.simulate(
				nft.ownerAddress,
				[executeMsg],
				"NFT Transfer Simulation"
			);
			const gasLimit = Math.ceil(estimatedGas * 1.2);
			const fee = {
				amount: [coin(Math.ceil(gasLimit * 0.025), "ustars")],
				gas: gasLimit.toString(),
			};

			const result = await client.execute(nft.ownerAddress, nft.collectionAddr, msg, fee);
		} catch (e) {
			console.error("Error", e);
		}
	}

	async init(): Promise<void> {
		if (
			!this.isAvailable ||
			window.keplr == null ||
			this._provider != null ||
			window.getOfflineSigner == null
		) {
			return;
		}
		this._provider = window.keplr;
		const chainData: { data: Record<string, ChainConfig> } = await axios.get(
			main().config.apiBaseUrl + "/chains/list"
		);

		const chainList: Record<string, ChainConfig> = chainData.data;
		for (const chainId in chainList) {
			try {
				await this._provider.enable(chainList[chainId].id);
				const offlineSigner = window.getOfflineSigner(chainList[chainId].id);
				const accounts = await offlineSigner.getAccounts();
				this.addresses[chainList[chainId].id] = accounts[0].address;
				this.chains.set(chainList[chainId].id, chainList[chainId]);
			} catch (e) {
				/* empty */
				// console.debug(e);
			}
		}
		this.isConnected = true;
	}

	async getAllBalances(withZero: boolean = false): Promise<Record<string, ChainBalance>> {
		try {
			const balances = await axios.get(main().config.apiBaseUrl + "/chains/balances");
			return balances.data as Record<string, ChainBalance>;
		} catch (e) {
			console.error(e);
			return {};
		}
	}
}
