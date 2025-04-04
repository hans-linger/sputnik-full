<template>
	<MainLayout>
		<div class="nftsContainer">
			<Tabs value="exchange">
				<TabList>
					<Tab as="div" value="my">{{ $t("nfts.header.my") }}</Tab>
					<Tab as="div" value="exchange">{{ $t("nfts.header.exchange") }}</Tab>
				</TabList>
				<TabPanels>
					<TabPanel value="my">
						<NftList />
					</TabPanel>
					<TabPanel value="exchange">
						<Offers />
					</TabPanel>
				</TabPanels>
			</Tabs>
		</div>
	</MainLayout>
</template>

<script lang="ts" setup>
import MainLayout from "@/components/layout/MainLayout.vue";
import { Tab, TabList, TabPanel, TabPanels, Tabs } from "primevue";
import NftList from "@/components/nft/NftList.vue";
import Offers from "@/components/stock/Offers.vue";
</script>

<style lang="scss" scoped>
.nftsContainer {
	padding: 100px 24px;
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-items: flex-start;
	min-height: 0;
	height: 100%;
}

.p-tabs {
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: stretch;
}

:deep(.p-tablist-tab-list) {
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	align-items: flex-end;
}

.p-tablist-content {
	.p-tab {
		padding: 6px 12px;
		margin-right: 6px;
		border: 1px solid #37373f;
		background: #1a1a1b;
		border-radius: 10px;
		cursor: pointer;
		width: 250px;
		text-align: center;

		&.p-tab-active {
			background: #e2e2e2;
			color: #000;
			cursor: default;
			padding: 12px 12px;
		}
	}
}
</style>
