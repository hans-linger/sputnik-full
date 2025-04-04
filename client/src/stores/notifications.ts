import { defineStore } from "pinia";
import { ToastMessageOptions } from "primevue";

export const useNotificationsStore = defineStore("notifications", () => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	function add(s: ToastMessageOptions) {}

	return {
		add,
	};
});
