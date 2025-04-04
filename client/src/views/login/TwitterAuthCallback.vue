<template>
	<div class="callbackContainer">{{ $t("login.success") }}</div>
</template>

<script lang="ts" setup>
import { onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import { main } from "@/core/globals";

const route = useRoute();
const router = useRouter();

onMounted(() => {
	try {
		const data = JSON.parse(route.query.user as string);
		axios
			.post(`${main().config.apiBaseUrl}/auth/twitter/data`, data)
			.then(() => {
				main()
					.auth.loadServerData()
					.then(() => {
						router.push("/");
					});
			})
			.catch(() => {
				router.push("/");
			});
	} catch (err) {
		console.log(err);
		router.push("/");
	}
});
</script>

<style lang="scss" scoped>
.callbackContainer {
	flex-grow: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	align-content: center;
	justify-content: center;
	min-height: 100%;
	font-size: 48px;
}
</style>
