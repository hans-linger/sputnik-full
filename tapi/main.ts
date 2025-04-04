import { configDotenv } from "dotenv";
import express from "express";
import initAuth from "./src/core/auth";
import initRoutes from "./src/routes";

configDotenv({ override: true });

const server = express();
const port = process.env.PORT ?? "2025";

initAuth(server);
initRoutes(server);
server.listen(port);
