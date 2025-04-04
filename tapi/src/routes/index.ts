import { Express } from "express";
import { socialRoutes } from "./social";

export default function initRoutes(server: Express): void {
	server.use(socialRoutes);
}
