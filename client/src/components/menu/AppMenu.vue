<template>
	<div class="container">
		<div class="logo">
			<img alt="Sputnik App" src="@/assets/menu-logo-horizontal.png" />
		</div>
		<div class="user">
			<div class="avatar">
				<img :src="authStore.getAvatar()" alt="currentUser" />
			</div>
			<div class="usernameContainer">
				<div class="username"><i class="pi pi-at" />{{ authStore.getDisplayname() }}</div>
			</div>
		</div>
		<div class="menu">
			<div class="section">
				<MenuLink to="/"
					><i><InlineSvg :src="IconHelper.get('menu', 'home')" /></i>{{ $t("menu.home") }}</MenuLink
				>
				<MenuLink stroked to="/transactions"
					><i><InlineSvg :src="IconHelper.get('menu', 'transaction-history')" /></i
					>{{ $t("menu.transactionHistory") }}</MenuLink
				>
			</div>
			<div class="section">
				<MenuLink stroked to="/nft/"
					><i><InlineSvg :src="IconHelper.get('menu', 'nft')" /></i>{{ $t("menu.nft") }}</MenuLink
				>
				<MenuLink to="/gift-shop/"
					><i><InlineSvg :src="IconHelper.get('menu', 'gift')" /></i
					>{{ $t("menu.giftShop") }}</MenuLink
				>
			</div>
			<div class="section">
				<MenuLink
					:noSpace="true"
					to="https://docs.sputnik.network/sputnik-network-app-chain/sputnik-dex"
					><i><InlineSvg :src="IconHelper.get('menu', 'dex')" /></i>Sputnik DEX</MenuLink
				>
			</div>
			<div class="section">
				<MenuLink to="/settings/"
					><i><InlineSvg :src="IconHelper.get('menu', 'settings')" /></i
					>{{ $t("menu.settings") }}</MenuLink
				>
				<MenuLink to="/support/"
					><i><InlineSvg :src="IconHelper.get('menu', 'support')" /></i
					>{{ $t("menu.support") }}</MenuLink
				>
				<MenuLink to="/about/"
					><i><InlineSvg :src="IconHelper.get('menu', 'about')" /></i
					>{{ $t("menu.about") }}</MenuLink
				>
				<MenuLink :blank="true" :noSpace="true" to="https://docs.sputnik.network/sputnik-app"
					><i><InlineSvg :src="IconHelper.get('menu', 'guide')" /></i
					>{{ $t("menu.guide") }}</MenuLink
				>
			</div>
			<LanguageCurrencySelector />
		</div>
		<!--div class="spacer"></div>
		<div class="logoutContainer">
			<div class="btn"><i class="pi pi-sign-out" />&nbsp;Logout</div>
		</div-->
	</div>
</template>

<script lang="ts" setup>
import InlineSvg from "vue-inline-svg";
import MenuLink from "@/components/menu/MenuLink.vue";
import IconHelper from "@/core/helpers/Icons";
import { useAuthStore } from "@/stores/auth";
import LanguageCurrencySelector from "@/components/menu/LanguageCurrencySelector.vue";

const authStore = useAuthStore();
</script>

<style lang="scss" scoped>
.container {
	flex-direction: column;
	display: flex;
	align-items: stretch;
	position: absolute;
	left: 0;
	top: 0;
	min-height: 100%;
	width: 100%;
	overflow-y: visible;
}

.logo {
	text-align: center;
	margin-top: 32px;
	img {
		width: 255px;
		height: 49px;
	}
}

.avatar {
	border-radius: 80px;
	overflow: hidden;
	margin: 24px auto;

	&,
	img {
		width: 160px;
		height: 160px;
	}
}

.user {
	flex-grow: 0;
}

.usernameContainer {
	margin: 8px 16px 16px;
	border-width: 1px 0;
	border-style: solid;
	border-color: #696977;
	padding: 4px 8px;

	.username {
		text-align: center;
		border-width: 1px 0;
		border-style: solid;
		border-color: #696977;
		padding: 4px 0;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
		font-family: "Figtree Medium", sans-serif;
		font-size: 20px;
		letter-spacing: 0.24em;
		text-transform: uppercase;
	}
}

.section {
	background: #131314;
	border-radius: 25px;
	padding: 10px;
	margin: 10px 14px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	gap: 4px;
}

.menu {
	flex-grow: 0;
}

.spacer {
	flex-grow: 1;
}

.logoutContainer {
	flex-grow: 0;
	text-align: center;
}
</style>
