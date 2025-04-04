import SocketClient from "@/core/connection/Socket";
import type { MainConfig } from "@/core/globals";
import { main } from "@/core/globals";
import axios, { type AxiosResponse } from "axios";
import { isServerSuccess } from "@/core/helpers/misc";

export default class ConnectionManager {
	static #instance: ConnectionManager;
	readonly #socket?: SocketClient;

	private constructor(config: MainConfig) {
		this.#socket = new SocketClient(config);
		axios.interceptors.request.use((config) => {
			// config.headers["ngrok-skip-browser-warning"] = "69420";
			return config;
		});
		axios.interceptors.response.use((response: AxiosResponse) => {
			if (isServerSuccess(response.data)) {
				response.data = response.data.data;
			} else {
				console.warn(response.data);
			}
			return response;
		});
		axios.defaults.withCredentials = true;
	}

	get socket(): Readonly<SocketClient> {
		return this.#socket as Readonly<SocketClient>;
	}

	static getInstance(config?: MainConfig): ConnectionManager {
		if (config == null) {
			config = main().config;
			if (config == null) {
				throw new Error("Cannot init ConnectionManager");
			}
		}
		if (ConnectionManager.#instance == null) {
			ConnectionManager.#instance = new ConnectionManager(config);
		}
		return ConnectionManager.#instance;
	}

	connect(): void {
		this.socket.connect();
	}
}
