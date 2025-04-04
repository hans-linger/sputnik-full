import DBManager from "@/core/storage/DBManager";
import { SESSION_DATA_KEY } from "@/core/constants";
import { jwtDecode } from "jwt-decode";
import axios, { InternalAxiosRequestConfig } from "axios";
import { main, type MainConfig } from "@/core/globals";
import Account, { isUserData, type User } from "@/core/models/Account";

export type TokenPayload = {
	token: string;
	address: string;
	user?: User;
};

export type TokenData = {
	address: string;
	username: string;
	exp: number;
	raw?: string;
};

export function isTokenData(obj: any): obj is TokenData {
	return (
		typeof obj === "object" &&
		obj != null &&
		["address", "username"].every((i) => i in obj && typeof obj[i] === "string")
	);
}

export function isAuthResponse(obj: unknown): obj is TokenPayload {
	return typeof obj === "object" && obj != null && ["token", "address"].every((x) => x in obj);
}

export enum AuthStatus {
	None = "None",
	Initializing = "Initializing",
	LoggedOut = "LoggedOut",
	Refreshing = "Refreshing",
	LoginSent = "LoginSent",
	LoginError = "LoginError",
	Authorized = "Authorized",
	Failed = "Failed",
	TokenExpired = "TokenExpired",
}

export type AuthStatusListener = (status: AuthStatus, user?: Account) => void;

export class AuthManager {
	static #instance: AuthManager;
	#config: MainConfig;
	#account?: Account;
	#status: AuthStatus = AuthStatus.Initializing;
	#listeners: AuthStatusListener[] = [];

	private constructor(config: MainConfig) {
		this.#config = config;
		axios.interceptors.request.use(this.#requestInterceptor.bind(this));
	}

	get account(): Readonly<Account> | null {
		return this.#account != null ? (this.#account as Readonly<Account>) : null;
	}

	set account(account: Account) {
		this.#account = account;
		this.#invokeListeners();
	}

	get status(): Readonly<AuthStatus> {
		return this.#status as Readonly<AuthStatus>;
	}

	set status(status: AuthStatus) {
		this.#status = status;
		this.#invokeListeners();
	}

	static getInstance(config: MainConfig): AuthManager {
		if (AuthManager.#instance == null) {
			AuthManager.#instance = new AuthManager(config);
		}
		return AuthManager.#instance;
	}

	async init(): Promise<Readonly<Account> | null> {
		if (this.account != null) {
			return this.account;
		}
		await this.loadStoredData();
		await this.loadServerData();
		return this.account ?? null;
	}

	clearData() {
		DBManager.instance.clear(SESSION_DATA_KEY);
		this.#invokeListeners();
	}

	async loadStoredData(): Promise<void> {
		try {
			const storedUserData = DBManager.instance.get(SESSION_DATA_KEY);
			if (storedUserData == null || storedUserData === "" || typeof storedUserData !== "string") {
				this.status = AuthStatus.LoggedOut;
				return;
			}
			const decoded = jwtDecode(storedUserData);
			if (isUserData(decoded)) {
				this.#setData(decoded);
				return;
			} else {
				this.status = AuthStatus.None;
			}
		} catch (error) {
			this.status = AuthStatus.Failed;
			console.error(error);
		}
		return;
	}

	async loadServerData(): Promise<void> {
		this.status = AuthStatus.Refreshing;
		const url = main().config.apiBaseUrl + "/hello";
		const response = await axios.get(url);
		if (isAuthResponse(response.data)) {
			if (response.data.user != null) {
				// auth success
				const account = Account.fromServer(response.data.user);
				if (account != null) {
					this.account = account;
					this.status = AuthStatus.Authorized;
				} else {
					this.status = AuthStatus.None;
				}
			} else {
				this.status = AuthStatus.LoggedOut;
			}
		}
	}

	addListener(listener: AuthStatusListener): void {
		this.#listeners.push(listener);
	}

	#requestInterceptor(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
		// if (this.#tokenString !== "") {
		// 	config.headers.Authorization = `Bearer: ` + this.#tokenString;
		// }
		return config;
	}

	#setData(user: User) {
		const account = Account.fromServer(user);
		if (account != null) {
			this.account = account;
			this.status = AuthStatus.Authorized;
		}

		this.#invokeListeners();
	}

	#invokeListeners(): void {
		this.#listeners.forEach((l) => l(this.#status, this.#account));
	}
}
