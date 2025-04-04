import { Nft, NftCollection } from "@prisma/client";
import ChainClientFactory from "../core/chains/common/ChainClientFactory";
import DBConnector from "../core/DB";
import NftHelper from "./NftHelper";

export default class CollectionHelper {
	static async getCollection(
		chainId: string,
		collectionAddr: string
	): Promise<NftCollection | null> {
		const db = DBConnector.getInstance().client.nftCollection;
		const existingCollection = await db.findFirst({
			where: {
				chainId,
				collectionAddr,
			},
		});
		if (existingCollection == null) {
			// fetch collection
			const createdCollections = await CollectionHelper.loadCollections(
				chainId,
				[collectionAddr]
			);
			if (createdCollections != null) {
				return createdCollections[0];
			}
		}
		return existingCollection;
	}

	static async loadCollections(
		chainId: string,
		addresses: string[]
	): Promise<NftCollection[]> {
		const c = ChainClientFactory.getClient(chainId);
		if (c == null) {
			return [];
		}
		const res: NftCollection[] = [];
		for (let addr of addresses) {
			const info = await c.getCollectionInfo(addr);
			if (info != null && info.collection != null) {
				// save collection
				res.push(info.collection);
				await NftHelper.saveNFTs(info.tokens);
			}
		}
		return res;
	}

	static async saveCollections(
		collections: NftCollection[]
	): Promise<NftCollection[]> {
		const all: Promise<void>[] = [];
		const db = DBConnector.getInstance().client.nftCollection;
		const existingAddresses = await db.findMany({
			select: {
				collectionAddr: true,
			},
		});

		for (const coll of collections) {
			const cleanColl = Object.assign({}, coll); // as Omit<NftCollection, "id">;
			// @ts-expect-error ffs
			delete cleanColl.id;
			if (existingAddresses == null) {
				break;
			}
			const ea = existingAddresses.find(
				x => x.collectionAddr === coll.collectionAddr
			);

			if (ea != null) {
				await db.updateMany({
					where: {
						collectionAddr: cleanColl.collectionAddr,
						chainId: cleanColl.chainId,
					},
					data: cleanColl,
				});
			} else {
				await db.create({
					data: cleanColl,
				});
			}
		}
		return db.findMany();
	}

	static async getNFTs(
		chainId: string,
		collectionAddr: string
	): Promise<Omit<Nft, "id">[] | null> {
		const c = ChainClientFactory.getClient(chainId);
		if (c == null) {
			return null;
		}
		const res = await c.getCollectionInfo(collectionAddr);
		return res?.tokens ?? null;
	}
}
