<template>
	<div id="appContainer">
		<div class="toaster">
			<Toast />
		</div>
		<AppLayout v-if="isLoaded">
			<RouterView />
		</AppLayout>
	</div>
</template>

<script lang="ts" setup>
import "primeicons/primeicons.css";
import { RouterView, useRouter } from "vue-router";
import { onMounted, ref, type Ref } from "vue";
import { useAppStore } from "@/stores/app";
import { useAuthStore } from "@/stores/auth";
import { Toast, ToastMessageOptions, useToast } from "primevue";
import AppLayout from "@/components/layout/AppLayout.vue";
import { useNotificationsStore } from "@/stores/notifications";

const isLoaded: Ref<boolean> = ref(false);
const appStore = useAppStore();
const authStore = useAuthStore();
const router = useRouter();
const notificationsStore = useNotificationsStore();
const toast = useToast();
notificationsStore.$onAction((payload: { args: ToastMessageOptions[] }) => {
	toast.add(payload.args[0]);
});

onMounted(async () => {
	appStore.init().then(() => {
		if (!authStore.isAuthorized) {
			isLoaded.value = true;
			router.push("/login");
		} else {
			isLoaded.value = true;
		}
	});
});
</script>

<style lang="scss">
@use "@/styles/style";

#app {
	height: 100%;
	display: flex;
}
#appContainer {
	display: flex;
	align-items: flex-start;
	align-content: flex-start;
	width: 100%;
	height: 100%;
}
#contentContainer {
	max-width: 1000px;
	min-width: 600px;
	min-height: 100%;
	width: 100%;
	margin: 0 auto;
	display: flex;
	align-items: flex-start;
}

@media only screen and (min-width: 600px) {
	#contentContainer {
		max-width: 1000px;
		min-width: 600px;
	}
}

@media only screen and (max-width: 600px) {
	#contentContainer {
		max-width: 600px;
		min-width: 320px;
	}
}

.toaster {
	position: fixed;
	left: 0;
	top: 0;
	width: 100%;
	z-index: 2000;
}
</style>
