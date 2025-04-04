import { createRouter, createWebHistory } from "vue-router";
import TwitterAuthCallback from "@/views/login/TwitterAuthCallback.vue";
import GoogleAuthCallback from "@/views/login/GoogleAuthCallback.vue";
import GithubAuthCallback from "@/views/login/GithubAuthCallback.vue";
import AboutView from "@/views/about/AboutView.vue";
import TelegramAuthCallback from "@/views/login/TelegramAuthCallback.vue";

const router = createRouter({
	linkActiveClass: "active",
	linkExactActiveClass: "exact",
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: "/",
			name: "main",
			component: () => import("@/views/main/MainView.vue"),
		},
		{
			path: "/login",
			name: "login",
			component: () => import("@/views/login/LoginView.vue"),
		},
		{
			path: "/transactions",
			name: "transactions",
			component: () => import("@/views/transactions/TransactionsView.vue"),
		},
		{
			path: "/nft",
			name: "nft",
			component: () => import("@/views/nfts/NftsView.vue"),
		},
		{
			path: "/settings",
			name: "settings",
			component: () => import("@/views/settings/SettingsView.vue"),
		},
		{
			path: "/support",
			name: "support",
			component: () => import("@/views/support/SupportView.vue"),
		},
		{
			path: "/about",
			name: "about",
			component: AboutView,
		},
		{
			path: "/guide",
			name: "guide",
			component: () => import("@/views/guide/GuideView.vue"),
		},
		{
			path: "/gift-shop/",
			name: "gift-shop",
			component: () => import("@/views/gift-shop/GiftShopView.vue"),
		},
		{
			path: "/auth/twitter/callback",
			component: TwitterAuthCallback,
		},
		{
			path: "/auth/google/callback",
			component: GoogleAuthCallback,
		},
		{
			path: "/auth/github/callback",
			component: GithubAuthCallback,
		},
		{
			path: "/auth/telegram/callback",
			component: TelegramAuthCallback,
		},
	],
});

export default router;
