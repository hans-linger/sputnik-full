import { User } from "./core/auth/types";
import { FastifyReply } from "fastify";

export type ChainConfig = {
	id: string;
	rest: string;
	rpc?: string;
	name: string;
};

export type ChainAddressRaw = {
	chain_id: string;
	network_id: string;
	address: string;
};

export type ChainAddress = {
	chainId: string;
	networkId: string;
	address: string;
};

export type AssetRaw = {
	asset_id: string;
	name: string;
	type_is_crypto: number;
	price_usd?: number;
	id_icon?: string;
	chain_addresses?: ChainAddressRaw[];
};

export type Asset = {
	assetId: string;
	name: string;
	usdRate: number;
	addresses?: ChainAddress[];
};

export type VerifyCallback = (
	err?: Error | null | unknown,
	user?: Express.User | false,
	info?: object
) => void;

export type TokenData = {
	address: string;
	user?: User;
};

export type JwtData = {
	token: string;
} & TokenData;

export function sendError(
	res: FastifyReply,
	str: string,
	statusCode: number = 200
): void {
	res.statusCode = statusCode;
	res.send({
		status: "error",
		message: str,
	});
}

export function sendSuccess(
	res: FastifyReply,
	data: object | string | null
): void {
	res.send({
		status: "success",
		data: data ?? {},
	});
}
