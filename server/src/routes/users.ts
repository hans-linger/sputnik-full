import { FastifyInstance, FastifyRequest } from "fastify";
import { main } from "../core/main";
import DBConnector from "../core/DB";

export function useUsersRoutes(server: FastifyInstance) {
	server.get<{
		Querystring: {
			address: string;
		};
	}>("/users/nfts", async (req: FastifyRequest, res) => {
		const user = main().auth.user;
		if (user.id == null) {
			return res.send([]);
		}
		const db = DBConnector.getInstance().client;
		const nfts = await db.nft.findMany({
			where: { ownerId: user.id },
			take: 10,
		});

		const collections = await db.nftCollection.findMany();
		res.send({ nfts, collections, count: 10 });
	});

	server.post<{
		Body: {
			addresses: Record<string, string>;
		};
	}>("/users/save-addresses", async (req, res) => {
		const db = DBConnector.getInstance().client;
		const data = Object.entries(req.body.addresses).map(([k, v]) => {
			return {
				chainId: k,
				address: v,
			};
		});
		const user = main().auth.user;
		if (user.id != null) {
			try {
				const upres = await db.account.update({
					where: {
						id: user.id,
					},
					data: {
						addresses: data,
					},
				});
			} catch (e) {
				console.error(e);
			}
		}
		res.send("ok");
	});

	server.post<{ Body: { chainId: string } }>(
		"/users/chain-address",
		async (req, res) => {
			const user = main().auth.user;
			const db = DBConnector.getInstance().client;
			const acc = await db.account.findFirst({
				where: {
					addresses: {
						some: {
							chainId: req.body.chainId,
						},
					},
				},
			});
			res.send(acc);
		}
	);
}
