import AuthManager from "./auth/AuthManager";

export type MainConfig = {
	frontendHost: string;
};

export type Main = {
	readonly config: MainConfig;
	readonly auth: AuthManager;
};

let mainInstance: Main;

export function setMainInstance(): void {
	mainInstance = {
		config: {
			frontendHost: process.env.FRONTEND_HOST ?? "/",
		},
		auth: AuthManager.instance,
	};
}

export function main(): Main {
	if (mainInstance == null) {
		throw new Error("App is not initialized");
	}
	return mainInstance;
}
