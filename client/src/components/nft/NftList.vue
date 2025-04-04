<template>
	<Dialog v-model:visible="showSend" contentClass="dialogBody" modal @afterHide="onDialogClose">
		<div class="dialogContainer">
			<div class="sendingNftContainer row">
				<div v-if="sendingNft != null" class="img">
					<NftCard :nft="sendingNft" :no-actions="true" />
				</div>
			</div>
			<div v-if="showingRecipient" class="row">
				<InputText v-model="recipientAddress" />
			</div>
			<div class="row">
				<MainButton label="Send" @click="showRecipientForm"></MainButton>
				<MainButton label="Exchange" @click="createOffer"></MainButton>
			</div>
		</div>
	</Dialog>
	<div class="listContainer">
		<div v-if="loading" class="loading">Loading...</div>
		<div class="filters">
			<NftFilterRow @filterChanged="onFilterChanged" />
		</div>
		<div class="list">
			<NftCard
				v-for="nft in nftList"
				:key="fakeNftUnique(nft.chainId, nft.collectionAddr, nft.tokenId)"
				:nft="nft"
				@show-send-dialog="onShowSendDialog" />
			<div v-if="nftList.length === 0 && !loading" class="empty">No nfts found</div>
		</div>

		<div v-if="shouldShowPaginator" class="paginatorContainer">
			<Paginator
				:first="firstPagedNft"
				:rows="NFT_PER_PAGE"
				:total-records="dataStore.nftTotalCount"
				@page="onPageChange" />
		</div>
	</div>
</template>

<script lang="ts" setup>
import { computed, ComputedRef, onMounted, ref, Ref, shallowRef, ShallowRef } from "vue";
import { fakeNftUnique, Nft, NftCollection, OfferFilter, useNftStore } from "@/stores/nft";
import NftCard from "@/components/nft/NftCard.vue";
import { NFT_PER_PAGE, NftCardEvents, NftFiltersValue } from "@/core/constants";
import NftFilterRow from "@/components/nft/NftFilterRow.vue";
import Paginator, { PageState } from "primevue/paginator";
import { useAuthStore } from "@/stores/auth";
import { Dialog, InputText } from "primevue";
import MainButton from "@/components/common/MainButton.vue";
import { useChainStore } from "@/stores/chains";

const dataStore = useNftStore();
// const userStore = useUsersStore();
const loading: ShallowRef<boolean> = shallowRef(true);
const loaded: ShallowRef<boolean> = shallowRef(false);
const selectedCollection: Ref<NftCollection | null> = ref(null);
const recipientAddress: ShallowRef<string | null> = ref(null);
const showingRecipient: ShallowRef<boolean> = ref(false);
const nameFilterValue: ShallowRef<string> = shallowRef("");
const authStore = useAuthStore();
const chainStore = useChainStore();
const showSend: ShallowRef<boolean> = shallowRef(false);
const sendingNft: Ref<Nft | null> = ref(null);

const emit = defineEmits<{
	(e: NftCardEvents.SHOW_SEND_DIALOG, nft: Nft): void;
	(e: NftCardEvents.ABORT_TRANSACTION, nft: Nft): void;
}>();

let searchDebouncer: ReturnType<typeof setTimeout> | null = null;

function onFilterChanged(val: NftFiltersValue): void {
	selectedCollection.value = val.collection;
	nameFilterValue.value = val.name;
	if (searchDebouncer !== null) {
		clearTimeout(searchDebouncer);
	}
	// searchDebouncer = setTimeout(() => {
	// 	loadData(0);
	// }, 300);
}

const nftList: ComputedRef<Nft[]> = computed(() => {
	if (dataStore.nfts.size === 0 || !loaded.value) {
		return [];
	}
	return Array.from(dataStore.nfts.values()).filter((n) => {
		if (!chainStore.isUserAddress(n.ownerAddress)) {
			return false;
		}
		if (nameFilterValue.value != null && !n.name.match(new RegExp(nameFilterValue.value, "i"))) {
			return false;
		}
		if (
			selectedCollection.value != null &&
			n.collectionAddr !== selectedCollection.value.collectionAddr
		) {
			return false;
		}
		return true;
	});
});
const firstPagedNft: ComputedRef<number> = computed(() => {
	return NFT_PER_PAGE * dataStore.nftResultPage + 1;
});
const shouldShowPaginator: ComputedRef<boolean> = computed(() => {
	return false; // loading.value || dataStore.nftTotalCount > NFT_PER_PAGE;
});

function onPageChange(event: PageState) {
	loadData(event.page);
}

function loadData(page: number) {
	if (authStore.account != null) {
		loading.value = true;
		if (page == null) {
			page = 0;
		}
		// get nft
		dataStore
			.loadNfts(
				{
					collection: selectedCollection.value,
					name: nameFilterValue.value,
				},
				page
			)
			.then(() => {
				loaded.value = true;
				loading.value = false;
			})
			.finally(() => {
				loading.value = false;
			});
	}
}

onMounted(() => {
	if (!dataStore.nftsLoaded) {
		chainStore.init().then(() => {
			loadData(0);
		});
	}
});

function onShowSendDialog(nft: Nft): void {
	sendingNft.value = nft;
	showSend.value = true;
}

function onCollectionChange() {}

function onDialogClose() {
	clearFilter();
}

function clearFilter() {
	selectedCollection.value = null;
	onCollectionChange();
}

function gatherFilter(): OfferFilter | null {
	const res: OfferFilter = {};
	if (selectedCollection.value !== null) {
		res.collectionAddr = selectedCollection.value.collectionAddr;
	}
	return Object.keys(res).length > 0 ? res : null;
}

function showRecipientForm(): void {
	if (showingRecipient.value && recipientAddress.value != null) {
		sendNft();
	} else {
		showingRecipient.value = true;
	}
}

function createOffer() {
	if (sendingNft.value != null) {
		dataStore.makeOffer(sendingNft.value).then(() => {
			showSend.value = false;
			clearFilter();
		});
	}
}

function sendNft() {
	if (recipientAddress.value != null && sendingNft.value != null) {
		dataStore.sendNFT(recipientAddress.value, sendingNft.value).then(() => {
			showSend.value = false;
			clearFilter();
		});
	}
}
</script>

<style lang="scss" scoped>
.empty {
	display: flex;
	min-height: 0;
	flex-grow: 1;
	padding: 24px;
	justify-content: center;
	align-items: center;
	flex-direction: column;
}

.listContainer {
	position: relative;
	display: flex;
	flex-direction: column;
	height: 100%;
	justify-content: stretch;
	margin-top: 30px;

	.list {
		overflow: auto;
		scrollbar-width: thin;
		scrollbar-color: #232326 #090909;
		flex-grow: 1;
	}
}

.filters {
	margin-bottom: 12px;
}

.paginatorContainer {
	height: 62px;
	padding-top: 12px;
	flex-shrink: 0;

	:deep(.p-paginator-page-selected) {
		color: #000;
		background-color: #fff;
	}
}

.loading {
	position: absolute;
	top: 50%;
	left: 50%;
	text-align: center;
	height: 48px;
	width: 100px;
	margin-left: -50px;
	margin-top: -24px;
}
</style>
