import { FastifyInstance } from "fastify";
import Stock, {
	isTransactionError,
	OfferPayload,
} from "../core/chains/common/Stock";
import { sendError, sendSuccess } from "../types";
import DBConnector from "../core/DB";
import { Nft } from "@prisma/client";
import ChainClientFactory from "../core/chains/common/ChainClientFactory";

export function useStockRoutes(server: FastifyInstance): void {
	server.post<{ Body: OfferPayload }>("/stock/offer", (req, res) => {
		const payload = req.body as OfferPayload;
		Stock.createOffer(
			payload.chainId,
			payload.senderAddress,
			payload.collectionAddr,
			payload.tokenId
		)
			.then(result => {
				if (isTransactionError(result)) {
					sendError(res, result.message);
				} else {
					sendSuccess(res, result);
				}
			})
			.catch(err => {
				sendError(res, "Cannot create offer: " + err);
			});
	});

	server.get("/stock/list", async (req, res) => {
		const db = DBConnector.getInstance().client;
		const offers = await db.offer.findMany({
			include: {
				bargain: {
					include: {
						collection: true,
					},
				},
				collection: true,
			},
		});
		const ids: Record<string, string[]> = {};
		for (const offer of offers) {
			if (ids[offer.chainId] == null) {
				ids[offer.chainId] = [];
			}
			ids[offer.chainId].push(offer.collection.collectionAddr);
			if (
				offer.bargain != null &&
				ids[offer.chainId].indexOf(offer.bargain.collection.collectionAddr) ===
					-1
			) {
				ids[offer.chainId].push(offer.bargain.collection.collectionAddr);
			}
		}

		let nfts: Omit<Nft, "id">[] = [];

		for (const chain in ids) {
			const c = ChainClientFactory.getClient(chain);
			if (c != null) {
				for (const ca of ids[chain]) {
					const info = await c.getCollectionInfo(ca);
					if (info != null && info.tokens != null) {
						nfts = nfts.concat(nfts, info.tokens);
					}
				}
			}
		}

		sendSuccess(res, { offers, nfts });
	});

	server.post<{
		Body: {
			offerId: string;
			payload: {
				chainId: string;
				collectionAddr: string;
				tokenId: string;
			};
		};
	}>("/stock/counter", (req, res) => {
		res.send(req.body);
	});

	server.post<{
		Body: {
			offerId: string;
		};
	}>("/stock/complete", async (req, res) => {
		sendSuccess(res, "OK!");
	});
}
