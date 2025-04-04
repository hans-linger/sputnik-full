import { FastifyInstance } from "fastify";
import ChainClientFactory from "../core/chains/common/ChainClientFactory";
import CollectionHelper from "../helpers/CollectionHelper";
import CollectionInfo from "../core/chains/common/CollectionInfo";
import NftHelper from "../helpers/NftHelper";

export function useNftRoutes(server: FastifyInstance): void {
	server.get<{ Querystring: { chainId: string; address: string } }>(
		"/nfts",
		async (req, res) => {
			try {
				const c = ChainClientFactory.getClient(req.query.chainId);
				if (c == null) {
					return res.send([]);
				}
				const collections: CollectionInfo[] = await c.getCollections(
					req.query.address
				);

				await c.loadNFTs(req.query.address);

				const tokens = c.nfts;
				await NftHelper.saveNFTs(tokens);

				collections.forEach(x => (x.chainId = req.query.chainId));
				await CollectionHelper.saveCollections(
					collections as Required<CollectionInfo>[]
				);
				res.send({
					tokens,
					collections,
				});
			} catch (err) {
				console.error(err);
			}
			res.send({});
		}
	);
}
