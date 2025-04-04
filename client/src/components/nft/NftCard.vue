<template>
	<div :class="{ noActions }" class="nftCard">
		<div class="img">
			<NftImage :img="nft.imageUrl" />
		</div>
		<div class="name">
			{{ nft.name }}
		</div>
		<div class="collection">
			{{ nft.collectionAddr }}
		</div>
		<div
			v-if="!noActions"
			class="actions"
			@click="$emit(NftCardEvents.SHOW_SEND_DIALOG, nft)"></div>
		<!--		<div v-else class="actions">-->
		<!--			<div class="actionsRow">-->
		<!--				<i class="pi pi-times-circle" @click="$emit(NftCardEvents.ABORT_TRANSACTION, nft)" />-->
		<!--			</div>-->
		<!--		</div>-->
	</div>
</template>

<script lang="ts" setup>
import { Nft, useNftStore } from "@/stores/nft";
import { NftCardEvents } from "@/core/constants";
import NftImage from "@/components/nft/NftImage.vue";

const dataStore = useNftStore();

const props = defineProps<{ nft: Nft; noActions?: boolean }>();
defineEmits<{
	(e: NftCardEvents.SHOW_SEND_DIALOG, nft: Nft): void;
	(e: NftCardEvents.ABORT_TRANSACTION, nft: Nft): void;
}>();
</script>

<style lang="scss" scoped>
@import "@/styles/vars";
$size: 227px;

.nftCard {
	border-radius: 8px;
	overflow: hidden;
	display: inline-block;
	margin: 0 12px 12px;
	position: relative;
	border: 1px solid #37373f;
	width: 260px;
	padding: 15px;
	background: #0d0d0e;
	transition: 0.2s all;

	&:hover:not(.noActions) {
		cursor: pointer;
		background-color: #232323;
	}

	.nftImage,
	:deep(img) {
		width: $size;
		height: $size;
		display: block;
	}

	.progress,
	.actions {
		position: absolute;
		left: 0;
		width: 100%;
		height: 100%;
	}

	.progress {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		background: rgba(100, 100, 100, 0.5);
	}

	.actions {
		bottom: 0;
	}

	.actionsRow {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		padding: 0;
		gap: 6px;
		height: 24px;

		i {
			cursor: pointer;
			transition: 0.2s color;

			&:hover {
				color: $button-active-color;
			}
		}
	}

	.progress {
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.5);
		left: 0;
		top: 0;
	}

	.name {
		font-size: 14px;
		text-align: center;
	}

	.collection {
		font-size: 14px;
		text-align: center;
		color: #686868;
	}

	.name,
	.collection {
		overflow: hidden;
		text-overflow: ellipsis;
		max-width: 100%;
		display: block;
		padding: 4px 12px;
	}
}
</style>
