import { FastifyInstance } from "fastify";
import SocketManager from "../core/socket/SocketManager";

export function useCommonRoutes(server: FastifyInstance): void {
	server.get("/hello", (req, res) => {
		res.send(req.jwtData);
	});
	server.get("/ws", { websocket: true }, (socket, req) => {
		SocketManager.getInstance().onConnection(socket);
	});
}
