<template>
	<div class="filterContainer">
		<div class="collection">
			<i class="pi pi-folder" />&nbsp;<span v-if="filter?.collection != null">{{
				filter.collection.title
			}}</span>
			<span v-else>
				<i class="pi pi-question" />
			</span>
		</div>
		<!--div v-if="filter.type != null" class="type">T{{ filter.type }}</div>
		<div v-if="filter.subtype != null" class="subType">
			S{{ filter.subtype }}
		</div>
		<div v-if="filter.backgroundType != null" class="backgroundType">
			B{{ filter.backgroundType }}
		</div-->
	</div>
</template>

<script lang="ts" setup>
import { OfferFilter } from "@/stores/data";

const props = defineProps<{
	filter?: OfferFilter;
}>();
</script>

<style lang="scss" scoped>
.filterContainer {
	display: flex;
	flex-direction: row;
	gap: 6px;
}

i {
	margin-right: 4px;
}
</style>
