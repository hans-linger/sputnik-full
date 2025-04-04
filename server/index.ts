import fastify from "fastify";
import { configDotenv } from "dotenv";
import { useChainsRoutes } from "./src/routes/chains";
import { useCommonRoutes } from "./src/routes/common";
import { useAuth } from "./src/core/auth/init";
import { setMainInstance } from "./src/core/main";
import { fastifyWebsocket } from "@fastify/websocket";
import { fastifyStatic } from "@fastify/static";
import path from "node:path";
import { useAuthRoutes } from "./src/routes/auth";
import { useUsersRoutes } from "./src/routes/users";
import { useNftRoutes } from "./src/routes/nfts";
import { useStockRoutes } from "./src/routes/stock";

configDotenv({ override: true });
const port = parseInt(process.env.SERVER_PORT ?? "34567") || 34567;

const date = new Date();
const dateString = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}-${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}`;

// note for win: create dir first!
const server = fastify({
	// logger: {
	// 	file: `./logs/${dateString}.log`,
	// 	level: "debug",
	// },
});

server.register(fastifyStatic, {
	root: path.join(__dirname, "/assets/avatars"),
	prefix: "/static/nfts/",
});

setMainInstance();

server.register(fastifyWebsocket, {
	options: {},
});
// SocketManager.getInstance();
server.addHook("preSerialization", async (req, res, payload) => {
	return {
		status: "success",
		data: payload,
	};
});

useAuth(server).then(() => {
	useCommonRoutes(server);
	useAuthRoutes(server);
	useUsersRoutes(server);
	useChainsRoutes(server);
	useNftRoutes(server);
	useStockRoutes(server);

	server.listen(
		{
			port: port,
		},
		(err, address) => {
			if (err) {
				process.exit("Cannot run server");
			}
		}
	);
});
