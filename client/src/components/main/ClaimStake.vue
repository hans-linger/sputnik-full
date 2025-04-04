<template>
	<div class="claimStakeContent">
		<div class="reward">
			<div class="text">{{ $t("main.stakingReward") }}</div>
			<div class="amount">{{ appStore.settings.currency.symbol }}&thinsp;{{ amount }}</div>
			<div class="text">{{ $t("main.moreInfo") }}</div>
		</div>
		<div class="actions">
			<MainButton :label="$t('buttons.claim')" icon-name="claim" icon-section="common" />
			<MainButton :label="$t('buttons.stake')" icon-name="stake" icon-section="common" />
		</div>
	</div>
</template>

<script lang="ts" setup>
import { computed, type ComputedRef } from "vue";
import { useI18n } from "vue-i18n";
import MainButton from "@/components/common/MainButton.vue";
import { useAppStore } from "@/stores/app";

const { n } = useI18n();
const appStore = useAppStore();

const amount: ComputedRef<string> = computed(() => {
	return n(485895, "currency");
});
</script>

<style lang="scss" scoped>
.claimStakeContent {
	width: 469px;
	margin: 0 auto;
	padding: 24px;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	font-family: "Figtree Regular", sans-serif;
	font-size: 16px;

	.reward,
	.actions {
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 10px;
	}

	.reward {
		.text {
			color: #6d6d6d;
		}

		.amount {
			font-family: "Figtree Semibold", sans-serif;
			font-size: 24px;
		}
	}

	.actions {
		.p-button {
			width: 140px;
		}
	}
}
</style>
