import { Data } from "ws";
import type { MainConfig } from "@/core/globals";

export type SocketEventHandler<TData> = (data: TData) => void;
export type ConnectionStatusListener = (status: ConnectionStatus) => void;

export enum SocketEventTypes {
	Authorize = "Authorize",
	Logout = "Logout",
	AuthOk = "AuthOk",
	AuthFail = "AuthFail",
	UserOnline = "UserOnline",
	UserOffline = "UserOffline",
}

export type MessagePayload = {
	data: Data;
	type: SocketEventTypes;
};

export function isMessagePayload(obj: any): obj is MessagePayload {
	return obj != null && typeof obj === "object" && obj.data != null && obj.type in SocketEventTypes;
}

export type UserOnlinePayload = {
	userId: string;
	username: string;
};

export type AuthOkPayload = {
	connectionId: string;
};

export type NewTransactionPayload = {
	transactionId: string;
};

export type TransactionIdPayload = {
	transactionId: string;
};

export type BargainIdPayload = {
	transactionId: string;
};

export type TransactionCounterPayload = TransactionIdPayload & {
	nftId: string;
};

export interface SocketEventListener<TData> {
	type: SocketEventTypes;
	handler: SocketEventHandler<TData>;
	isT: (obj: any) => obj is TData;
}

export enum ConnectionStatus {
	NONE = "None",
	ONLINE = "Online",
	AUTHORIZED = "Authorized",
	CONNECTING = "Connecting",
	TIMEOUT = "Timeout",
	OFFLINE = "Offline",
	FAILED = "Failed",
}
type ConnectionData = {
	status: ConnectionStatus;
	attempts: number;
	lastAttempt?: Date;
	handler?: ReturnType<typeof setTimeout> | null;
};

const RECONNECT_ATTEMPTS = 5;

export default class SocketClient {
	#config: MainConfig;
	#ws: WebSocket | null = null;
	#eventListeners: Map<SocketEventTypes, SocketEventListener<any>[]> = new Map();
	#statusListeners: ConnectionStatusListener[] = [];
	#connection: ConnectionData = {
		status: ConnectionStatus.NONE,
		attempts: 0,
	};

	constructor(config: MainConfig) {
		this.#config = config;
		this.connect();
	}

	get isConnected(): boolean {
		return this.#ws?.readyState === WebSocket.OPEN;
	}

	addStatusListener(listener: ConnectionStatusListener): void {
		this.#statusListeners.push(listener);
	}

	removeStatusListener(listener: ConnectionStatusListener): void {
		const i = this.#statusListeners.indexOf(listener);
		if (i !== -1) {
			this.#statusListeners.splice(i, 1);
		}
	}

	addListener(listener: SocketEventListener<any>): void {
		let typeHandlers = this.#eventListeners.get(listener.type);
		if (typeHandlers == null) {
			typeHandlers = [];
		}
		typeHandlers.push(listener);
		this.#eventListeners.set(listener.type, typeHandlers);
	}

	connect(): void {
		if (this.isConnected) {
			return;
		}
		if (this.#ws != null) {
			console.debug(`WS: already exist, not connected`);
			// this.disconnect();
			return;
		}

		const socketUrl = this.#config.apiBaseUrl.replace(/^http(s?):\/+/, "ws$1://") + "/ws";

		console.debug("WS: created new WS instance");
		console.debug("WS: connecting to " + socketUrl);
		this.#ws = new WebSocket(socketUrl, ["wss", "ws"]);

		this.#setConnectionStatus(ConnectionStatus.CONNECTING);
		this.#connection.attempts++;
		console.debug(`WS: trying to connect, attempt #${this.#connection.attempts}`);
		this.#connection.lastAttempt = new Date();
		this.#connection.handler = setTimeout(this.#reconnector.bind(this), 3000);
		this.#ws.onopen = this.#onSocketOpen.bind(this);
		this.#ws.onclose = this.#onSocketClose.bind(this);
		this.#ws.onmessage = this.#onMessage.bind(this);
		this.#ws.onerror = this.#onError.bind(this);
	}

	disconnect(): void {
		if (this.#ws == null) {
			return;
		}
		console.debug("WS: disconnecting");
		const ws = this.#ws;
		this.#ws = null;
		ws.onopen = () => {};
		ws.onclose = () => {};
		ws.onmessage = () => {};
		ws.onerror = () => {};
		try {
			ws.close();
		} catch (e) {
			console.error("WS: cannot close connection");
		}
		this.#setConnectionStatus(ConnectionStatus.OFFLINE);
	}

	send(type: SocketEventTypes, data: any): void {
		if (this.#ws != null && this.#ws.readyState === WebSocket.OPEN) {
			this.#ws.send(
				JSON.stringify({
					type,
					data,
				})
			);
		}
	}

	authenticate(token: string): void {
		console.debug("WS: authentication");
		if (this.#ws?.readyState === WebSocket.OPEN) {
			this.#ws.send(
				JSON.stringify({
					type: SocketEventTypes.Authorize,
					data: token,
				})
			);
		} else {
			console.debug("WS: socket is not yet open for authentication");
		}
	}

	logout(): void {
		console.debug("WS: logout?");
		if (this.#ws?.readyState === WebSocket.OPEN) {
			this.#setConnectionStatus(ConnectionStatus.ONLINE);
		} else {
			this.#setConnectionStatus(ConnectionStatus.OFFLINE);
		}
	}

	#reconnector(): void {
		if (this.#connection.handler != null) {
			clearTimeout(this.#connection.handler);
			this.#connection.handler = null;
		}
		if (!this.isConnected) {
			if (this.#connection.attempts < RECONNECT_ATTEMPTS) {
				this.connect();
			} else {
				this.#setConnectionStatus(ConnectionStatus.FAILED);
				console.warn("WS: cannot reconnect");
			}
		}
	}

	#setConnectionStatus(s: ConnectionStatus): void {
		this.#connection.status = s;
		this.#statusListeners.forEach((l) => l(s));
	}

	#onSocketOpen(ev: Event) {
		console.debug("WS: opened");
		this.#setConnectionStatus(ConnectionStatus.ONLINE);
		this.#connection.attempts = 0;
		// if (main().auth.tokenString != "") {
		// 	this.authenticate(main().auth.tokenString);
		// }
	}

	#onSocketClose() {
		this.#setConnectionStatus(ConnectionStatus.OFFLINE);
		console.debug("WS: socket closed");
		this.#reconnector();
	}

	#onError() {
		console.debug("WS: socket error");
	}

	#onMessage(msg: MessageEvent) {
		this.#parseMessage(msg);
	}

	#parseMessage(msg: MessageEvent) {
		try {
			const decoded = JSON.parse(msg.data);
			if (isMessagePayload(decoded)) {
				const handlers = this.#eventListeners.get(decoded.type);
				if (handlers != null) {
					handlers.forEach((h) => {
						if (h.isT(decoded.data)) {
							h.handler(decoded.data);
						}
					});
				}
				if (decoded.type === SocketEventTypes.AuthOk) {
					// set status authorized
					this.#setConnectionStatus(ConnectionStatus.AUTHORIZED);
				}
			}
		} catch (error) {
			console.error(error);
		}
	}
}
