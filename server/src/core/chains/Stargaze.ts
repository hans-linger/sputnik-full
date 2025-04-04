import axios from "axios";
import {
	Collection as StargazeMainCollection,
	Token,
	Token as StargazeMainToken,
} from "./types/stargaze.mainnet";
import {
	Collection as StargazeTestCollection,
	Token as StargazeTestToken,
} from "./types/stargaze.testnet";
import ChainClient from "./common/ChainClient";
import { ChainConfig } from "../../types";
import CollectionInfo from "./common/CollectionInfo";
import { Nft } from "@prisma/client";

function isStargazeToken(
	obj: any
): obj is StargazeTestToken | StargazeMainToken {
	return true;
}

const testnetUrl =
	"https://constellations-api.testnet.stargaze-apis.com/graphql";
const prodUrl = "https://constellations-api.mainnet.stargaze-apis.com/graphql";

export default class Stargaze extends ChainClient {
	readonly chain: ChainConfig;
	readonly isTestnet: boolean;

	constructor(chain: ChainConfig, testnet: boolean) {
		super(chain, testnet);
		this.chain = chain;
		this.isTestnet = testnet;
	}

	static getInstance(chainInfo: ChainConfig): Stargaze {
		return new Stargaze(chainInfo, true);
	}

	async getCollections(address: string): Promise<CollectionInfo[]> {
		if (address == null) {
			return [];
		}
		const collections = await axios.post(
			this.isTestnet ? testnetUrl : prodUrl,
			{
				query: `query Collections {
    collections(
        tokenOwnerAddr: "${address}"
        isBlocked: false
    ) {
        offset
        limit
        total
        collections {
            id
            collectionAddr
            image
            name
            description
        }
    }
}
`,
			},
			{
				headers: {
					"Content-Type": "application/json",
				},
			}
		);
		if (collections?.data?.data?.collections == null) {
			return [];
		}
		return (
			(this.isTestnet
				? (collections.data.data.collections
						.collections as StargazeTestCollection[])
				: (collections.data.data.collections
						.collections as StargazeMainCollection[])) ?? []
		);
	}

	async getNftInfo(
		collectionAddr: string,
		tokenId: string
	): Promise<Omit<Nft, "id"> | null> {
		const token = await axios.post(this.isTestnet ? testnetUrl : prodUrl, {
			query: `query Token {
    token(collectionAddr: "${collectionAddr}", tokenId: "${tokenId}") {
        id
        collectionAddr
        tokenId
        createdAt
        ownerAddr
        name
        description
        forSale
        imageUrl
        animationUrl
        rarityOrder
        rarityScore
        priceExpiresAt
        askId
        saleType
        mintedAt
        liveAuctionStartTime
        liveAuctionEndTime
        listedAt
        sellerAddr
        isEscrowed
        escrowContractAddr
        escrowContractType
        highestBid
        highestCollectionBid
    }
}`,
		});

		const t = token.data.data.token as Token;
		if (t == null || t.imageUrl == null || t.ownerAddr == null) {
			return null;
		}
		return {
			chainId: this.chain.id,
			tokenId: tokenId,
			ownerId: null,
			collectionAddr,
			imageUrl: t.imageUrl,
			createdAt: new Date(t.createdAt),
			// maybe remove
			updatedAt: new Date(t.createdAt),
			name: t.name ?? tokenId,
			description: t.description ?? null,
			ownerAddress: t.ownerAddr,
		};
	}

	async loadNFTs(address: string): Promise<void> {
		const tokens = await axios.post(
			this.isTestnet ? testnetUrl : prodUrl,
			{
				query: `query Tokens {
									tokens(
										ownerAddr: "${address}",
										includeUnminted: false
										includeBurned: false
										includeBlocked: false
									) {
										tokens {
														id
														collectionAddr
														tokenId
														createdAt
														ownerAddr
														name
														description
														imageUrl
												}
									}
								}`,
			},
			{
				headers: {
					"Content-Type": "application/json",
				},
			}
		);
		this._nfts = this.parseNFTs(
			(this.isTestnet
				? (tokens.data.data.tokens.tokens as StargazeTestToken[])
				: (tokens.data.data.tokens.tokens as StargazeMainToken[])) ?? []
		);
	}

	protected parseNFTs(nfts: any[]): Omit<Nft, "id">[] {
		const res: Omit<Nft, "id">[] = [];
		if (nfts == null || nfts.length < 1) {
			return res;
		}
		for (const n of nfts) {
			if (isStargazeToken(n)) {
				if (n.name != null && n.imageUrl != null && n.ownerAddr != null)
					res.push({
						chainId: this.chain.id,
						collectionAddr: n.collectionAddr,
						tokenId: n.tokenId,
						ownerId: null,
						name: n.name,
						description: n.description ?? null,
						updatedAt: new Date(),
						ownerAddress: n.ownerAddr,
						createdAt: n.mintedAt,
						imageUrl: n.imageUrl,
					});
			}
		}
		return res;
	}

	async getCollectionInfo(collectionAddr: string): Promise<{
		collection: Required<CollectionInfo> | null;
		tokens: Nft[];
	} | null> {
		let collection = await axios.post(this.isTestnet ? testnetUrl : prodUrl, {
			query: `query collection {
    collection(collectionAddr: "${collectionAddr}") {
        collectionAddr
        image
        name
        description
    }
}
`,
		});
		try {
			let tokens = await axios.post(this.isTestnet ? testnetUrl : prodUrl, {
				query: `query Tokens {
									tokens(
										collectionAddr: "${collectionAddr}",
										includeUnminted: false
										includeBurned: false
										includeBlocked: false
									) {
										tokens {
														id
														collectionAddr
														tokenId
														createdAt
														ownerAddr
														name
														description
														imageUrl
												}
									}
								}`,
			});

			const collectionsRes = collection.data.data.collection;
			collectionsRes.chainId = this.chain.id;

			return {
				collection: collectionsRes,
				tokens: tokens.data.data.tokens.tokens.map((x: Nft) => {
					x.chainId = this.chain.id;
					return x;
				}),
			};
		} catch (e) {
			console.error(e);
			return null;
		}
	}
}
