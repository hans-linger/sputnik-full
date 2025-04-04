<template>
	<div class="assetContainer">
		<div class="icon">
			<img :alt="asset.info.chainName" :src="asset.info.chainSymbolImageUrl" />
		</div>
		<div class="name">
			<div class="title">{{ asset.info.chainName }}</div>
			<div class="currency">{{ mainDenom }}</div>
		</div>
		<div class="balance">
			<div class="native">
				<span v-if="isBalanceLoaded">{{ balanceString(asset.info.chainId) }}</span>
				<span v-else>
					<i class="pi pi-hourglass" />
				</span>
			</div>
			<div class="usd">{{ usdString }}</div>
		</div>
		<div class="actions">
			<SmallButton icon-name="send" icon-section="common" />
			<SmallButton icon-name="deposit" icon-section="common" />
			<SmallButton icon-name="exchange" icon-section="common" />
			<SmallButton icon-name="stake" icon-section="common" />
		</div>
	</div>
</template>

<script lang="ts" setup>
import { computed, type ComputedRef } from "vue";
import { useI18n } from "vue-i18n";
import SmallButton from "@/components/common/SmallButton.vue";
import ChainClient from "@/core/chains/ChainClient";
import { useChainStore } from "@/stores/chains";

const { n } = useI18n();
const chainStore = useChainStore();

const { asset } = defineProps({
	asset: {
		type: ChainClient,
		required: true,
	},
});

const mainDenom: ComputedRef<string> = computed(() => {
	if (chainStore.balances.has(asset?.info.chainId)) {
		return chainStore.balances.get(asset?.info.chainId)?.denom ?? "—";
	}
	return "?";
});

const isBalanceLoaded: ComputedRef<boolean> = computed(() => {
	return (
		chainStore.balances.has(asset?.info.chainId) &&
		chainStore.balances.get(asset?.info.chainId)?.loaded === true
	);
});

const balanceString = (chainId: string): string => {
	if (chainStore.balances.has(chainId)) {
		return chainStore.balances.get(chainId)?.amount.toString() ?? "---";
	}
	return "?";
};
const usdString: ComputedRef<string> = computed(() => {
	const storeRate = chainStore.usdRates.get(asset.info.chainId);
	const balance = chainStore.balances.get(asset.info.chainId)?.amount;
	return storeRate == null || balance == null ? "—" : (storeRate.rate * balance).toString();
});
</script>

<style lang="scss" scoped>
.assetContainer {
	display: flex;
	flex-direction: row;
	justify-content: stretch;
	align-items: center;
	border-radius: 10px;
	background: #0d0d0e;
	border: 1px solid #37373f;
	margin-bottom: 4px;
	padding: 23px 26px;

	&:hover {
		background-color: #151517;
	}
}

.icon {
	width: 72px;
	height: 54px;
	flex-grow: 0;
	flex-shrink: 0;

	img {
		width: 54px;
		height: 54px;
	}
}

.name {
	flex-shrink: 1;
	flex-grow: 1;
	width: 40%;

	.title {
		font-family: "Figtree Semibold", sans-serif;
		font-size: 20px;
		text-transform: uppercase;
		letter-spacing: 0.2em;
		margin-bottom: 9px;
	}

	.currency {
		font-family: "Figtree Regular", sans-serif;
		font-size: 16px;
		color: #6d6d6d;
	}
}

.balance {
	flex-grow: 1;
	width: 30%;

	.native {
		font-family: "Figtree Semibold", sans-serif;
		font-size: 24px;
		margin-bottom: 9px;
	}

	.usd {
		font-family: "Figtree Regular", sans-serif;
		font-size: 16px;
		color: #6d6d6d;
	}
}

.actions {
	width: 260px;
	flex-grow: 0;
	flex-shrink: 0;
	flex-wrap: nowrap;
}
</style>
