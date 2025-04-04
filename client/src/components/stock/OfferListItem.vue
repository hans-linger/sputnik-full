<template>
	<div class="container" @click="counterOffer">
		<div class="imgContainer">
			<NftImage v-if="getNft(offer) != null" :img="getNft(offer)?.imageUrl" :no-actions="true" />
		</div>
		<div class="name">
			{{ getNft(offer)?.name ?? "1" }}
		</div>
		<div class="collection">
			<i class="pi pi-question-circle" />
			{{ offer.collection.collectionAddr }}
		</div>
		<div v-if="offer.senderAddress != null" class="sender">
			<i class="pi pi-user" />
			{{ offer.senderAddress }}
		</div>
	</div>
</template>

<script lang="ts" setup>
import { NftListEvents } from "@/core/constants";
import { Bargain, BargainWithData, Nft, OfferWithData, useNftStore } from "@/stores/nft";
import NftImage from "@/components/nft/NftImage.vue";
import { computed, ComputedRef, onBeforeMount } from "vue";
import { useChainStore } from "@/stores/chains";

const dataStore = useNftStore();
const chainStore = useChainStore();

function getNft(offer?: OfferWithData | Bargain): Nft | null {
	if (offer == null) {
		return null;
	}
	return dataStore.getNFTByUnique(offer.collection.collectionAddr, offer.tokenId) ?? null;
}

const props = defineProps<{
	offer: OfferWithData;
}>();
const isOwn: ComputedRef<boolean> = computed(() =>
	chainStore.isUserAddress(props.offer.senderAddress)
);
const emit = defineEmits<{
	(e: NftListEvents.COUNTER_OFFER, offer: OfferWithData): void;
	(e: NftListEvents.REVOKE_OFFER, offer: OfferWithData): void;
	(e: NftListEvents.ACCEPT_BARGAIN, bargain: BargainWithData): void;
	(e: NftListEvents.REVOKE_BARGAIN, bargain: BargainWithData): void;
	(e: NftListEvents.REJECT_BARGAIN, bargain: BargainWithData): void;
}>();

function counterOffer() {
	// if (!chainStore.isUserAddress(props.offer.senderAddress)) {
	emit(NftListEvents.COUNTER_OFFER, props.offer);
	// }
}

function revokeOffer() {
	emit(NftListEvents.REVOKE_OFFER, props.offer);
	// dataStore.cancelOffer(props.offer.id);
}

function acceptBargain() {
	if (props.offer.bargain != null) {
		emit(NftListEvents.ACCEPT_BARGAIN, props.offer.bargain);
	}
}

function revokeBargain() {
	if (props.offer.bargain != null) {
		emit(NftListEvents.REVOKE_BARGAIN, props.offer.bargain);
	}
}

function rejectBargain() {
	if (props.offer.bargain != null) {
		emit(NftListEvents.REJECT_BARGAIN, props.offer.bargain);
	}
}

onBeforeMount(() => {
	chainStore.init();
});
</script>

<style lang="scss" scoped>
$size: 32px;

.container {
	display: flex;
	flex-direction: row;
	gap: 8px;
	align-items: center;
	align-content: stretch;
	margin-bottom: 12px;
	transition: background-color 0.1s;
	padding: 12px 0;
	border: 1px solid #37373f;
	border-radius: 10px;

	&:hover:not(.isOwn) {
		cursor: pointer;
		background-color: #232323;
	}

	.nftImage {
		padding: 4px;
		width: 78px;
		flex-shrink: 0;
		flex-grow: 0;

		:deep(.img) {
			overflow: hidden;
			padding: 0;
			border-radius: 4px;
			height: 70px;
			width: 70px;
		}
		:deep(img) {
			height: 70px;
			width: 70px;
		}
	}

	.name {
		width: 20%;
	}

	.name,
	.collection,
	.sender {
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.collection,
	.sender {
		white-space: nowrap;
		font-size: 14px;
		width: 25%;
	}

	.sender {
		color: #686868;
	}
}
</style>
