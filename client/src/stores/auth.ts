import { defineStore } from "pinia";
import { ref, type Ref } from "vue";
import { main } from "@/core/globals";

import defaultAvatar from "@/assets/dummy_avatar.png";
import type Account from "@/core/models/Account";
import { AuthStatus } from "@/core/auth/AuthManager";

export const useAuthStore = defineStore("auth", () => {
	const isAuthorized: Ref<Readonly<boolean>> = ref(false);

	const account: Ref<Readonly<Account> | null> = ref(null);

	async function init(): Promise<void> {
		main().auth.addListener((status, user) => {
			isAuthorized.value = status === AuthStatus.Authorized;
			account.value = user ?? null;
		});
		try {
			await main().auth.init();
		} catch (e) {
			console.error(e);
		}
	}

	async function loadUserData(): Promise<void> {
		const storedData = main().auth.loadStoredData();
	}

	function getAvatar(): string {
		return main().auth.account?.getAvatar() ?? defaultAvatar;
	}

	function getDisplayname(): string {
		return main().auth.account?.getDisplayname() ?? "Clint Eastwood";
	}

	return {
		// actions
		getAvatar,
		getDisplayname,
		init,
		loadUserData,

		// state
		account,
		isAuthorized,
	};
});
