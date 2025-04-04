<template>
	<MainLayout>
		<div class="totalContainer">
			<TotalBalance />
		</div>
		<div class="claimContainer">
			<div class="hr-small" />
			<div class="hr gradientBorder" />
			<ClaimStake />
			<div class="hr gradientBorder" />
			<div class="hr-small" />
		</div>
		<div class="assetsContainer">
			<AssetList />
		</div>
	</MainLayout>
</template>

<script lang="ts" setup>
import TotalBalance from "@/components/main/TotalBalance.vue";
import ClaimStake from "@/components/main/ClaimStake.vue";
import AssetList from "@/components/main/AssetList.vue";
import MainLayout from "@/components/layout/MainLayout.vue";
</script>

<style lang="scss" scoped>
.totalContainer {
	flex-grow: 0;
	flex-shrink: 0;
	padding-top: 100px;
}

.claimContainer {
	flex-shrink: 0;
	flex-grow: 0;
	max-width: 717px;
	margin: 0 auto;
	width: 100%;

	.hr-small {
		height: 1px;
		width: 469px;
		background-color: #212127;
		margin: 0 auto;
	}
	.hr {
		height: 1px;
		margin: 6px auto;
	}
}

.assetsContainer {
	flex-grow: 1;
	height: 100%;
	min-height: 0;
}
</style>
