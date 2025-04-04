import {
	isSocketEvent,
	SocketEventHandler,
	SocketEventTypes,
} from "./SocketEvents";
import { configDotenv } from "dotenv";
import { RawData, WebSocket, WebSocketServer } from "ws";
import { main } from "../main";

configDotenv({ override: true });
// const tokenKey = process.env.TOKEN_KEY ?? "";
// if (!nonEmptyString(tokenKey)) {
// 	throw new Error("Token key is required");
// }

export enum SocketMessageType {
	STRING,
	JSON,
}

export type Connection = {
	id: string;
	connection: WebSocket;
	authenticated: boolean;
	userId?: string;
	handlers: Map<SocketEventTypes, SocketEventHandler[]>;
};

export type SocketMessage = {
	type: SocketMessageType;
	data: string | object;
};

export default class SocketManager {
	static #instance: SocketManager;
	#socket: WebSocketServer;
	#connections: Map<string, Connection> = new Map();
	#connectionsByAddress: Map<string, string> = new Map();
	#handlers: Map<SocketEventTypes, SocketEventHandler[]> = new Map();

	private constructor() {
		this.#socket = new WebSocketServer({ noServer: true });
		this.#socket.on("error", (err: Error) => {
			console.error(err);
		});
		this.#socket.on("connection", this.#onConnection.bind(this));
		this.#socket.on("error", (err: Error) => {
			console.error(err);
		});
	}

	static getInstance(): SocketManager {
		if (SocketManager.#instance == null) {
			// if (server == null) {
			// 	throw new Error("Cannot instantiate WebSocket");
			// }
			SocketManager.#instance = new SocketManager();
		}
		return SocketManager.#instance;
	}

	logout(address: string): void {
		const userConnectionId = this.#connectionsByAddress.get(address);
		if (userConnectionId != null) {
			const connection = this.#connections.get(userConnectionId);
			if (connection != null && connection.authenticated) {
				connection.authenticated = false;
				this.#connections.set(connection.id, connection);
			}
		}
	}

	broadcast(
		event: SocketEventTypes,
		data: any,
		excludeUserIds?: string[]
	): void {
		const connections = this.#connections.values();
		if (connections != null) {
			for (let c of connections) {
				// if (
				// 	true
				// 	c.userId != null &&
				// 	(excludeUserIds == null || !excludeUserIds.includes(c.userId))
				// ) {
				c.connection.send(
					JSON.stringify({
						type: event,
						data: data,
					})
				);
				// }
			}
		}
	}

	send(userId: string | string[], event: SocketEventTypes, data: any): void {
		if (typeof userId === "string") {
			this.#sendToUser(userId, event, data);
		} else {
			userId.forEach(uid => {
				this.#sendToUser(uid, event, data);
			});
		}
	}

	#sendToUser(userId: string, event: SocketEventTypes, data: any): void {
		const userConnectionId = this.#connectionsByAddress.get(userId);
		if (userConnectionId != null) {
			const connection = this.#connections.get(userConnectionId);
			if (connection != null && connection.authenticated) {
				connection.connection.send(
					JSON.stringify({
						type: event,
						data,
					})
				);
			}
		}
	}

	onConnection(connection: WebSocket): void {
		return this.#onConnection(connection);
	}

	#onConnection(connection: WebSocket): void {
		const id = crypto.randomUUID();
		const connectionObject = {
			id,
			connection,
			authenticated: main().auth.isAuthorized,
			userid: main().auth.user.address,
			handlers: new Map<SocketEventTypes, SocketEventHandler[]>(),
		};
		this.#connections.set(id, connectionObject);
		this.#bindDefaultHandlers(connectionObject);
		// TODO authenticate
		connection.on("message", (msg: RawData) => {
			this.#onMessage(id, msg);
		});
		connection.on("close", () => {
			const c = this.#connections.get(id);
			if (c != null) {
				if (c.userId != null) {
					this.#connectionsByAddress.delete(c.userId);
				}
				this.#connections.delete(id);
			}
		});
		if (main().auth.isAuthorized) {
			// @ts-ignore
			this.send(main().auth.user.id, SocketEventTypes.AuthOk, {});
		}
	}

	#onMessage(connectionId: string, msg: RawData): void {
		if (!this.#connections.has(connectionId)) {
			console.error("No such connection");
		}
		try {
			const parsed = JSON.parse(msg.toString("utf-8"));
			if (isSocketEvent(parsed)) {
				// invoke handlers
				const connection = this.#connections.get(connectionId);
				if (connection != null) {
					const handlers = connection.handlers.get(parsed.type);
					if (handlers != null) {
						handlers.forEach(h => h(parsed.data));
					}
				}
				if (main().auth.isAuthorized) {
					// @ts-ignore
					this.broadcast(SocketEventTypes.AuthOk, {});
				}
			}
		} catch (e) {
			console.error("Wrong socket message", e);
		}
	}

	#bindDefaultHandlers(connection: Connection): void {
		connection.handlers.set(SocketEventTypes.Authorize, [
			async (data: any) => {
				/*
				jwt.verify(
					data,
					tokenKey,
					async (err: VerifyErrors | null, verifyData: any) => {
						if (err == null && isJwtData(verifyData)) {
							// check user in DB
							const user =
								await DBConnector.getInstance().client.account.findUnique({
									where: {
										id: verifyData.userId,
									},
									select: {
										token: true,
									},
								});
							if (user != null && user.token === data) {
								connection.authenticated = true;
								connection.userId = verifyData.userId;
								this.#connectionsByUserId.set(verifyData.userId, connection.id);
								this.send(verifyData.userId, SocketEventTypes.AuthOk, {
									connectionId: connection.id,
								});
							}
						}
					}
				);*/
			},
		]);
	}
}
