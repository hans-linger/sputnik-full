import { FastifyInstance } from "fastify";
import { configDotenv } from "dotenv";
import DBConnector from "../core/DB";
import ServerStatus from "../core/ServerStatus";
import { Asset, AssetRaw } from "../types";
import AssetHelper from "../helpers/AssetHelper";
import * as fs from "node:fs";
import axios from "axios";
import ChainClientFactory from "../core/chains/common/ChainClientFactory";
import { main } from "../core/main";
import { Balance } from "@prisma/client";
import { balanceToFloat } from "../helpers/misc";

configDotenv({ override: true });
const caApiKey = process.env.COINAPI_API_KEY;
if (caApiKey == null) {
	throw new Error("Could not find a Coinapi key");
}

export function useChainsRoutes(server: FastifyInstance) {
	server.get("/chains/list", async (req, res) => {
		res.send(ChainClientFactory.getList(true));
	});

	server.post<{ Body: { chainId: string; address: string } }>(
		"/chains/balance",
		async (req, res) => {
			if (req.body.chainId != null && req.body.address != null) {
				const config = ChainClientFactory.getClient(req.body.chainId);
				if (config != null) {
					const balance = await axios.get(
						config.chain.rest +
							"/cosmos/bank/v1beta1/balances/" +
							req.body.address
					);
					res.send(balance.data);
				} else {
					res.send({});
				}
			} else {
				res.send({});
			}
		}
	);

	server.get("/chains/balances", async (req, res) => {
		const chains = ChainClientFactory.getList(true);
		const user = main().auth.user;
		const addresses = user.addresses;
		const balances: Record<string, Balance[]> = {};
		for (let c in addresses) {
			const config = ChainClientFactory.getChainConfig(addresses[c].chainId);
			if (config != null) {
				try {
					const b = await axios.get(
						config.rest +
							"/cosmos/bank/v1beta1/balances/" +
							addresses[c].address
					);
					const balancesData = b.data.balances;
					if (balancesData != null && balancesData.length > 0) {
						balances[addresses[c].address] = balancesData.map(
							(x: { denom: string; amount: string }) => balanceToFloat(x)
						);
						addresses[c].balances = balances[addresses[c].address];
					} else {
						balances[addresses[c].address] = [];
					}
				} catch (e) {
					// console.error(e);
				}
			}
		}
		main().auth.updateAddresses(addresses);
		try {
			await main().auth.saveUser();
		} catch (e) {
			console.error(e);
		}
		res.send(balances);
	});

	server.post<{ Body: { address: string; chainId: string } }>(
		"/chains/collections",
		async (req, res) => {
			const address = req.body.address;
			const chain = ChainClientFactory.getClient(req.body.chainId);
			if (chain != null && address != null && address.startsWith("stars")) {
				const collections = await chain.getCollections(address);
				res.send(collections);
			} else {
				res.send("Wrong address");
			}
		}
	);

	server.post<{ Body: { address: string; chainId: string } }>(
		"/chains/tokens/stargaze",
		async (req, res) => {
			const address = req.body.address;
			const chain = ChainClientFactory.getClient(req.body.chainId);
			if (chain != null && address != null && address.startsWith("stars")) {
				await chain.loadNFTs(address);
				const tokens = chain.nfts;
				res.send(tokens);
			} else {
				res.send("Wrong address");
			}
		}
	);

	server.get("/chains/exchange-rates", async (req, res) => {
		try {
			const url = process.env.EXCHANGE_TWITTER_URL as string;

			if (
				req.jwtData.user == null ||
				req.jwtData.user.twitter == null ||
				url == null
			) {
				return res.send([]);
			}
			const rates = await axios.post(
				url,
				{
					my_name: req.jwtData.user.twitter.username,
					my_id: req.jwtData.user.twitter.accountId,
				},
				{
					// FIXME API token required
					headers: {
						"x-api-token":
							"",
					},
				}
			);
			res.send(rates.data);
		} catch (error) {
			console.error(error);
			res.send(768);
		}
	});

	server.get("/chains/rates", async (req, res) => {
		const db = DBConnector.getInstance().client;
		// get last update
		const status = await ServerStatus.getInstance();

		if (status.isObsolete) {
			// load rates from CoinApi.IO
			// const allAssets = await axios.get("https://api-realtime.exrates.coinapi.io/v1/assets", {
			// 	headers: {
			// 		"X-CoinAPI-Key": caApiKey,
			// 	},
			// });
			// const xChange = await axios.get(
			// 	"https://api-realtime.exrates.coinapi.io/v1/exchangerate/USD",
			// 	{
			// 		headers: {
			// 			"X-CoinAPI-Key": caApiKey,
			// 		},
			// 	}
			// );
			// await db.coin.deleteMany();
			// await db.coin.createMany({
			// 	data: data,
			// });

			let allAssets = JSON.parse(
				fs.readFileSync("./data/rates.json", "utf8")
			) as AssetRaw[];
			if (allAssets != null && allAssets.length > 0) {
				allAssets = allAssets.filter((asset: AssetRaw) => {
					return asset.price_usd != null && asset.type_is_crypto === 1;
				});
				const data: Asset[] = allAssets.map(a =>
					AssetHelper.convertAssetRaw(a)
				);
				await DBConnector.getInstance().client.coin.createMany({
					data,
				});
			}
		}
		let allAssets = await DBConnector.getInstance().client.coin.findMany();
		res.type("application/jsom").send(allAssets);
	});
}
