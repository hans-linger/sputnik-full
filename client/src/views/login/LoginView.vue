<template>
	<ModalWindow v-model:visible="isTelegramDialogShown" modal>
		<TelegramAuth
			request-access="read"
			telegram-login="SputnikAppTestBot"
			@callback="onTelegramAuth" />
	</ModalWindow>
	<ModalWindow v-model:visible="isEmailDialogShown" modal>
		<EmailSignIn />
	</ModalWindow>
	<div v-if="!authStore.isAuthorized" class="container">
		<div class="menu">
			<div class="logo">
				<img src="@/assets/menu-logo.png" />
			</div>
			<div class="text">
				{{ $t("actions.loginWith") }}
			</div>
			<div class="networks">
				<div
					v-for="(network, i) in networks"
					:key="i"
					class="single"
					@click="onNetworkClick(network)">
					<span class="icon">
						<InlineSvg :src="IconHelper.get('links', network)" />
					</span>
					<span class="name">
						{{ $t(`networks.${network}`) }}
					</span>
				</div>
				<div class="single" @click="onConnectWallet">
					<span class="icon">
						<InlineSvg :src="IconHelper.get('links', 'wallet')" />
					</span>
					<span class="name">
						{{ $t("actions.connectWallet") }}
					</span>
				</div>
			</div>
		</div>
		<div class="content">
			<div class="wrap">
				{{ $t("login.text") }}
			</div>
		</div>
	</div>
	<div v-else>qwqw</div>
</template>

<script lang="ts" setup>
import { onMounted, ref, type Ref } from "vue";
import InlineSvg from "vue-inline-svg";
import type { TelegramAuthResponse } from "@/components/auth/TelegramAuth.vue";
import TelegramAuth from "@/components/auth/TelegramAuth.vue";
import IconHelper from "@/core/helpers/Icons";
import ModalWindow from "@/components/modal/ModalWindow.vue";
import EmailSignIn from "@/components/modal/EmailSignIn.vue";
import { useAuthStore } from "@/stores/auth";
import { useChainStore } from "@/stores/chains";
import { main } from "@/core/globals";
import { useRouter } from "vue-router";
import axios from "axios";

const networks: string[] = ["telegram", "discord", "twitter", "email", "instagram", "github"];
const isTelegramDialogShown: Ref<boolean> = ref(false);
const isEmailDialogShown: Ref<boolean> = ref(false);
const authStore = useAuthStore();
const chainStore = useChainStore();
const router = useRouter();

onMounted(() => {
	if (authStore.isAuthorized) {
		router.push("/");
	}
});

function onNetworkClick(network: string) {
	switch (network) {
		case "telegram":
			onTelegramAuthClick();
			break;

		case "email":
			onEmailAuthClick();
			break;

		case "twitter":
			onTwitterAuthClick();
			break;

		case "github":
			onGithubAuthClick();
			break;
	}
}

function onTelegramAuthClick(): void {
	isTelegramDialogShown.value = true;
}

function onTwitterAuthClick(): void {
	const tapiUrl = import.meta.env.VITE_TAPI_URL ?? "/";
	document.location = `${tapiUrl}/auth/twitter?redirectOnSuccess=${import.meta.env.VITE_HOST}/auth/twitter/callback`;
}

function onGithubAuthClick(): void {
	document.location = `${main().config.apiBaseUrl}/auth/github`;
}

function onTelegramAuth(data: TelegramAuthResponse): void {
	try {
		axios.post(`${main().config.apiBaseUrl}/auth/telegram/data`, data, {}).catch((err) => {
			console.error(err);
			router.push("/login");
		});
	} catch (e) {
		console.error(e);
		router.push("/");
	}
}

function onEmailAuthClick(): void {
	isEmailDialogShown.value = true;
}

function onConnectWallet(): void {
	authStore.init().then(() => {
		router.push("/");
	});
}
</script>

<style lang="scss" scoped>
.container {
	font-size: 24px;
	background: url("@/assets/bg.webp") no-repeat;
	background-position-y: 50%;
	background-size: cover;
	display: flex;
	flex-grow: 1;
	flex-direction: row;
	width: 100%;
	margin: 0 auto;
	justify-content: center;
	flex-shrink: 0;
	min-height: 100%;
}

.menu {
	display: flex;
	gap: 24px;
	flex-direction: column;
	align-items: center;
	padding: 40px 32px 0;
	width: 366px;
	background: rgba(0, 0, 0, 0.75);

	.text {
		padding: 8px 0 6px;
	}

	.networks {
		display: flex;
		gap: 12px;
		flex-direction: column;
		align-items: center;
		width: 100%;
	}

	.single {
		border: 1px solid #37373f;
		background: #0d0d0e;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		width: 100%;
		padding: 12px 0;
		border-radius: 10px;
		cursor: pointer;

		.icon {
			width: 110px;
			height: 40px;
			flex-grow: 0;
			flex-shrink: 0;
			padding-left: 32px;
		}

		.name {
			flex-grow: 1;
			font-size: 20px;
		}

		&:hover {
			background: #2d2d2e;

			.icon {
				:deep(svg) {
					path {
						fill: #adadae;
					}
				}
			}
		}
	}
}

.content {
	flex-grow: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	align-content: center;
	justify-content: center;
	min-height: 100%;
}

.x {
	background-color: white;
}
</style>
