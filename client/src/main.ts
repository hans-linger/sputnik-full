// workaround for shitty libs
import { Buffer } from "buffer";
import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import { createI18n } from "vue-i18n";
import PrimeVue from "primevue/config";
import enJson from "@/assets/locales/en.json";
import ruJson from "@/assets/locales/ru.json";
import { type MainConfig, setMainInstance } from "@/core/globals";
import { AuthManager } from "@/core/auth/AuthManager";
import ConnectionManager from "@/core/connection/ConnectionManager";
import { useAppStore } from "@/stores/app";
import { ToastService } from "primevue";

window.Buffer = Buffer;

const apiUrl = import.meta.env.VITE_API_URL ?? "";

if (apiUrl === "") {
	throw new Error("Specify API Url");
}

const config: MainConfig = {
	apiBaseUrl: apiUrl,
};

async function init(): Promise<void> {
	setMainInstance({
		config: config,
		auth: AuthManager.getInstance(config),
		connection: ConnectionManager.getInstance(config),
	});
}

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);

const appStore = useAppStore();
// @ts-expect-error qwe
const i18n = createI18n({
	legacy: false,
	locale: appStore.settings.language.code ?? "en",
	fallbackLocale: "en",
	messages: {
		en: enJson.messages,
		ru: ruJson.messages,
	},
	numberFormats: {
		en: enJson.numberFormats,
		ru: ruJson.numberFormats,
	},
});
app.use(i18n);
app.use(PrimeVue, {
	theme: "none",
});
app.use(ToastService);
app.use(router);
init().then(() => {
	app.mount("#app");
});
