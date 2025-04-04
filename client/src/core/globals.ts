import type { AuthManager } from "@/core/auth/AuthManager";
import type ConnectionManager from "@/core/connection/ConnectionManager";

export type MainConfig = {
	apiBaseUrl: string;
};

export type Main = {
	readonly config: MainConfig;
	readonly auth: AuthManager;
	readonly connection: ConnectionManager;
};

let mainInstance: Main;

export function setMainInstance(data: Main): void {
	mainInstance = data;
}

export function main(): Main {
	if (mainInstance == null) {
		throw new Error("App is not initialized");
	}
	return mainInstance;
}
