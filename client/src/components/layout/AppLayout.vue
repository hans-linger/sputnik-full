<template>
	<div :class="{ standalone }" class="layout">
		<div class="mainContainer">
			<div v-if="!standalone" class="menuContainer">
				<AppMenu />
			</div>
			<div class="contentContainer">
				<AppConnector v-if="authStore.isAuthorized" />
				<div ref="contentWrap" class="contentWrap">
					<slot />
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { useAuthStore } from "@/stores/auth";
import AppMenu from "@/components/menu/AppMenu.vue";
import { computed, type ComputedRef } from "vue";
import AppConnector from "@/components/connector/AppConnector.vue";

const standalone: ComputedRef<boolean> = computed(() => {
	return !authStore.isAuthorized;
});

const authStore = useAuthStore();
</script>

<style lang="scss" scoped>
.layout {
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	background: url("@/assets/bg-main.png");

	&.standalone {
		.mainContainer {
			max-width: 1920px;
		}

		.contentContainer {
			max-width: 100%;
		}
	}
}

.headerContainer {
	flex-shrink: 0;
}

.mainContainer {
	display: flex;
	flex-grow: 1;
	flex-direction: row;
	width: 100%;
	max-width: 1920px;
	margin: 0 auto;
	min-height: 100%;
	justify-content: center;
	border-color: #333;
	border-width: 0 1px;
	border-style: solid;
	box-shadow: 0 0 34px 4px #000;

	.menuContainer {
		max-width: 338px;
		min-width: 200px;
		flex-grow: 1;
		position: relative;
		align-self: stretch;
		background: #000000;
		height: 100%;
		overflow-y: auto;
	}

	.contentContainer {
		flex-grow: 1;
		height: 100%;
		position: relative;

		&.standalone {
			max-width: 100%;
		}

		.contentWrap {
			height: 100%;
			overflow: auto;
			margin: 0 auto;
			scrollbar-width: thin;
			scrollbar-color: #232326 #090909;
		}
	}
}
</style>
