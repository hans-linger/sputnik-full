import { defineStore } from "pinia";
import { useAuthStore } from "@/stores/auth";
import { ref, type Ref } from "vue";
import SettingsHelper, { UserSettings } from "@/core/helpers/Settings";

export const useAppStore = defineStore("app", () => {
	const settings: Ref<UserSettings> = ref(SettingsHelper.loadFromDB());

	async function init(): Promise<void> {
		const authStore = useAuthStore();
		await authStore.init();
	}

	function setLanguage(code: string): void {
		SettingsHelper.setLanguage(code);
		settings.value = SettingsHelper.current;
	}

	function setCurrency(code: string): void {
		SettingsHelper.setCurrency(code);
		settings.value = SettingsHelper.current;
	}

	return {
		// actions
		init,
		setCurrency,
		setLanguage,

		// state
		settings,
	};
});
