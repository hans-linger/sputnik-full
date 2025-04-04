import { NftCollection } from "@/stores/nft";

export const EmptyBalance = {
	denom: "—",
	amount: 0,
};

export const SESSION_DATA_KEY = "user-data-key";

export enum NftCardEvents {
	SHOW_SEND_DIALOG = "showSendDialog",
	ABORT_TRANSACTION = "abortTransaction",
}

export type NftFiltersValue = {
	name: string;
	collection: NftCollection | null;
};

export enum NftListEvents {
	FILTER_CHANGED = "filterChanged",
	COUNTER_OFFER = "counterOffer",
	ACCEPT_BARGAIN = "acceptBargain",
	REVOKE_BARGAIN = "revokeBargain",
	REJECT_BARGAIN = "rejectBargain",
	REVOKE_OFFER = "revokeOffer",
}

export enum TransactionEvents {
	ACCEPT = "accept",
	REJECT = "reject",
}

export const NFT_PER_PAGE = 50;
