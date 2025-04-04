<template>
	<Button v-bind="$props"
		><InlineSvg
			v-if="props.iconSection != null && props.iconName != null"
			:src="IconHelper.get(props.iconSection, props.iconName)" />
		{{ props.label }}
	</Button>
</template>

<script lang="ts" setup>
import { Button } from "primevue";
import InlineSvg from "vue-inline-svg";
import IconHelper from "@/core/helpers/Icons";

defineOptions({
	inheritAttrs: true,
});

const props = defineProps({
	// @ts-expect-error ...
	...Button.props,
	iconSection: String,
	iconName: String,
	label: String,
	disabled: Boolean,
});
</script>

<style lang="scss" scoped>
.p-button {
	border-radius: 10px;
	background: #0d0d0e;
	border: 1px solid rgba(255, 255, 255, 0.5);
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
