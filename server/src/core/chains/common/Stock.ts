import {
	Bargain,
	NftTransaction,
	Offer,
	OfferFilter,
	Prisma,
} from "@prisma/client";
import DBConnector from "../../DB";
import ChainClientFactory from "./ChainClientFactory";
import CollectionHelper from "../../../helpers/CollectionHelper";

export function isOfferFilter(obj: any): obj is OfferFilter {
	return (
		obj != null &&
		typeof obj === "object" &&
		["collectionAddr", "tokenId", "senderAddress"].some(x => x in obj)
	);
}

export type TransactionError = {
	message: string;
};

export type OfferPayload = {
	chainId: string;
	senderAddress?: string;
	collectionAddr?: string;
	tokenId?: string;
};

type CleanOfferPayload = Required<OfferPayload>;

export type NftTransactionWithData = NftTransaction & {};

export type BargainWithOffer = Bargain & {
	offer: Offer;
};

export type OfferWithData = Offer & {
	bargain?: Bargain | null;
};

export function isTransactionError(obj: any): obj is TransactionError {
	return (
		obj != null &&
		typeof obj === "object" &&
		"message" in obj &&
		typeof obj["message"] === "string"
	);
}

function isCleanOfferPayload(obj: any): obj is CleanOfferPayload {
	if (obj == null || typeof obj !== "object") {
		return false;
	}
	return ["chainId", "senderAddress", "collectionAddr", "tokenId"].every(
		x => x in obj && typeof obj[x] === "string" && obj[x] !== ""
	);
}

export type CreateOfferResult = {
	offer: Offer;
};

export default class Stock {
	static async createOffer(
		chainId: string,
		senderAddress?: string,
		collectionAddr?: string,
		tokenId?: string
	): Promise<CreateOfferResult | TransactionError> {
		const payload: OfferPayload = {
			chainId,
			senderAddress,
			collectionAddr,
			tokenId,
		};
		try {
			if (isCleanOfferPayload(payload)) {
				return Stock.#createOffer(payload);
			}
		} catch (e) {
			console.error(e);
		}
		return { message: "Transaction payload is malformed" };
	}

	static async getOfferWithData(
		offerId: string
	): Promise<OfferWithData | null> {
		const db = DBConnector.getInstance().client.offer;
		const res = await db.findUnique({
			where: { id: offerId },
			include: {
				bargain: true,
			},
		});

		return res ?? null;
	}

	static async createBargain(
		chainId: string,
		userAddress: string,
		offerId: string,
		collectionAddr: string,
		tokenId: string
	): Promise<TransactionError | BargainWithOffer> {
		if (tokenId == null) {
			return { message: "Wrong NFT id" };
		}
		if (offerId == null) {
			return { message: "Wrong offer id!" };
		}
		const db = DBConnector.getInstance().client;
		const c = ChainClientFactory.getClient(chainId);
		if (c == null) {
			return { message: "No client is configured for this network" };
		}
		const counterNft = await c.getNftInfo(collectionAddr, tokenId);
		if (counterNft == null) {
			return { message: "Cannot find NFT" };
		}
		const offer = await db.offer.findUnique({
			where: { id: offerId },
			include: { bargain: true },
		});
		if (offer == null) {
			return { message: "Cannot find offer" };
		}
		if (offer.bargain != null) {
			// TODO multi-bargain
			return { message: "Cannot find offer" };
		}
		// create bargain
		try {
			const collection = await CollectionHelper.getCollection(
				chainId,
				collectionAddr
			);
			if (collection == null) {
				return { message: "Cannot find collection" };
			}
			const bargain = await db.bargain.create({
				data: {
					id: crypto.randomUUID(),
					senderAddress: userAddress,
					offerId: offer.id,
					collectionId: collection.id,
					tokenId,
				},
			});

			return Object.assign({}, bargain, { offer });
		} catch (e) {
			console.error(e);
			return {
				message: "Cannot create counteroffer",
			};
		}
	}

	static async acceptBargain(
		bargainId: string,
		userAddress?: string
	): Promise<TransactionError | NftTransactionWithData> {
		const db = DBConnector.getInstance().client;
		const bargain = await db.bargain.findUnique({
			where: { id: bargainId },
			include: {
				offer: {
					include: {
						collection: true,
					},
				},
				collection: true,
			},
		});
		if (bargain == null) {
			return { message: "Cannot find bargain" };
		}
		if (bargain.senderAddress === userAddress) {
			return { message: "You cannot trade with yourself" };
		}
		try {
			// TODO make proper DB transaction
			// move sent NFT to new owner
			const transactionPayload: Prisma.NftTransactionUncheckedCreateInput = {
				chainId: bargain.offer.chainId,
				id: crypto.randomUUID(),
				senderAddress: bargain.offer.senderAddress,
				sentTokenId: bargain.offer.tokenId,
				sentCollectionAddr: bargain.offer.collection.collectionAddr,
				recipientAddress: bargain.senderAddress,
				receivedTokenId: bargain.tokenId,
				recipientCollectionAddr: bargain.collection.collectionAddr,
				createdAt: new Date(),
			};
			const transaction = await db.nftTransaction.create({
				data: transactionPayload,
			});
			await db.bargain.delete({ where: { id: bargain.id } });
			await db.offer.delete({ where: { id: bargain.offer.id } });

			return transaction;
		} catch (e) {
			console.error(e);
			return { message: "Cannot create transaction" };
		}
	}

	static async revokeBargain(
		bargainId: string,
		userAddress?: string
	): Promise<TransactionError | BargainWithOffer> {
		const db = DBConnector.getInstance().client;
		try {
			// TODO make proper DB transaction
			const bargain = await db.bargain.findUnique({
				where: { id: bargainId },
				include: { offer: true },
			});
			if (bargain == null) {
				return { message: "Cannot find bargain" };
			}
			if (userAddress == null || bargain.senderAddress !== userAddress) {
				return { message: "Wrong user" };
			}
			await db.bargain.delete({
				where: { id: bargainId },
			});
			return bargain;
		} catch (e) {
			console.error(e);
			return { message: "Cannot revoke bargain" };
		}
	}

	static async rejectBargain(
		bargainId: string,
		userAddress?: string
	): Promise<TransactionError | BargainWithOffer> {
		const db = DBConnector.getInstance().client;
		try {
			// TODO make proper DB transaction
			const bargain = await db.bargain.findUnique({
				where: { id: bargainId },
				include: { offer: true },
			});
			if (bargain == null) {
				return { message: "Cannot find bargain" };
			}
			if (
				bargain.senderAddress === userAddress ||
				bargain.offer.senderAddress !== userAddress
			) {
				return { message: "Wrong user" };
			}
			await db.bargain.delete({
				where: { id: bargainId },
			});
			return bargain;
		} catch (e) {
			console.error(e);
			return { message: "Cannot delete bargain" };
		}
	}

	// check if NFT exists and available for transfer
	static async #isNftAvailable(
		chainId: string,
		collectionAddr?: string,
		tokenId?: string,
		ownerAddress?: string
	): Promise<TransactionError | true> {
		if (tokenId == null) {
			return { message: "Wrong token id" };
		}
		if (ownerAddress == null) {
			return { message: "Wrong owner address" };
		}
		if (collectionAddr == null) {
			return { message: "Wrong contract address" };
		}

		const c = ChainClientFactory.getClient(chainId);
		if (c == null) {
			return { message: "No client is configured for this network" };
		}

		const db = DBConnector.getInstance().client;
		const existingOffer = await db.offer.findFirst({
			where: {
				tokenId,
				collection: {
					collectionAddr,
				},
			},
		});
		if (existingOffer != null) {
			return { message: "NFT is already in transaction" };
		}
		const existingBargain = await db.bargain.findFirst({
			where: {
				collection: {
					collectionAddr,
				},
				tokenId,
			},
		});
		if (existingBargain != null) {
			return { message: "NFT is already in transaction" };
		}

		// check ownership
		const nft = await c.getNftInfo(collectionAddr, tokenId);

		if (nft == null) {
			return { message: "NFT is unavailable for sending!" };
		}
		return true;
	}

	static async #checkNewOfferPayload(
		payload: OfferPayload
	): Promise<TransactionError | true> {
		// check NFT availability
		const isAvailable = await Stock.#isNftAvailable(
			payload.chainId,
			payload.collectionAddr,
			payload.tokenId,
			payload.senderAddress
		);
		if (isTransactionError(isAvailable)) {
			return isAvailable;
		}
		return true;
	}

	static async #checkOfferFilter(
		filter: OfferFilter
	): Promise<TransactionError | string> {
		const db = DBConnector.getInstance().client.offerFilter;
		const dbFilter = await db.findFirst({
			where: { ...filter },
		});
		if (dbFilter == null) {
			// create filter
			const f = await db.create({
				data: { ...filter, id: crypto.randomUUID() },
			});
			return f != null ? f.id : { message: "Cannot create offer filter" };
		}

		return dbFilter.id;
	}

	static async #createOffer(
		payload: CleanOfferPayload
	): Promise<CreateOfferResult | TransactionError> {
		// returns true if no filter provided, filter id otherwise
		const payloadCheck = await Stock.#checkNewOfferPayload(payload);
		if (isTransactionError(payloadCheck)) {
			return payloadCheck;
		}

		// nft is available
		const db = DBConnector.getInstance().client;
		const collection = await CollectionHelper.getCollection(
			payload.chainId,
			payload.collectionAddr
		);
		if (collection == null) {
			return { message: "Cannot fetch collection" };
		}
		// start transaction
		try {
			return await db.$transaction(async tx => {
				// create offer
				const offerData: Prisma.OfferUncheckedCreateInput = {
					senderAddress: payload.senderAddress,
					collectionId: collection.id,
					tokenId: payload.tokenId,
					chainId: payload.chainId,
				};
				const offer = await db.offer.create({
					data: offerData,
				});
				if (offer == null) {
					throw new Error("Cannot create offer: DB error");
				}
				return { offer };
			});
		} catch (e) {
			console.error(e);
			return {
				message: "Cannot create offer",
			};
		}
	}
}
