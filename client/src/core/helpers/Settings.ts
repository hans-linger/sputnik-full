import DBManager from "@/core/storage/DBManager";

export interface Language {
	code: string;
	name: string;
}

export type Currency = {
	code: string;
	name: string;
	symbol: string;
	icon?: string;
};

export type UserSettings = {
	language: Language;
	currency: Currency;
};

const SETTINGS_KEY = "app-settings-key";

const languageList: Language[] = [
	{
		code: "en",
		name: "ENG",
	},
	{
		code: "ru",
		name: "RUS",
	},
	// {
	// 	code: "sr",
	// 	name: "SRB",
	// },
];

const currencyList: Currency[] = [
	{
		code: "usd",
		name: "USD",
		symbol: "$",
	},
	{
		code: "eur",
		name: "EUR",
		symbol: "€",
	},
];

export default class SettingsHelper {
	static language: Language = {
		code: "en",
		name: "ENG",
	};
	static currency: Currency = {
		code: "usd",
		name: "USD",
		symbol: "$",
	};

	static get languageList(): Language[] {
		return languageList;
	}

	static get currencyList(): Currency[] {
		return currencyList;
	}

	static get current(): UserSettings {
		return {
			language: SettingsHelper.language,
			currency: SettingsHelper.currency,
		};
	}

	static setLanguage(code: string) {
		const l = languageList.find((x) => x.code === code);
		if (l != null) {
			SettingsHelper.language = l;
			SettingsHelper.saveToDB();
		}
	}

	static setCurrency(code: string) {
		const c = currencyList.find((x) => x.code === code);
		if (c != null) {
			SettingsHelper.currency = c;
			SettingsHelper.saveToDB();
		}
	}

	static saveToDB(): void {
		DBManager.instance.set(SETTINGS_KEY, SettingsHelper.current);
	}

	static loadFromDB(): UserSettings {
		return (DBManager.instance.get(SETTINGS_KEY) as UserSettings) ?? SettingsHelper.current;
	}
}
