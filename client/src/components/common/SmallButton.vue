<template>
	<Button>
		<InlineSvg
			v-if="props.iconSection != null && props.iconName != null"
			:src="IconHelper.get(props.iconSection, props.iconName)" />
	</Button>
</template>

<script lang="ts" setup>
import { Button } from "primevue";
import InlineSvg from "vue-inline-svg";
import IconHelper from "@/core/helpers/Icons";

defineOptions({
	inheritAttrs: false,
});

const props = defineProps({
	iconSection: String,
	iconName: String,
	disabled: Boolean,
});
</script>

<style lang="scss" scoped>
.p-button {
	border-radius: 22px;
	background: #1a1a1d;
	border: none;
	cursor: pointer;
	transition: background-color 0.1s;
	font-size: 16px;
	font-family: "Figtree Regular", sans-serif;
	display: inline-flex;
	justify-content: center;
	gap: 4px;
	padding: 4px 16px;

	&:hover {
		background: #000;
	}

	&:active {
		background: #3a3d45;
	}

	&:disabled,
	&:disabled:hover {
		cursor: default;
		color: #999;
		border-color: #999;
		background: #111;

		:deep(svg) {
			path {
				stroke: #999;
			}
		}
	}
}
</style>
