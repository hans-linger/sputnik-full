import { ChainConfig } from "../../../types";
import CollectionInfo from "./CollectionInfo";
import { Nft } from "@prisma/client";

export default abstract class ChainClient {
	readonly chain: ChainConfig;
	readonly isTestnet: boolean;
	protected _nfts: Omit<Nft, "id">[] = [];

	get nfts(): Readonly<Omit<Nft, "id">>[] {
		return this._nfts;
	}

	protected constructor(info: ChainConfig, testnet: boolean) {
		this.chain = info;
		this.isTestnet = testnet;
	}

	static getInstance(chainInfo: ChainConfig): ChainClient {
		throw new Error("Not implemented");
	}

	async getCollections(address: string): Promise<CollectionInfo[]> {
		throw new Error("Not implemented");
	}

	async loadNFTs(address: string): Promise<void> {
		throw new Error("Not implemented");
	}

	protected parseNFTs(nfts: any[]): Omit<Nft, "id">[] {
		throw new Error("Not implemented");
	}

	async getNftInfo(
		collectionAddr: string,
		tokenId: string
	): Promise<Omit<Nft, "id"> | null> {
		throw new Error("Not implemented");
	}

	async getCollectionInfo(collectionAddr: string): Promise<{
		collection: Required<CollectionInfo> | null;
		tokens: Nft[];
	} | null> {
		throw new Error("Not implemented");
	}
}
