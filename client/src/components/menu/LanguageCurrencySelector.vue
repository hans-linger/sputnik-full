<template>
	<div ref="toggle" class="languageCurrencySelectorContainer" @click="showSelector">
		<div class="wrap">
			<InlineSvg :src="IconHelper.get('common', 'language')" />
			<span class="text">
				<span class="currency">{{ appStore.settings.currency.name }}</span>
				&nbsp;&mdash;&nbsp;
				<span class="language">{{ appStore.settings.language.name }}</span>
			</span>
			<span class="toggler">
				<InlineSvg v-show="!isShowing" :src="IconHelper.get('common', 'chevron-wide-down')" />
				<InlineSvg v-show="isShowing" :src="IconHelper.get('common', 'chevron-wide-up')" />
			</span>
		</div>
		<Popover
			ref="selector"
			:style="{ width: `${toggleWidth}px`, marginBottom: '-20px' }"
			class="languages"
			@hide="onHide">
			<div class="currencies tab">
				<div
					v-for="(item, i) in currencyList"
					:key="item.code"
					:class="{ single: true, current: item.code === appStore.settings.currency.code }"
					@click="setCurrency(item.code)">
					{{ item.name }}
				</div>
			</div>
			<div class="divide"></div>
			<div class="languages tab">
				<div
					v-for="(item, i) in languageList"
					:key="item.code"
					:class="{ single: true, current: item.code === appStore.settings.language.code }"
					@click="setLanguage(item.code)">
					{{ item.name }}
				</div>
			</div>
		</Popover>
	</div>
</template>

<script lang="ts" setup>
import { onMounted, ref, Ref, ShallowRef, useTemplateRef } from "vue";
import { Popover } from "primevue";
import InlineSvg from "vue-inline-svg";
import IconHelper from "@/core/helpers/Icons";
import { useAppStore } from "@/stores/app";
import SettingsHelper from "@/core/helpers/Settings";
import { useI18n } from "vue-i18n";

const i18 = useI18n();
const isShowing: Ref<boolean> = ref(false);
const popover = useTemplateRef("selector");
const toggle: Readonly<ShallowRef<HTMLDivElement | null>> = useTemplateRef("toggle");
const toggleWidth: ShallowRef<number> = ref(0);

const appStore = useAppStore();
const languageList = ref(SettingsHelper.languageList);
const currencyList = ref(SettingsHelper.currencyList);

function showSelector(event: MouseEvent): void {
	if (toggle.value == null) {
		return;
	}

	isShowing.value = true;
	// @ts-expect-error primevue+ts
	popover.value.toggle(event);
}

function onHide(): void {
	isShowing.value = false;
}

function setCurrency(code: string): void {
	appStore.setCurrency(code);
	// @ts-expect-error primevue+ts
	popover.value.hide();
}

function setLanguage(code: string): void {
	appStore.setLanguage(code);
	i18.locale.value = appStore.settings.language.code;
	// @ts-expect-error primevue+ts
	popover.value.hide();
}

onMounted(() => {
	if (toggle.value != null) {
		toggleWidth.value = toggle.value.offsetWidth;
	}
});
</script>

<style lang="scss" scoped>
.languageCurrencySelectorContainer {
	padding: 8px 15px 8px 42px;
	margin: 10px 14px;
	border: 1px solid #686868;
	border-radius: 20px;
	cursor: pointer;

	.wrap {
		display: flex;
		flex-direction: row;
		justify-content: stretch;
		align-items: center;

		.text {
			flex-grow: 1;
			padding-left: 12px;
			text-transform: uppercase;
			line-height: 22px;
			font-family: "Figtree Semibold", sans-serif;
			letter-spacing: 0.08em;
			color: #6d6d6d;
		}

		.toggler {
			flex-grow: 0;
			margin-bottom: -5px;
		}
	}
}
</style>

<style>
.p-popover.languages {
	padding: 15px;
	border-radius: 20px;

	.p-popover-content {
		display: flex;
		flex-direction: row;
		align-items: flex-start;
		justify-content: stretch;
		width: 100%;

		.divide {
			width: 1px;
			flex-grow: 0;
			flex-shrink: 0;
			margin: 0 12px;
			background: #2a2a2a;
			min-height: 0;
			align-self: stretch;
		}
	}

	.tab {
		flex-grow: 1;
		display: flex;
		flex-direction: column;
		gap: 8px;
		justify-content: center;
		align-items: stretch;
	}

	.single {
		border-radius: 26px;
		border: 1px solid #37373f;
		cursor: pointer;
		padding: 8px 12px;
		vertical-align: middle;
		font-size: 16px;
		line-height: 16px;
		text-align: center;

		&:hover {
			border-color: #686868;
		}

		&.current {
			background-color: #2e2e32;
			cursor: default;
		}
	}
}
</style>
