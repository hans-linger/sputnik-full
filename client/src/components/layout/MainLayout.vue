<template>
	<div class="mainLayout">
		<slot />
	</div>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
.mainLayout {
	flex-grow: 1;
	display: flex;
	flex-direction: column;
	align-items: stretch;
	justify-content: flex-start;
	min-height: 700px;
	max-width: 1205px;
	margin: 0 auto;
	gap: 1px;
	background-color: rgba(13, 13, 14, 0.9);
}
</style>
