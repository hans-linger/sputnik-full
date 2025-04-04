import {
	GithubProfile,
	GoogleProfile,
	TelegramAuthPayload,
	TelegramProfile,
	TwitterAuthPayload,
	User,
} from "./types";
import DBConnector from "../DB";
import { Balance } from "@prisma/client";

export default class AuthManager {
	#data?: User;
	#token?: string;
	static #instance: AuthManager;

	static get instance(): AuthManager {
		if (AuthManager.#instance == null) {
			AuthManager.#instance = new AuthManager();
		}
		return AuthManager.#instance;
	}

	static createUser(): User {
		const address = AuthManager.generateAddress();
		return {
			address,
			addresses: [],
			email: null,
			twitter: null,
			telegram: null,
			github: null,
			google: null,
		};
	}

	static generateAddress(): string {
		return crypto.randomUUID();
	}

	setToken(token: string): void {
		this.#token = token;
	}

	setData(data: User): void {
		this.#data = data;
	}

	updateAddresses(
		addresses: { chainId: string; address: string; balances: Balance[] }[]
	) {
		if (this.#data != null) {
			this.#data.addresses = addresses;
		}
	}

	async saveUser(): Promise<void> {
		if (this.user != null) {
			const db = DBConnector.getInstance();
			const data = Object.assign({}, this.user);
			// @ts-ignore
			delete data.id;
			await db.client.account.update({
				where: {
					id: this.user.id,
				},
				data: data,
			});
		}
	}

	async getUserByAddress(address: string): Promise<User | null> {
		return DBConnector.getInstance().client.account.findFirst({
			where: {
				address: address,
			},
		});
	}

	async updateUserToken(address: string, token: string): Promise<void> {
		this.setToken(token);
		const db = DBConnector.getInstance().client.account;
		const user = await db.findFirst({
			where: {
				address,
			},
		});
		if (user != null) {
			await db.update({
				where: {
					id: user.id,
				},
				data: {
					token: token,
				},
			});
		}
	}

	get token(): Readonly<string> {
		return this.#token as Readonly<string>;
	}

	get user(): Readonly<User> {
		return this.#data as Readonly<User>;
	}

	get isAuthorized(): boolean {
		return this.#data?.id != null;
	}

	async loginOrCreateTwitter(data: TwitterAuthPayload): Promise<User> {
		const db = DBConnector.getInstance().client.account;
		let existingAddress =
			this.user != null
				? await db.findFirst({
						where: {
							address: this.user.address,
						},
					})
				: null;
		const existingTwitter = await db.findFirst({
			where: {
				twitter: {
					is: {
						accountId: data.profile.accountId,
					},
				},
			},
		});
		if (existingTwitter == null) {
			if (existingAddress == null) {
				existingAddress = await db.create({
					data: {
						address: AuthManager.generateAddress(),
						token: "",
						twitter: data.profile,
					},
				});
			}
			//
			existingAddress = await db.update({
				where: {
					id: existingAddress.id,
				},
				data: {
					twitter: data.profile,
				},
			});

			this.#data = existingAddress;
		} else if (existingAddress != null) {
			// merge twitter to current user (???)
			existingAddress = await db.update({
				where: {
					id: existingAddress.id,
				},
				data: {
					twitter: data.profile,
				},
			});
			this.#data = existingAddress;
		} else {
			this.#data = existingTwitter;
		}

		return this.user;
	}

	async loginOrCreateGoogle(data: GoogleProfile): Promise<User> {
		const db = DBConnector.getInstance().client.account;
		const existing = await db.findFirst({
			where: {
				google: {
					is: {
						id: data.id,
					},
				},
			},
		});
		if (existing != null) {
			this.#data = existing;
			return this.user;
		}

		let oldUser;
		if (this.user?.address != null) {
			oldUser = await db.findFirst({
				where: {
					address: this.user.address,
				},
			});
		}
		if (oldUser == null) {
			oldUser = await db.create({
				data: {
					address: this.user?.address ?? AuthManager.generateAddress(),
					token: "",
				},
			});
		}
		if (oldUser != null) {
			const result = await db.update({
				where: {
					id: oldUser.id,
				},
				data: {
					google: data,
				},
			});
			if (result != null) {
				this.#data = result;
			}
			return this.user;
		}

		return this.user;
	}

	async loginOrCreateGithub(data: GithubProfile): Promise<User> {
		const db = DBConnector.getInstance().client.account;
		let existingAddress =
			this.user != null
				? await db.findFirst({
						where: {
							address: this.user.address,
						},
					})
				: null;
		const existingGithub = await db.findFirst({
			where: {
				github: {
					is: {
						id: data.id,
					},
				},
			},
		});
		if (existingGithub == null) {
			if (existingAddress == null) {
				existingAddress = await db.create({
					data: {
						address: AuthManager.generateAddress(),
						token: "",
						github: data,
					},
				});
			}
			//
			existingAddress = await db.update({
				where: {
					id: existingAddress.id,
				},
				data: {
					github: data,
				},
			});

			this.#data = existingAddress;
		} else if (existingAddress != null) {
			// merge google to current user (???)
			existingAddress = await db.update({
				where: {
					id: existingAddress.id,
				},
				data: {
					github: data,
				},
			});

			this.#data = existingAddress;
		} else {
			this.#data = existingGithub;
		}

		return this.user;
	}

	async loginOrCreateTelegram(data: TelegramAuthPayload): Promise<User> {
		const parsed: TelegramProfile = {
			id: data.id.toString(),
			firstName: data.first_name,
			lastName: data.last_name,
			photos: [data.photo_url],
			username: data.username,
		};

		const db = DBConnector.getInstance().client.account;
		const existing = await db.findFirst({
			where: {
				telegram: {
					is: {
						id: parsed.id,
					},
				},
			},
		});
		if (existing) {
			this.#data = existing;
			return this.user;
		}

		let oldUser = await db.findFirst({
			where: {
				address: this.user.address,
			},
		});
		if (oldUser == null) {
			oldUser = await db.create({
				data: {
					address: this.user.address,
					token: "",
				},
			});
		}
		if (oldUser != null) {
			const result = await db.update({
				where: {
					id: oldUser.id,
				},
				data: {
					telegram: parsed,
				},
			});
			if (result != null) {
				this.#data = result;
			}
			return this.user;
		}

		return this.user;
	}
}
