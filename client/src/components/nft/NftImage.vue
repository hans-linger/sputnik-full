<template>
	<div class="nftImage">
		<div class="img">
			<img :src="getUrl()" />
		</div>
	</div>
</template>

<script lang="ts" setup>
function getUrl(): string {
	return "https://ipfs.io/" + props.img.replace("://", "/");
}

const props = defineProps<{ img: string }>();
</script>

<style lang="scss" scoped>
.nftImage {
	position: relative;

	.background {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
	}

	.img {
		padding: 10px;

		img {
			width: 100%;
			height: 100%;
		}
	}
}
</style>
