<template>
	<div class="assetsContent">
		<div v-if="chainStore.isWalletConnected()" class="header">
			<span>{{ $t("main.asset") }}</span>
			<span>{{ $t("main.balance") }}</span>
			<span>{{ $t("main.operation") }}</span>
		</div>
		<div v-if="chainStore.isWalletConnected()" class="list">
			<AssetRow v-for="(asset, i) in chainStore.chains.values()" :key="i" :asset="asset" />
		</div>
		<div v-else class="emptyList">
			<MainButton :label="$t('actions.connectWallet')" @click="onConnectWallet"></MainButton>
		</div>
	</div>
</template>

<script lang="ts" setup>
import AssetRow from "@/components/main/AssetRow.vue";
import { onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useChainStore } from "@/stores/chains";
import MainButton from "@/components/common/MainButton.vue";

const authStore = useAuthStore();
const chainStore = useChainStore();

function onConnectWallet(): void {
	authStore.init().then(() => {
		chainStore.init().then(() => {
			chainStore.loadAllBalances().then(() => {
				// TODO restructure data properly
			});
		});
	});
}

onMounted(() => {
	if (chainStore.isInited && !chainStore.isLoading) {
		chainStore.loadAllBalances();
	}
});
</script>

<style lang="scss" scoped>
.assetsContent {
	padding: 24px 40px;
	height: 100%;
	display: flex;
	flex-direction: column;
}
.header {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	font-family: "Figtree Regular", sans-serif;
	font-size: 16px;
	color: #6d6d6d;
	margin-bottom: 25px;
}
.list {
	overflow-y: scroll;
	height: auto;
	scrollbar-width: thin;
	scrollbar-color: #232326 #090909;
}
.emptyList {
	padding: 24px;
	display: flex;
	justify-content: center;
	align-items: center;

	:deep(.p-button) {
		padding: 12px 32px;
		font-size: 24px;
	}
}
</style>
