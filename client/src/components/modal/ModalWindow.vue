<template>
	<Dialog modal v-bind="props">
		<slot />
	</Dialog>
</template>

<script lang="ts" setup>
import { Dialog } from "primevue";

const props = defineProps({
	// @ts-expect-error ...
	...Dialog.props,
});
</script>

<style lang="scss">
.p-dialog-mask {
	background: rgba(0, 0, 0, 0.5);
}

.p-dialog {
	min-width: 400px;
	border: 1px solid #37373f;
	background-color: #0d0d0e;
	border-radius: 10px;
	overflow: hidden;
}

.p-dialog-header {
}

.p-dialog-title {
}
.p-dialog-header-actions {
	display: flex;
	flex-direction: row-reverse;
	justify-content: flex-start;
	align-content: center;

	.p-button {
		border: 0;
		width: 20px;
		height: 20px;
		border-bottom-left-radius: 10px;
		background: #37373d;
		color: #a7a7af;
		text-align: center;
		display: inline-flex;
		justify-content: center;
		align-content: center;
		flex-direction: column;
		cursor: pointer;
		outline: none;

		&:hover {
			color: #c7c7cf;
		}

		&:active,
		&:focus-visible {
			border: 0;
			outline: none;
		}

		svg {
			width: 10px;
			height: 10px;
		}
	}

	.p-button-label {
		display: none;
	}
}
.p-dialog-maximize-button {
}
.p-dialog-close-button {
	background: white;
	color: black;
}
.p-dialog-content {
	padding: 24px;
	color: #fff;
}
.p-dialog-footer {
}

:deep(#telegram-login-SputnikAppTestBot) body {
	color: #fff;
}
</style>
