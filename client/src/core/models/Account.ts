export type User = {
	id?: string; // MongoDB id
	token: string;
	address: string;
	email: string | null;
	twitter: TwitterProfile | null;
	google: GoogleProfile | null;
	github: GithubProfile | null;
	telegram: TelegramProfile | null;
};

export type TwitterProfile = {
	accountId: string;
	username: string;
	displayName: string;
	photos: string[];
};

export type GithubProfile = {
	id: string;
	username: string;
	displayName: string;
	photos: string[];
	profileUrl: string;
};

export type GoogleProfile = {
	id: string;
	displayName: string;
	photos: string[];
	name: {
		familyName: string;
		givenName: string;
	};
};

export type TelegramProfile = {
	id: string;
	firstName: string;
	lastName: string;
	username: string;
	photos: string[];
};

export function isUserData(obj: any): obj is User {
	return (
		obj != null &&
		typeof obj === "object" &&
		["token", "address"].every((x) => x in obj) &&
		["google", "twitter", "github", "telegram"].some((x) => x in obj)
	);
}

const socialPrecedence = ["github", "twitter", "google", "telegram"];

export default class Account {
	data?: User;

	static fromServer(data: unknown): Account | null {
		if (isUserData(data)) {
			const acc = new Account();
			acc.data = data;
			return acc;
		}
		return null;
	}

	async init(): Promise<void> {
		this.#loadSavedData();
	}

	getAvatar(): string | null {
		if (this.data == null) {
			return null;
		}
		for (const p of socialPrecedence) {
			// @ts-expect-error qwe
			if (p in this.data && this.data[p] != null) {
				// @ts-expect-error qwe
				return this.data[p].photos[0];
			}
		}
		return null;
	}

	getDisplayname(): string | null {
		if (this.data == null) {
			return null;
		}
		for (const p of socialPrecedence) {
			// @ts-expect-error okay
			if (p in this.data && this.data[p] != null) {
				// @ts-expect-error okay
				return this.data[p].displayName;
			}
		}
		return null;
	}

	#loadSavedData(): void {
		//
	}
}
