<template>
	<div class="callbackContainer">{{ $t("login.success") }}</div>
</template>

<script lang="ts" setup>
import { useRoute, useRouter } from "vue-router";
import { onMounted } from "vue";
import axios from "axios";
import { main } from "@/core/globals";

const route = useRoute();
const router = useRouter();

onMounted(() => {
	axios.get(`${main().config.apiBaseUrl}/auth/github/code?code=${route.query.code}`).then(() => {
		main()
			.auth.loadServerData()
			.then(() => {
				router.push("/");
			});
	});
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
