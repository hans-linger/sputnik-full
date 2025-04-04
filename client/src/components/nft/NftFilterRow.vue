<template>
	<div class="container">
		<div class="reset cell">
			<ToggleButton :disabled="!isFilterApplied" label="All" @click="clearFilters" />
		</div>
		<div class="name cell">
			<IconField fluid>
				<InputText
					v-model="nameFilterValue"
					fluid
					placeholder="Name"
					@update:modelValue="onFilterChange" />
				<InputIcon>
					<InlineSvg :src="IconHelper.get('common', 'search')" />
				</InputIcon>
			</IconField>
		</div>
		<div class="collection cell">
			<Select
				v-model="selectedCollection"
				:disabled="props.filter?.collectionAddr != null || collectionsData.length < 2"
				:options="collectionsData"
				fluid
				input-id="collectionSelect"
				option-label="name"
				placeholder="Collection"
				@update:modelValue="onFilterChange" />
		</div>
	</div>
</template>

<script lang="ts" setup>
import { NftCollection, OfferFilter, useNftStore } from "@/stores/nft";
import { IconField, InputIcon, InputText, Select } from "primevue";
import { computed, ComputedRef, Ref, ref, shallowRef, ShallowRef } from "vue";
import { NftFiltersValue, NftListEvents } from "@/core/constants";
import ToggleButton from "@/components/common/ToggleButton.vue";
import IconHelper from "@/core/helpers/Icons";
import InlineSvg from "vue-inline-svg";

const dataStore = useNftStore();
const props = defineProps<{
	filter?: OfferFilter;
}>();
const emit = defineEmits<{
	(e: NftListEvents.FILTER_CHANGED, filters: NftFiltersValue): void;
}>();

const collectionsData: ComputedRef<NftCollection[]> = computed(() => {
	return dataStore.collections ? Array.from(dataStore.collections) : [];
});

const selectedCollection: Ref<NftCollection | null> = ref(null);
if (props.filter?.collectionAddr != null && collectionsData.value.length < 2) {
	selectedCollection.value = collectionsData.value[0];
}
const nameFilterValue: ShallowRef<string> = shallowRef("");

const isFilterApplied: ComputedRef<boolean> = computed(() => {
	return nameFilterValue.value != "" || selectedCollection.value != null;
});

function onFilterChange() {
	emit(NftListEvents.FILTER_CHANGED, {
		name: nameFilterValue.value ?? "",
		collection: selectedCollection.value ?? null,
	});
}

function clearFilters() {
	nameFilterValue.value = "";
	selectedCollection.value = null;
	onFilterChange();
}
</script>

<style lang="scss" scoped>
.container {
	display: flex;
	flex-direction: row;
	width: 100%;
	justify-content: space-between;
	align-items: center;
	gap: 8px;

	.cell {
		flex-grow: 1;
	}

	.reset {
		flex-grow: 0;
	}
}
</style>
