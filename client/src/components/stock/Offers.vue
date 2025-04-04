<template>
	<Dialog v-model:visible="showDialog" contentClass="dialogBody" modal>
		<div class="dialogContainer">
			<div v-if="originalNft" class="offer">
				<NftImage :img="originalNft?.imageUrl" />
				<div class="name">{{ originalNft?.name }}</div>
			</div>
			<div class="list">
				<div
					v-for="(nft, i) in nftList"
					:key="i"
					:class="{ isCurrent: isCurrent(nft) }"
					class="single"
					@click="selectNft(nft)">
					<NftCard :nft="nft" :no-actions="true" />
				</div>
			</div>
			<div class="button">
				<ToggleButton
					:disabled="currentNft == null"
					icon="pi pi-search"
					label="Exchange"
					@click="xchange" />
			</div>
		</div>
	</Dialog>
	<div class="offersContainer">
		<div v-if="loading" class="loading">
			<ProgressSpinner :unstyled="false" />
		</div>
		<div v-else class="list">
			<OfferListItem
				v-for="(offer, i) in offers"
				:key="i"
				:offer="offer"
				@acceptBargain="onBargainAccept"
				@counterOffer="onCounterOffer"
				@rejectBargain="onBargainReject"
				@revokeBargain="onBargainRevoke"
				@revokeOffer="onOfferRevoke" />
		</div>
	</div>
</template>

<script lang="ts" setup>
import OfferListItem from "@/components/stock/OfferListItem.vue";
import ProgressSpinner from "primevue/progressspinner";
import { Dialog } from "primevue";
import { computed, ComputedRef, nextTick, onMounted, Ref, ref } from "vue";
import { NftFiltersValue } from "@/core/constants";
import NftCard from "@/components/nft/NftCard.vue";
import { BargainWithData, Nft, OfferWithData, useNftStore } from "@/stores/nft";
import NftImage from "@/components/nft/NftImage.vue";
import ToggleButton from "@/components/common/ToggleButton.vue";

const dataStore = useNftStore();
const loading: Ref<boolean> = ref(true);
const showDialog: Ref<boolean> = ref(false);
const originalOffer: Ref<OfferWithData | null> = ref(null);
const originalNft: Ref<Nft | null> = ref(null);
let searchDebouncer: ReturnType<typeof setTimeout> | null = null;
const nameFilterValue: Ref<string> = ref("");
const currentNftFilter: Ref<NftFiltersValue | null> = ref(null);
const currentNft: Ref<Nft | null> = ref(null);

function isCurrent(nft: Nft): boolean {
	return currentNft.value === nft;
}

function selectNft(nft: Nft): void {
	currentNft.value = nft;
}

function getNft(offer?: OfferWithData | null): Nft | null {
	if (offer == null) {
		return null;
	}
	return dataStore.getNFTByUnique(offer.collection.collectionAddr, offer.tokenId) ?? null;
}

const offers: ComputedRef<OfferWithData[]> = computed(() => {
	if (dataStore.stockOffers.size === 0) {
		return [];
	}
	let values = Array.from(dataStore.stockOffers.values());
	values.sort((a, b) => (a.updatedAt > b.updatedAt ? -1 : 1));
	return values;
});

onMounted(() => {
	loadData();
});

function loadData() {
	loading.value = true;
	dataStore.loadStock().then(() => {
		nextTick(() => {
			loading.value = false;
		});
	});
}

async function onCounterOffer(offer: OfferWithData): Promise<void> {
	const nft = getNft(offer);
	if (nft == null) {
		return;
	}
	await loadNfts();
	originalNft.value = nft;
	originalOffer.value = offer;
	showDialog.value = true;
}

function onOfferRevoke(offer: OfferWithData): void {
	dataStore.revokeOffer(offer);
}

function onBargainAccept(bargain: BargainWithData): void {
	dataStore.acceptBargain(bargain);
}

function onBargainRevoke(bargain: BargainWithData): void {
	dataStore.revokeBargain(bargain);
}

function onBargainReject(bargain: BargainWithData): void {
	dataStore.rejectBargain(bargain);
}

function onFilterChanged(val: NftFiltersValue): void {
	currentNftFilter.value = {
		collection: val.collection ?? null,
		name: val.name ?? null,
	};
	if (searchDebouncer !== null) {
		clearTimeout(searchDebouncer);
	}
	searchDebouncer = setTimeout(() => {
		loadNfts();
	}, 300);
}

function loadNfts(): Promise<void> {
	return dataStore.loadNfts(currentNftFilter.value ?? null, 0, 1000);
}

const nftList: ComputedRef<Nft[]> = computed(() => {
	if (dataStore.nfts.size === 0) {
		return [];
	}
	const nfts = Array.from(dataStore.nfts.values());
	return nfts.filter((x) => {
		let valid = true;
		if (valid && nameFilterValue.value !== null) {
			valid = x.name.toLowerCase().indexOf(nameFilterValue.value.toLowerCase()) !== -1;
		}
		return valid;
	});
});

async function xchange(): Promise<void> {
	if (currentNft.value == null) {
		return;
	}
	dataStore.exchange(currentNft.value, originalOffer.value);
}
</script>
<style lang="scss" scoped>
.offersContainer {
	height: 100%;
	width: 100%;
	overflow: hidden;
}

.tabsHeader {
	display: flex;
	flex-direction: row;
	gap: 12px;
	align-items: flex-end;
	align-content: baseline;
	justify-items: baseline;
	height: 60px;
	font-size: 16px;
	margin-bottom: 12px;

	.single {
		padding: 10px 0;
		outline: none;
		cursor: pointer;
		width: 200px;
		background: #000;
		color: #fff;
		border: 1px solid #fff;
		transition-property: padding, background-color, color, border-color;
		transition-duration: 0.2s;

		align-self: flex-end;
		border-radius: 3px;
		text-align: center;

		&.active {
			background: #ffffff;
			color: #000;
			cursor: default;
			padding: 20px 0;
		}
	}
}

:deep(.p-tabpanel) {
	padding-top: 24px;
}

.dialogContainer {
	height: 390px;
	width: 563px;
	overflow: hidden;
	display: flex;
	flex-direction: column;

	:deep(.nftImage) {
		.img {
			padding: 0;
			overflow: hidden;
			border-radius: 4px;
			width: 78px;
			height: 78px;
			margin-bottom: 4px;
			font-size: 14px;
		}
		img {
			width: 78px;
			height: 78px;
		}
	}

	.offer {
		align-self: center;

		.name {
			text-align: center;
			overflow: hidden;
			text-overflow: ellipsis;
		}
	}

	.button {
		align-self: center;
	}

	.img {
		width: 20px;
	}

	.list {
		overflow: auto;
		height: 270px;
		margin: 12px 0;

		.single {
			display: inline-block;
			width: 130px;
			margin: 0 6px 6px 0;
			cursor: pointer;
			overflow: hidden;
			opacity: 0.59;

			&.isCurrent {
				cursor: default;
				opacity: 1;
			}
		}

		.nftCard {
			width: 120px;
			height: 120px;
			border: 0;
			margin: 0;

			:deep(.img) {
				//width: 108px;
			}
		}

		:deep(.nftImage) {
			width: 120px;
			height: 120px;
			display: block;
			overflow: hidden;
			border-radius: 4px;

			.background img {
				width: 120px;
				height: 120px;
			}
		}
	}
}

.loading,
.empty {
	text-align: center;
}
</style>
