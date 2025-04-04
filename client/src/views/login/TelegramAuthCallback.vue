<template>
	<div class="callbackContainer">{{ $t("login.success") }}</div>
</template>

<script lang="ts" setup>
import { onMounted } from "vue";
import axios from "axios";
import { main } from "@/core/globals";

onMounted(() => {
	// FIXME provide proper data, move to store, redirect
	axios.post(`${main().config.apiBaseUrl}/auth/telegram/data`, {
		id: "",
		first_name: "",
		last_name: "",
		username: "",
		photo_url: "",
		auth_date: 0,
		hash: "",
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
