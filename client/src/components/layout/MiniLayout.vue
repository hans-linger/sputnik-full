<template>
	<div class="miniLayoutContainer">
		<div class="miniLayout">
			<slot />
		</div>
	</div>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
.miniLayoutContainer {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	height: 100%;
}
.miniLayout {
	flex-grow: 0;
	flex-shrink: 1;
	display: flex;
	flex-direction: column;
	align-items: stretch;
	justify-content: flex-start;
	max-width: 505px;
	min-width: 300px;
	background-color: rgba(13, 13, 14, 0.9);
	padding: 100px;
}
</style>
