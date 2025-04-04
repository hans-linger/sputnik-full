// should be in sync with schema.prisma model
import DBConnector from "./DB";
import { Prisma } from "@prisma/client";

// milliseconds
const UPDATE_INTERVAL = 60000;

export default class ServerStatus {
	static #instance: ServerStatus;

	#lastCoinUpdate: number = 0;

	static async getInstance(): Promise<ServerStatus> {
		if (ServerStatus.#instance == null) {
			ServerStatus.#instance = new ServerStatus();
		}
		await ServerStatus.#instance.loadStatus();
		return ServerStatus.#instance;
	}

	get lastCoinUpdate(): Readonly<number> {
		return this.#lastCoinUpdate;
	}

	async loadStatus(): Promise<Prisma.ServerStatusGetPayload<any> | null> {
		const db = DBConnector.getInstance().client.serverStatus;
		const status: Prisma.ServerStatusGetPayload<any> | null =
			await db.findFirst();
		if (status == null) {
			const obj = await db.create({
				data: {
					lastCoinUpdate: new Date(),
				},
			});
			this.#lastCoinUpdate = Date.now();
			return obj;
		}
		this.#lastCoinUpdate = status.lastCoinUpdate.getTime();
		const diff = Date.now() - this.lastCoinUpdate;
		return status;
	}

	async refresh(): Promise<Prisma.ServerStatusGetPayload<any> | null> {
		const db = DBConnector.getInstance().client.serverStatus;
		const status = await this.loadStatus();
		if (status != null) {
			const d = new Date();
			status.lastCoinUpdate = d;
			this.#lastCoinUpdate = d.getTime();
			try {
				const upres = await db.update({
					where: {
						id: status.id,
					},
					data: {
						lastCoinUpdate: d,
					},
				});
				return status;
			} catch (e) {
				console.error(e);
			}
		}
		return null;
	}

	get isObsolete(): boolean {
		const d = new Date();
		if (this.lastCoinUpdate === 0) {
			return true;
		}
		return d.getTime() - this.lastCoinUpdate > UPDATE_INTERVAL;
	}
}
