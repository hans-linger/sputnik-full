export default class DBManager {
	static #instance: DBManager;
	private constructor() {}

	static get instance(): DBManager {
		if (!this.#isStorageEnabled()) {
			throw new Error("LocalStorage is disabled");
		}
		if (DBManager.#instance == null) {
			DBManager.#instance = new DBManager();
		}
		return DBManager.#instance;
	}

	static #isStorageEnabled(): boolean {
		try {
			const k = "--storage--test--";
			localStorage.setItem(k, "123");
			localStorage.getItem(k);
			return true;
		} catch {
			return false;
		}
	}

	set(key: string, value: string | object) {
		value = JSON.stringify(value);
		localStorage.setItem(key, value);
	}

	get(key: string): string | object | null {
		const value = localStorage.getItem(key);
		return value ? JSON.parse(value) : null;
	}

	clear(key: string): void {
		localStorage.removeItem(key);
	}
}
