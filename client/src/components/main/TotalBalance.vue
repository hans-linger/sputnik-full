<template>
	<div class="totalBalanceContent">
		<div class="header">
			<span class="text">{{ $t("main.totalBalance") }}</span>
			<span class="eye" @click="changeVisibility">
				<InlineSvg v-show="isVisible" :src="IconHelper.get('common', 'eye-open')" />
				<InlineSvg v-show="!isVisible" :src="IconHelper.get('common', 'eye-closed')" />
			</span>
		</div>
		<div class="amount">
			<span class="value">{{ appStore.settings.currency.symbol }}&thinsp;{{ amount }}</span>
		</div>
		<div class="actions">
			<MainButton :label="$t('buttons.send')" icon-name="send" icon-section="common" />
			<MainButton :label="$t('buttons.deposit')" icon-name="deposit" icon-section="common" />
			<MainButton :label="$t('buttons.exchange')" icon-name="exchange" icon-section="common" />
		</div>
	</div>
</template>

<script lang="ts" setup>
import { computed, type ComputedRef, ref, type Ref } from "vue";
import InlineSvg from "vue-inline-svg";
import IconHelper from "@/core/helpers/Icons";
import { useI18n } from "vue-i18n";
import MainButton from "@/components/common/MainButton.vue";
import { useAppStore } from "@/stores/app";

const { n } = useI18n();
const appStore = useAppStore();

const amount: ComputedRef<string> = computed(() => {
	return isVisible.value ? n(485895, "currency") : "—";
});
const isVisible: Ref<boolean> = ref(true);

function changeVisibility(): void {
	isVisible.value = !isVisible.value;
}
</script>

<style lang="scss" scoped>
.totalBalanceContent {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	align-content: center;
	margin-bottom: 40px;

	.header {
		font-family: "Figtree Regular", sans-serif;
		font-size: 20px;
		color: #6d6d6d;
		display: inline-flex;
		align-items: center;

		.eye {
			height: 20px;
			width: 20px;
			margin-left: 8px;
			cursor: pointer;

			svg {
				height: 20px;
				width: 20px;

				:deep(path) {
					fill: #6d6d6d;
				}
			}
		}
	}

	.amount {
		display: inline-flex;
		align-items: center;
		margin: 20px 0;

		.value {
			font-family: "Figtree Semibold", sans-serif;
			font-size: 40px;
		}
	}
}

.p-button {
	width: 176px;

	&:not(:last-child) {
		margin-right: 4px;
	}
}
</style>
