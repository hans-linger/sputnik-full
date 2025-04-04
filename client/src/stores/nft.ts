import { defineStore } from "pinia";
import axios from "axios";
import { ref, Ref } from "vue";
import { useNotificationsStore } from "@/stores/notifications";
import { isServerError, isServerSuccess } from "@/core/helpers/misc";
import { NFT_PER_PAGE, NftFiltersValue } from "@/core/constants";
import { main } from "@/core/globals";
import { useChainStore } from "@/stores/chains";

export type OfferPayload = {
	chainId: string;
	senderAddress?: string;
	collectionAddr?: string;
	tokenId?: string;
};

export type Nft = {
	id?: string;
	tokenId: string;
	chainId: string;
	name: string;
	collectionAddr: string;
	description?: string;
	imageUrl: string;
	ownerId: string;
	ownerAddress: string;
	createdAt: Date;
	updatedAt?: Date;
	typeId: string;
	offerId?: string;
	offer?: Offer;
	bargain?: Bargain;
};

export function getNftUnique(n: Nft): string {
	return n.chainId + n.collectionAddr + n.tokenId;
}

export function fakeNftUnique(chainId: string, collectionAddr: string, tokenId: string) {
	return chainId + collectionAddr + tokenId;
}

export type NftType = {
	id: string;
	collection?: NftCollection;
};
export type NftFullType = Required<NftType>;

export type NftCollection = {
	collectionAddr: string;
	name: string;
	description?: string;
};

export type OfferFilter = {
	name?: string;
	collectionAddr?: string;
};

export type Offer = {
	id: string;
	chainId: string;
	senderAddress: string;
	collectionId: string;
	collection: NftCollection;
	tokenId: string;
	bargain?: Bargain;
	createdAt: Date;
	updatedAt: Date;
};

export type Bargain = {
	id: string;
	offerId: string;
	offer?: Offer;
	ownerAddress: string;
	collectionId: string;
	collection: NftCollection;
	tokenId: string;
	createdAt: string;
	updatedAt: string;
};

export type BargainWithData = Bargain & {
	// nft: Nft;
	// sender?: Account;
};

export type Transaction = {
	id: string;
	senderId: string;
	sentNftId: string;
	recipientId: string | null;
	receivedNftId: string;
	createdAt: string;
};

export type TransactionWithData = Transaction & {
	// sender: Account;
	// recipient: Account;
	sentNft: Nft;
	receivedNft: Nft;
};

export type BargainWithOffer = Bargain & {
	offer: Offer;
};

export type OfferWithData = Offer & {
	bargain?: Bargain | null;
};

export type NewOfferResult = {
	offer: OfferWithData;
	nft: Nft;
};

// TODO shim for compilator
export function isTypedCollection<T>(obj: any): obj is T[] {
	return obj != null && typeof obj === "object" && typeof obj.length === "number";
}

export function isTypedResult<T>(obj: any): obj is T {
	return obj != null && typeof obj === "object";
}

export const useNftStore = defineStore("data", () => {
	const nfts: Ref<Map<string, Nft>> = ref(new Map<string, Nft>());
	const nftsLoaded: Ref<boolean> = ref(false);
	const nftResultPage: Ref<number> = ref(0);
	const nftTotalCount: Ref<number> = ref(0);
	const transactions: Ref<Map<string, TransactionWithData>> = ref(
		new Map<string, TransactionWithData>()
	);
	const collections: Ref<NftCollection[]> = ref([]);
	const stockOffers: Ref<Map<string, OfferWithData>> = ref(new Map<string, OfferWithData>());

	function clearNfts(): void {
		nftsLoaded.value = false;
		nfts.value = new Map();
	}

	async function init(): Promise<void> {}

	function addNfts(nftsPayload: Nft[]): void {
		const oldEntries = nfts.value;
		const loadedArray = nftsPayload.map((x: Nft) => {
			x.createdAt = new Date(x.createdAt);
			if (x.updatedAt != null) {
				x.updatedAt = new Date(x.updatedAt);
			}
			return x;
		});
		// nftTotalCount.value = nftsPayload.data.count;
		loadedArray.sort((x: Nft, y: Nft) =>
			x.offerId !== y.offerId
				? 1
				: (x.updatedAt?.getMilliseconds() ?? 0) - (y.updatedAt?.getMilliseconds() ?? 0)
		);
		const newEntries = new Map<string, Nft>(
			loadedArray.map((x: Nft) => {
				return [getNftUnique(x), x];
			})
		);

		const combined = Array.from(newEntries.entries()).concat(Array.from(oldEntries.entries()));

		nfts.value = new Map(combined);
	}

	async function loadNfts(
		filter: NftFiltersValue | null = null,
		page: number,
		limit: number = NFT_PER_PAGE
	): Promise<void> {
		const CHAIN_ID = "elgafar-1";
		const chainStore = useChainStore();
		await chainStore.init();
		const address = chainStore.getChainAddress(CHAIN_ID);
		if (address == null) {
			return;
		}
		const payload: Record<string, any> = Object.assign(
			{},
			{
				name: filter?.name,
				collectionAddr: filter?.collection?.collectionAddr,
				offer: null,
				bargain: null,
			},
			{
				limit: limit,
				page: page * NFT_PER_PAGE,
			}
		);

		const url = main().config.apiBaseUrl + `/nfts?chainId=${CHAIN_ID}&address=${address}`;

		const loadedNfts = await axios.get(url, payload);
		if (isTypedCollection<NftCollection>(loadedNfts.data.collections)) {
			// TODO for future possible transformations
			collections.value = loadedNfts.data.collections.map((x: NftCollection) => {
				return {
					collectionAddr: x.collectionAddr,
					name: x.name,
					description: x.description,
				};
			});
		}

		if (isTypedCollection<Nft>(loadedNfts.data.tokens)) {
			nftResultPage.value = page;
			addNfts(loadedNfts.data.tokens);
			// TODO count properly
			nftsLoaded.value = true;
		}
	}

	async function loadNftData(nftId: string): Promise<Nft | null> {
		const response = await axios.get(main().config.apiBaseUrl + "/nfts/" + nftId);
		if (isServerError(response) || response == null || !isTypedResult<Nft>(response.data.data)) {
			console.error("Cannot load NFT data");
			return null;
		}
		const nft = response.data.data;
		// TODO check if it is an own nft
		nfts.value.set(nft.id, nft);
		return nft;
	}

	async function loadOfferData(offerId: string): Promise<void> {
		const response = await axios.get(main().config.apiBaseUrl + "/stock/offers/" + offerId);
		if (isServerError(response)) {
			console.error("Cannot load offer data");
		}
		if (isTypedResult<OfferWithData>(response.data.data)) {
			stockOffers.value.set(response.data.data.id, response.data.data);
		}
	}

	function deleteOffer(offerId: string): void {
		stockOffers.value.delete(offerId);
	}

	async function loadTransactions(userId: string): Promise<void> {
		const loadedTransactions = await axios.get(
			main().config.apiBaseUrl + "/users/" + userId + "/transactions"
		);
		if (
			loadedTransactions != null &&
			isTypedCollection<Transaction>(loadedTransactions.data.data)
		) {
			const values = loadedTransactions.data.data.map((t: Transaction) => {
				return [t.id, t];
			});

			transactions.value = new Map(values);
		}
	}

	async function loadStock(): Promise<void> {
		const response = await axios.get(main().config.apiBaseUrl + "/stock/list");
		if (response.data.data == null) {
			return;
		}
		if (isTypedCollection<OfferWithData>(response.data.data.offers)) {
			stockOffers.value = new Map(response.data.data.offers.map((x: OfferWithData) => [x.id, x]));
		}
		if (isTypedCollection<Nft>(response.data.data.nfts)) {
			addNfts(response.data.data.nfts);
		}
	}

	async function makeOffer(nft: Nft): Promise<void> {
		const notificator = useNotificationsStore();
		const chainStore = useChainStore();
		await chainStore.init();
		const address = chainStore.getChainAddress(nft.chainId);
		if (address == null) {
			return;
		}
		const payload: OfferPayload = {
			chainId: "elgafar-1",
			tokenId: nft.tokenId,
			collectionAddr: nft.collectionAddr,
			senderAddress: address,
		};

		try {
			const res = await axios.post(main().config.apiBaseUrl + "/stock/offer", payload);
			if (isServerError(res.data)) {
				notificator.add({
					severity: "error",
					// life: 3000,
					summary: "Cannot create offer",
					detail: res.data.message,
				});
				return;
			} else {
				notificator.add({
					severity: "success",
					life: 3000,
					summary: "Created offer",
				});
			}

			stockOffers.value.set(res.data.data.offer.id, res.data.data.offer);
		} catch (e) {
			console.error(e);
			notificator.add({
				severity: "error",
				life: 3000,
				summary: "Cannot create offer: unknown error!!!`",
			});
		}
	}

	async function complete(offerId: string, nft: Nft): Promise<boolean> {
		return true;
	}

	async function counterOffer(offerId: string, nftId: string): Promise<boolean> {
		const nft = nfts.value.get(nftId);
		if (nft == null) {
			return false;
		}
		const notificator = useNotificationsStore();
		const url = main().config.apiBaseUrl + `/stock/counter`;
		const res = await axios.post(url, { nftId });
		if (isServerError(res.data)) {
			notificator.add({
				severity: "error",
				life: 3000,
				summary: "Cannot create counter offer",
				detail: res.data.message,
			});
			return false;
		}
		// FIXME true check
		if (isTypedResult<BargainWithData>(res.data.data)) {
			const offer = stockOffers.value.get(res.data.data.id);
			if (offer != null) {
				offer.bargain = res.data.data.bargain;
				stockOffers.value.set(offer.id, offer);
			}
		}
		// stockOffers.value.delete(offerId);
		return true;
	}

	async function revokeOffer(offer: OfferWithData): Promise<void> {
		const notificator = useNotificationsStore();
		// get transaction for nft
		const res = await axios.post(main().config.apiBaseUrl + `/stock/offers/${offer.id}/revoke`);
		if (isServerError(res.data)) {
			notificator.add({
				severity: "error",
				life: 3000,
				summary: "Cannot cancel offer",
				detail: res.data.message,
			});
			return;
		}
		if (isServerSuccess(res.data)) {
			stockOffers.value.delete(offer.id);
		}
	}

	async function acceptBargain(bargain: BargainWithData): Promise<void> {
		const notificator = useNotificationsStore();
		// get transaction for nft
		const res = await axios.post(main().config.apiBaseUrl + `/stock/bargains/${bargain.id}/accept`);
		if (isServerError(res.data)) {
			notificator.add({
				severity: "error",
				life: 3000,
				summary: "Cannot accept bargain",
				detail: res.data.message,
			});
			return;
		}
		if (isServerSuccess(res.data)) {
			stockOffers.value.delete(bargain.offerId);
			return;
		}
		notificator.add({
			severity: "error",
			life: 3000,
			summary: "Cannot accept bargain",
			detail: "Unknown error",
		});
	}

	async function revokeBargain(bargain: BargainWithData): Promise<void> {
		const notificator = useNotificationsStore();
		// get transaction for nft
		const res = await axios.post(main().config.apiBaseUrl + `/stock/bargains/${bargain.id}/revoke`);
		if (isServerError(res.data)) {
			notificator.add({
				severity: "error",
				life: 3000,
				summary: "Cannot revoke bargain",
				detail: res.data.message,
			});
			return;
		}
		if (isServerSuccess(res.data)) {
			const offer = stockOffers.value.get(bargain.offerId);
			if (offer != null) {
				delete offer.bargain;
				stockOffers.value.set(bargain.offerId, offer);
			}
			return;
		}
		notificator.add({
			severity: "error",
			life: 3000,
			summary: "Cannot revoke bargain",
			detail: "Unknown error",
		});
	}

	async function rejectBargain(bargain: BargainWithData): Promise<void> {
		const notificator = useNotificationsStore();
		// get transaction for nft
		const res = await axios.post(main().config.apiBaseUrl + `/stock/bargains/${bargain.id}/reject`);
		if (isServerError(res.data)) {
			notificator.add({
				severity: "error",
				life: 3000,
				summary: "Cannot reject bargain",
				detail: res.data.message,
			});
			return;
		}
		if (isServerSuccess(res.data)) {
			const offer = stockOffers.value.get(bargain.offerId);
			if (offer != null) {
				delete offer.bargain;
				stockOffers.value.set(bargain.offerId, offer);
			}
			return;
		}
		notificator.add({
			severity: "error",
			life: 3000,
			summary: "Cannot revoke bargain",
			detail: "Unknown error",
		});
	}

	async function loadAllCollections(): Promise<void> {
		// const res = await axios.get(main().config.apiBaseUrl + "/nfts/collections");
		// if (res.data != null) {
		// 	collections.value = res.data.data.collections;
		// }
	}

	function getNFTByUnique(collectionAddr: string, tokenId: string): Nft | null {
		const id = fakeNftUnique("elgafar-1", collectionAddr, tokenId);
		// @ts-expect-error ffs
		return nfts.value.has(id) ? nfts.value.get(id) : null;
	}

	async function exchange(nft: Nft, originalOffer?: Offer | null): Promise<void> {
		if (originalOffer == null) {
			return;
		}
		const offerId = originalOffer.id;
		if (offerId == null || nft == null) {
			return;
		}

		const chainStore = useChainStore();
		await chainStore.init();
		const client = chainStore.keplr;
		if (client == null) {
			return;
		}

		await client.exchangeNFTs(
			"elgafar-1",
			{
				tokenId: originalOffer.tokenId,
				address: originalOffer.senderAddress,
				collectionAddr: originalOffer.collection.collectionAddr,
			},
			{
				tokenId: nft.tokenId,
				address: nft.ownerAddress,
				collectionAddr: nft.collectionAddr,
			}
		);
	}

	async function sendNFT(address: string, nft: Nft): Promise<void> {
		const chainStore = useChainStore();
		await chainStore.init();
		const client = chainStore.keplr;
		if (client == null) {
			return;
		}

		client.sendNFT(address, nft);
	}

	return {
		complete,
		exchange,
		loadNfts,
		sendNFT,
		clearNfts,
		getNFTByUnique,
		loadNftData,
		loadOfferData,
		nfts,
		nftsLoaded,
		nftResultPage,
		nftTotalCount,
		deleteOffer,
		loadTransactions,
		loadStock,
		loadAllCollections,
		transactions,
		collections,
		stockOffers,
		makeOffer,
		counterOffer,
		revokeOffer,
		acceptBargain,
		revokeBargain,
		rejectBargain,
	};
});
