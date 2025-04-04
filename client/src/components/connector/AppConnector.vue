<template>
	<div class="connectorContainer">
		<div class="leftCorner" />
		<div class="connector">
			<div
				v-for="(network, i) in networks"
				:key="i"
				:class="{ active: getNetworkName(network) !== '' }"
				:title="getNetworkName(network)"
				class="single"
				@click="onNetworkClick(network)">
				<span :class="`${network}`" class="icon">
					<InlineSvg :src="IconHelper.get('connector', network)" />
				</span>
			</div>
			<!--			<span class="single" @click="aaa">AAA</span>-->
		</div>
		<div class="rightCorner" />
	</div>
</template>

<script lang="ts" setup>
import { useAuthStore } from "@/stores/auth";
import IconHelper from "@/core/helpers/Icons";
import InlineSvg from "vue-inline-svg";
import { main } from "@/core/globals";
import { useRouter } from "vue-router";
import { SocketEventTypes } from "@/core/connection/Socket";

const networks: string[] = [
	"wallet",
	"telegram",
	"discord",
	"instagram",
	"twitter",
	"email",
	"github",
];
const authStore = useAuthStore();
const router = useRouter();

function onNetworkClick(network: string) {
	if (getNetworkName(network) !== "") {
		return;
	}
	switch (network) {
		case "telegram":
			onTelegramAuthClick();
			break;

		case "email":
			onGmailAuthClick();
			break;

		case "twitter":
			onTwitterAuthClick();
			break;

		case "github":
			onGithubAuthClick();
			break;
	}
}

function onTwitterAuthClick(): void {
	if (getNetworkName("twitter")) {
		return;
	}
	const tapiUrl = import.meta.env.VITE_TAPI_URL ?? "/";
	document.location = `${tapiUrl}/auth/twitter?redirectOnSuccess=https:\\/\\/orava.ru`;
}

function onGithubAuthClick(): void {
	if (getNetworkName("github")) {
		return;
	}
	document.location = `${main().config.apiBaseUrl}/auth/github`;
}

function onGmailAuthClick(): void {
	if (getNetworkName("email")) {
		return;
	}
	document.location = `${main().config.apiBaseUrl}/auth/google`;
}

function onTelegramAuthClick(): void {
	router.push("/auth/telegram/callback");
}

function getNetworkName(network: string): string {
	const user = authStore.account;
	if (user == null) {
		return "";
	}
	switch (network) {
		case "telegram":
			return user.data?.telegram?.username ?? "";
		case "email":
			return user.data?.google?.displayName ?? "";
		case "twitter":
			return user.data?.twitter?.displayName ?? "";
		case "github":
			return user.data?.github?.displayName ?? "";
	}
	return "";
}

function aaa(): void {
	main().connection.socket.send(SocketEventTypes.Authorize, {});
}
</script>

<style lang="scss" scoped>
.connectorContainer {
	position: absolute;
	pointer-events: none;
	top: 0;
	left: 0;
	width: 100%;
	display: flex;
	flex-direction: row;
	justify-content: center;

	.leftCorner,
	.rightCorner {
		background: transparent url("@/assets/layout/tabhead-left-top-inactive.png") no-repeat top left;
		width: 73px;
		height: 34px;
		transform: scaleY(-1);
	}

	.rightCorner {
		transform: scale(-1);
	}
}

.connector {
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	pointer-events: all;
	border-bottom: 1px solid #212127;
	background: #0a0a0a;

	.single {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 5px;
		cursor: pointer;
		background: transparent;

		&:first-of-type {
			border-bottom-left-radius: 8px;
		}

		&:last-of-type {
			border-bottom-right-radius: 8px;
		}

		&:not(.active):hover {
			background-color: #151517;
		}

		&.active {
			cursor: default;

			:deep(svg) {
				path {
					fill: #12ffff;
				}
			}
		}

		.icon,
		:deep(svg) {
			width: 22px;
			height: 22px;
		}
	}
}
</style>
