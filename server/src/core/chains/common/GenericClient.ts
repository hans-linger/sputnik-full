import ChainClient from "./ChainClient";
import CollectionInfo from "./CollectionInfo";
import { ChainConfig } from "../../../types";

export default class GenericClient extends ChainClient {
	async getCollections(address: string): Promise<CollectionInfo[]> {
		return [];
	}
	async getNFTs(address: string): Promise<[]> {
		return [];
	}

	static getInstance(chainInfo: ChainConfig): ChainClient {
		return new GenericClient(chainInfo, true);
	}
}
