import { Nft } from "@prisma/client";
import DBConnector from "../core/DB";
import ChainClientFactory from "../core/chains/common/ChainClientFactory";

export default class NftHelper {
	static async getNFTsByAddress(
		chainId: string,
		address: string
	): Promise<Omit<Nft, "id">[] | null> {
		const c = ChainClientFactory.getClient(chainId);
		if (c == null) {
			return null;
		}
		await c.loadNFTs(address);
		return c.nfts;
	}

	static async saveNFTs(nfts: Omit<Nft, "id">[]): Promise<void> {
		const db = DBConnector.getInstance().client.nft;
		const all: Promise<void>[] = [];
		nfts.forEach(nft => {
			all.push(
				new Promise<void>(async (resolve, reject) => {
					const existing = await db.findFirst({
						where: {
							chainId: nft.chainId,
							collectionAddr: nft.collectionAddr,
							tokenId: nft.tokenId,
						},
					});
					if (existing != null) {
						await db.update({
							where: {
								id: existing.id,
							},
							data: nft,
						});
					} else {
						await db.create({
							data: nft,
						});
					}
					resolve();
				})
			);
		});
		await Promise.all(all);
	}
}
