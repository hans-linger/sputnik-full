import { configDotenv } from "dotenv";
import * as crypto from "crypto";
import { PrismaClient } from "@prisma/client";

configDotenv({ override: true });

export default class DBConnector {
	static #instance: DBConnector;
	readonly client: PrismaClient;

	private constructor() {
		this.client = new PrismaClient();
	}

	static encryptString(str: string): string {
		const [vectorBuffer, vectorKey] = DBConnector.prepareCipher();
		const cipher = crypto.createCipheriv(
			"aes-256-cbc",
			vectorKey,
			vectorBuffer
		);
		const res = cipher.update(str, "utf-8");
		return Buffer.concat([res, cipher.final()]).toString("hex");
	}

	static decryptString(str: string): string {
		const [vectorBuffer, vectorKey] = DBConnector.prepareCipher();
		const cipher = crypto.createDecipheriv(
			"aes-256-cbc",
			vectorKey,
			vectorBuffer
		);
		const res = cipher.update(str, "hex", "utf-8");
		return res + cipher.final("utf-8");
	}

	static getInstance(): DBConnector {
		if (DBConnector.#instance == null) {
			DBConnector.#instance = new DBConnector();
		}
		return DBConnector.#instance;
	}

	private static prepareCipher(): [Buffer, Buffer] {
		const dbKey = process.env.DATABASE_KEY ?? "";
		const dbVector = process.env.DATABASE_VECTOR ?? "";
		if (dbKey === "" || dbVector === "") {
			throw new Error("Key is required");
		}
		const vectorBuffer = Buffer.from(dbVector, "hex");
		const vectorKey = Buffer.from(dbKey, "hex");
		return [vectorBuffer, vectorKey];
	}
}
